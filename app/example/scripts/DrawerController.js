angular
  .module('example')
  .controller('DrawerController', function($scope, supersonic) {
    $scope.typesList = [
                  {'name':'art_gallery','checked': false}, 
                  {'name':'aquarium','checked': false},
                  {'name':'city_hall','checked': false},
                  {'name':'embassy','checked': false},
                  {'name':'hindu_temple','checked': false},
                  {'name':'mosque','checked': false},
                  {'name':'museum','checked': false},
                  {'name':'park','checked': false},
                  {'name':'place_of_worship','checked': false},
                  {'name':'stadium','checked': false},
                  {'name':'synagogue','checked': false},
                  {'name':'natural_feature','checked': false}];


   $scope.submitFilters = function()
   {
        supersonic.data.channel('filters').publish($scope.typesList);
      }
 })