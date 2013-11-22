(function(window, calcentral) {
  'use strict';

  /**
   * Video controller
   */
  calcentral.controller('VideoController', ['$http', '$scope', '$timeout', function($http, $scope, $timeout) {

    $scope.videos = [];
    $scope.data;

    var getVideoLink = function(playlistID) {
      $http.get('/api/my/videos_youtube/' + playlistID).success(function(data) {
        angular.extend($scope, data);
        console.log($scope.videos);
      })
    };

    var getVideoPlaylist = function(courseTitle, courseSection, courseSemester) {
      var playlistID = '';
      var testTitle = courseTitle + ', ' + '001' + ' - ' + courseSemester;
      $http.get('/json/videos.json').success(function(data) {
        angular.forEach(data.courses, function(course) {
          if (course.semester == courseSemester && course.title.toLowerCase() == testTitle.toLowerCase()) {
            playlistID = course.youTube;
            return
          }
        })
        getVideoLink(playlistID);
      })
    };

    var formatClassTitles = function() {
      // console.log($scope.selected_course);
      var courseTitle = $scope.selected_course.course_number;
      var courseSection = $scope.selected_course.sections[0].section_number;
      var courseSemester = $scope.selected_semester.name
      // var title = courseTitle.toLowerCase();
      // console.log(title);
      getVideoPlaylist(courseTitle, courseSection, courseSemester);
    }
    // Execute request via /api/my/videos/:ccns as a comma separated list of CCNs
    // Add any videos retrieved to $scope.videos
    // var requestVideos = function(ccns) {
    //   // $http.get('/dummy/json/videos.json').success(function(data) {
    //   $http.get('/api/my/videos/' + ccns.join(',')).success(function(data) {
    //     angular.extend($scope, data);
    //     initPlayer();
    //   });
    // };

    // Collect class page CCNs and execute request once available
    $scope.$watchCollection('[$parent.selected_course.sections, $parent.selected_semester]', function(newValues) {
      if (newValues[0] && newValues[1]) {
        $scope.year = newValues[1].year,
        $scope.semesterCode = newValues[1].code;
        var ccns = [];
        angular.forEach(newValues[0], function(section) {
          ccns.push($scope.year + $scope.semesterCode + section.ccn);
        });
        formatClassTitles();
        // requestVideos(ccns);
      }
    });

  }]);

})(window, window.calcentral);
