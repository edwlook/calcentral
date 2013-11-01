(function(window, calcentral) {
  'use strict';

  /**
   * Video controller
   */
  calcentral.controller('VideoController', ['$http', '$scope', function($http, $scope, $timeout) {

    $scope.videos = [];
    $scope.data;
    var ccns = [];
    var urls = [];

    var findVideos = function() {
      var sort = function(obj) {
        var title = obj.mediapackage.title;
        var tracks = obj.mediapackage.media.track;
        angular.forEach(tracks, function(track) {
          if (track.mimetype === 'video/mp4') {
           $scope.videos.push({
             title: title,
             link: track.url
           });
          }
        });
      };
      angular.forEach($scope.data, sort)
    };

    var buildUrls = function(year, semesterCode) {
      angular.forEach(ccns, function(ccn) {
        var requestUrl = 'http://playback-qa.ets.berkeley.edu/search/paellaEpisodeListing.json?q=&sid=' + year + semesterCode + ccn;
        urls.push('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22' + encodeURIComponent(requestUrl) + '%22&format=json&callback=JSON_CALLBACK');
      })
    };

    var requestVideos = function() {
      var request = function(url) {
        $http.jsonp(url).
        success(function(data, status, headers, config) {
          $scope.data = data.query.results['search-results'].result;
          findVideos();
        });
      };
      angular.forEach(urls, request);
    };

    // Collect class page CCNs and execute request
    $scope.$watchCollection('[$parent.selected_course.sections, $parent.selected_semester]', function(newValues) {
      if (newValues[0] && newValues[1]) {
        angular.forEach(newValues[0], function(section) {
          ccns.push(section.ccn);
        });
        var year = newValues[1].year,
            semesterCode = newValues[1].code;
        buildUrls(year, semesterCode);
        requestVideos();
      }
    });

  }]);

})(window, window.calcentral);
