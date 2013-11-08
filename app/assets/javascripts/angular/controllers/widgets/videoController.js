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

    // Execute request via /api/my/videos/:year/:semester/:ccn for each CCN
    // Add any videos retrieved to $scope.videos
    var requestVideos = function() {
      var request = function(ccn) {
        $http.get('/api/my/videos/' + $scope.year + '/' + $scope.semesterCode + '/' + ccn).success(function(data) {
          angular.forEach(data.videos, function(video) {
            $scope.videos.push(video);
          });
        });
      };
      angular.forEach(ccns, request);
    };

    // Collect class page CCNs and execute request once available
    $scope.$watchCollection('[$parent.selected_course.sections, $parent.selected_semester]', function(newValues) {
      if (newValues[0] && newValues[1]) {
        angular.forEach(newValues[0], function(section) {
          ccns.push(section.ccn);
        });
        $scope.year = newValues[1].year,
        $scope.semesterCode = newValues[1].code;
        requestVideos();
        $scope.isLoaded = true;
      }
    });

  }]);

})(window, window.calcentral);
