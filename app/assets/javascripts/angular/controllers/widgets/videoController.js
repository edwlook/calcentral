(function(window, calcentral) {
  'use strict';

  /**
   * Video controller
   */
  calcentral.controller('VideoController', ['$http', '$scope', function($http, $scope) {

    $scope.videos = [];
    $scope.isLoaded = false;
    $scope.hasVideos = false;
    $scope.data;
    var ccns = [];
    // var urls = [];

    // var findVideos = function() {
    //   var sort = function(obj) {
    //     var title = obj.mediapackage.title;
    //     var posters = [];
    //     var id = obj.id;
    //     var tracks = obj.mediapackage.media.track;
    //     var attachments = obj.mediapackage.attachments.attachment;
    //     attachments.every(function(attachment) {
    //       if (attachment.mimetype === 'image/jpeg') {
    //         posters.push(attachment.url);
    //         return false;
    //       } else {
    //         return true;
    //       }
    //     });
    //     // angular.forEach(tracks, function(track) {
    //     //   if (track.mimetype === 'video/mp4') {
    //     //    $scope.videos.push({
    //     //      title: title,
    //     //      paella: 'http://playback-qa.ets.berkeley.edu/paella/ui/watch.html?server=&id=' + id,
    //     //      poster: posters[0],
    //     //      link: track.url
    //     //    });
    //     //    return;
    //     //   }
    //     // });

    //     //Finds first mp4 and stops
    //     tracks.every(function(track) {
    //       if (track.mimetype === 'video/mp4') {
    //        $scope.videos.push({
    //          title: title,
    //          paella: 'http://playback-qa.ets.berkeley.edu/paella/ui/watch.html?server=&id=' + id,
    //          poster: posters[0],
    //          link: track.url
    //        });
    //        return false;
    //       } else {
    //         return true;
    //       }
    //     });
    //   };
    //   angular.forEach($scope.data, sort)
    // };

    // var buildUrls = function(year, semesterCode) {
    //   angular.forEach(ccns, function(ccn) {
    //     var requestUrl = 'http://playback-qa.ets.berkeley.edu/search/paellaEpisodeListing.json?q=&sid=' + year + semesterCode + ccn;
    //     //urls.push('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22' + encodeURIComponent(requestUrl) + '%22&format=json&callback=JSON_CALLBACK');
    //     urls.push(encodeURIComponent(requestUrl));
    //   })
    // };

    var requestVideos = function() {
      var request = function(ccn) {
        // $http.jsonp(url).
        // success(function(data, status, headers, config) {
        //   $scope.data = data.query.results['search-results'].result;
        //   findVideos();
        // });
        $http.get('/api/my/videos/' + $scope.year + '/' + $scope.semesterCode + '/' + ccn).success(function(data) {
          // angular.extend($scope, data);
          // $scope.data = data.videos['search-results'].result;
          angular.forEach(data.videos, function(video) {
            $scope.videos.push(video);
          });
          // findVideos();
          // console.log($scope.data);
        });
      };
      angular.forEach(ccns, request);
    };

    // Collect class page CCNs and execute request
    $scope.$watchCollection('[$parent.selected_course.sections, $parent.selected_semester]', function(newValues) {
      if (newValues[0] && newValues[1]) {
        angular.forEach(newValues[0], function(section) {
          ccns.push(section.ccn);
        });
        $scope.year = newValues[1].year,
        $scope.semesterCode = newValues[1].code;
        // buildUrls(year, semesterCode);
        requestVideos();
        $scope.isLoaded = true;
        // if ($scope.videos.length > 0) {$scope.hasVideos = true;}
      }
    });

  }]);

})(window, window.calcentral);
