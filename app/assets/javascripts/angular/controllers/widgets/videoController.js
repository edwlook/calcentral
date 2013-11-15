(function(window, calcentral) {
  'use strict';

  /**
   * Video controller
   */
  calcentral.controller('VideoController', ['$http', '$scope', '$timeout', function($http, $scope, $timeout) {

    $scope.videos = [];
    $scope.data;

    var initPlayer = function() {
      $timeout(function() {
        var elements = document.getElementsByTagName('video');
        for (var i = 0; i < elements.length; i++) {
          _V_(elements[i], { 'controls': true, 'autoplay': false, 'preload': 'none' });
        }
      }, 1)
    };

    // Execute request via /api/my/videos/:ccns as a comma separated list of CCNs
    // Add any videos retrieved to $scope.videos
    var requestVideos = function(ccns) {
      $http.get('/dummy/json/videos.json').success(function(data) {
      // $http.get('/api/my/videos/' + ccns.join(',')).success(function(data) {
        angular.extend($scope, data);
        initPlayer();
      });
    };

    // Collect class page CCNs and execute request once available
    $scope.$watchCollection('[$parent.selected_course.sections, $parent.selected_semester]', function(newValues) {
      if (newValues[0] && newValues[1]) {
        $scope.year = newValues[1].year,
        $scope.semesterCode = newValues[1].code;
        var ccns = [];
        angular.forEach(newValues[0], function(section) {
          ccns.push($scope.year + $scope.semesterCode + section.ccn);
        });
        requestVideos(ccns);
      }
    });

  }]);

})(window, window.calcentral);
