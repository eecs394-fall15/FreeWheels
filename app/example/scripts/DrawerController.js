angular
  .module('example')
  .controller('DrawerController', function($scope, supersonic) {
    $scope.typesList = [
                  {'name':'art_gallery','checked': true}, 
                  {'name':'aquarium','checked': true},
                  {'name':'city_hall','checked': true},
                  {'name':'embassy','checked': true},
                  {'name':'hindu_temple','checked': true},
                  {'name':'mosque','checked': true},
                  {'name':'museum','checked': true},
                  {'name':'park','checked': true},
                  {'name':'place_of_worship','checked': true},
                  {'name':'stadium','checked': true},
                  {'name':'synagogue','checked': true},
                  {'name':'natural_feature','checked': true}];
    $scope.updateArray = function(){
      supersonic.logger.log("This worked");
    };
 })