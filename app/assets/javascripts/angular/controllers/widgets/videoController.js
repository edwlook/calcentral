(function(window, calcentral) {
  'use strict';

  /**
   * Video controller
   */
  calcentral.controller('VideoController', ['$http', '$scope', function($http, $scope) {

    $scope.videos = [];
    $scope.data;
    var ccns = [];

    // Execute request via /api/my/videos/:ccns as a comma separated list of CCNs
    // Add any videos retrieved to $scope.videos
    var requestVideos = function() {
      $http.get('/api/my/videos/' + ccns.join(',')).success(function(data) {
        $scope.videos = data.videos;
      });
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
      }
    });

  }]);

})(window, window.calcentral);
