(function(angular) {
  'use strict';

  /**
   * Webcast controller
   */
  angular.module('calcentral.controllers').controller('WebcastController', function(apiService, $http, $route, $routeParams, $scope) {
    // Is this for an official campus class or for a Canvas course site?
    var courseMode = 'campus';

    /**
     * Select the first options in the video / audio feed
     */
    var selectFirstOptions = function() {
      if ($scope.videos) {
        $scope.selectedVideo = $scope.videos[0];
      }
      if ($scope.audio) {
        $scope.selectedAudio = $scope.audio[0];
      }
    };

    var webcastUrl = function(courseId) {
      // return '/dummy/json/media.json';
      if (courseMode === 'canvas') {
        return '/api/canvas/media/' + courseId;
      } else {
        return '/api/media/' + courseId;
      }
    };

    var setSelectedOption = function() {
      if (!$scope.videos.length && $scope.audio.length) {
        $scope.switchSelectedOption($scope.selectOptions[1]);
      } else {
        $scope.switchSelectedOption($scope.selectOptions[0]);
      }
    };

    var getWebcasts = function(title) {
      $http.get(webcastUrl(title)).success(function(data) {
        angular.extend($scope, data);
        selectFirstOptions();
        setSelectedOption();
      });
    };

    // Replaces '/' and '%2F' with '_slash_' to appease Apache. See CLC-4279.
    // We can remove this once Apache is updated and allows 'AllowEncodedSlashes NoDecode'
    var encodeSlash = function(string) {
      return string.replace(/\/|%2F/g, '_slash_');
    };

    var formatClassTitle = function() {
      var courseYear = encodeURIComponent($scope.selectedSemester.termYear);
      var courseSemester = encodeURIComponent($scope.selectedSemester.termCode);
      var courseDepartment = encodeURIComponent($scope.selectedCourse.dept);
      var courseCatalog = encodeURIComponent($scope.selectedCourse.courseCatalog);
      var title = courseYear + '/' +
                  courseSemester + '/' +
                  encodeSlash(courseDepartment) + '/' +
                  encodeSlash(courseCatalog);
      getWebcasts(title);
    };

    $scope.switchSelectedOption = function(selectedOption) {
      $scope.currentSelection = selectedOption;
    };

    var setSelectOptions = function() {
      var options = ['Video', 'Audio'];
      $scope.selectOptions = options;
    };

    if ($routeParams.canvasCourseId || $route.current.isEmbedded) {
      courseMode = 'canvas';
      var canvasCourseId;
      if ($route.current.isEmbedded) {
        canvasCourseId = 'embedded';
        $scope.isEmbedded = true;
      } else {
        canvasCourseId = $routeParams.canvasCourseId;
      }
      apiService.util.setTitle('Course Webcasts');
      getWebcasts(canvasCourseId);
      setSelectOptions();
    } else {
      $scope.$watchCollection('[$parent.selectedCourse.sections, api.user.profile.features.videos]', function(returnValues) {
        if (returnValues[0] && returnValues[1] === true) {
          formatClassTitle();
          setSelectOptions();
        }
      });
    }

  });

})(window.angular);
