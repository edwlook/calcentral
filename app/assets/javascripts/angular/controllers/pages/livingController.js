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

    $scope.laundry = [
      {
        location: 'Unit 1 Freeborn',
        washers: '2',
        washersAvailable: '2',
        washersStatus: '2/2',
        dryers: '2',
        dryersAvailable: '2',
        dryersStatus: '2/2',
        starred: false
      },
      {
        location: 'Unit 1 Cheney 2',
        washers: '2',
        washersAvailable: '1',
        washersStatus: '1/2',
        dryers: '2',
        dryersAvailable: '2',
        dryersStatus: '2/2',
        starred: true
      },
      {
        location: 'Unit 2 Davidson 6',
        washers: '2',
        washersAvailable: '2',
        washersStatus: '2/2',
        dryers: '2',
        dryersAvailable: '2',
        dryersStatus: '2/2',
        starred: false
      },
      {
        location: 'Foothill Hillside',
        washers: '10',
        washersAvailable: '6',
        washersStatus: '6/10',
        dryers: '9',
        dryersAvailable: '3',
        dryersStatus: '3/9',
        starred: false
      },
      {
        location: 'CKC Building 11 Lower',
        washers: '2',
        washersAvailable: '2',
        washersStatus: '2/2',
        dryers: '2',
        dryersAvailable: '2',
        dryersStatus: '2/2',
        starred: false
      },
      {
        location: 'International House',
        washers: '9',
        washersAvailable: '4',
        washersStatus: '4/9',
        dryers: '12',
        dryersAvailable: '10',
        dryersStatus: '10/12',
        starred: false
      }
    ];

    $scope.toggleStar = function(machine) {
      var indexOfMachine = $scope.laundry.indexOf(machine);
      $scope.laundry[indexOfMachine].starred = !$scope.laundry[indexOfMachine].starred;
    };

    $scope.getStarredClass = function(machine) {
      if (machine.starred) {
        return 'starred';
      }
    };

    //http://jsfiddle.net/vojtajina/js64b/14/
    $scope.sort = {
      column: ['starred', '-location'],
      descending: true
    };

    /**
     * Return the right sorting class for the table headers
     */
    $scope.getSortClass = function(column) {
      var sortUpDown = $scope.sort.descending ? 'down' : 'up';
      return $scope.sort.column.indexOf(column) !== -1 && 'fa fa-chevron-' + sortUpDown;
    };

    /**
     * Change the sorting for a certain column
     */
    $scope.changeSorting = function(column) {
      var sort = $scope.sort;
      if (angular.equals(sort.column, [column])) {
        sort.descending = !sort.descending;
      } else {
        sort.column = [column];
        sort.descending = false;
      }
    };

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
