(function(window, calcentral) {
  'use strict';

  /**
   * Video controller
   */
  calcentral.controller('VideoController', ['$http', '$scope', function($http, $scope) {

    var getVideos = function(courseDepartment, courseCategory, courseSection, courseSemester) {
      var title = courseDepartment + ' ' + courseCategory + ', ' + courseSection + ' - ' + courseSemester;
      $http.get('/api/my/videos/' + title).success(function(data) {
        angular.extend($scope, data);
      })
    };

    var formatClassTitles = function() {
      var courseDepartment = $scope.selected_course.dept_desc;
      var courseCategory = $scope.selected_course.course_catalog;
      var courseSection = $scope.selected_course.sections[0].section_number;
      var courseSemester = $scope.selected_semester.name;
      getVideos(courseDepartment, courseCategory, courseSection, courseSemester);
    };

    $scope.$watch('$parent.selected_course.sections', function(newValues) {
      if (newValues) {
        formatClassTitles();
      }
    });

  }]);

})(window, window.calcentral);
