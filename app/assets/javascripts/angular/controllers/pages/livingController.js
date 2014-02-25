(function(angular) {
  'use strict';

  /**
   * Academics controller
   */
  angular.module('calcentral.controllers').controller('LivingController', function(apiService, $http, $routeParams, $scope, $q) {

    apiService.util.setTitle('My Living');

    $scope.navigation = [
      {
        label: 'Laundry',
        categories: [
          {
            name: 'Available Machines',
            id: 'availablemachines'
          }
        ]
      }
    ];


    /**
     * Get the category name, when you feed in an id
     * @param {String} categoryId A category id
     * @return {String} The category name
     */
    var getCategoryName = function(categoryId) {
      var navigation = $scope.navigation;

      // We want to explicitly check for undefined here
      // since other values need to result in a 404.
      if (categoryId === undefined) {
        return navigation[0].categories[0].name;
      }

      for (var i = 0; i < navigation.length; i++) {
        for (var j = 0; j < navigation[i].categories.length; j++) {
          if (navigation[i].categories[j].id === categoryId) {
            return navigation[i].categories[j].name;
          }
        }
      }
    };

    $scope.currentTopCategory = getCategoryName($routeParams.category);
    // console.log($routeParams.category);

  });
})(window.angular);
