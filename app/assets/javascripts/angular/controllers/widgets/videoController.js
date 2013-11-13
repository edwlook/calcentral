(function(window, calcentral) {
  'use strict';

  /**
   * Video controller
   */
  calcentral.controller('VideoController', ['$http', '$scope', function($http, $scope) {

    $scope.videos = [];
    $scope.data;
    var ccns = [];

    var request = function(ccn) {
      $http.get('/api/my/videos/' + $scope.year + '/' + $scope.semesterCode + '/' + ccn).success(function(data) {
        angular.forEach(data.videos, function(video, index) {
          $scope.videos.push(video);
        });
          var elements = document.getElementsByClassName('lecture-videos');

          //Why doesn't this work?
          // for (var i = 0; i < 5; i++) {
          //   angular.element(elements[i]).ready( function() {
          //     _V_(elements[i], { 'controls': true, 'autoplay': false, 'preload': 'none' });
          //   });
          // }

          angular.element(elements[0]).ready( function() {
            _V_(elements[0], { 'controls': true, 'autoplay': false, 'preload': 'none' });
          } );
          angular.element(elements[1]).ready( function() {
            _V_(elements[1], { 'controls': true, 'autoplay': false, 'preload': 'none' });
          } );
          angular.element(elements[2]).ready( function() {
            _V_(elements[2], { 'controls': true, 'autoplay': false, 'preload': 'none' });
          } );
          angular.element(elements[3]).ready( function() {
            _V_(elements[3], { 'controls': true, 'autoplay': false, 'preload': 'none' });
          } );
          angular.element(elements[4]).ready( function() {
            _V_(elements[4], { 'controls': true, 'autoplay': false, 'preload': 'none' });
          } );
      });
    };

    // Execute request via /api/my/videos/:year/:semester/:ccn for each CCN
    // Add any videos retrieved to $scope.videos
    var requestVideos = function() {
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
      }
    });

    // setTimeout(function() {
    //   for (var i = 0; i < $scope.videos.length; i++) {
    //     _V_('lecture_video_' + i, { 'controls': true, 'autoplay': false, 'preload': 'auto' });
    //   }
    // }, 2000);

  }]);


})(window, window.calcentral);
