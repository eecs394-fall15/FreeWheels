angular
  .module('example')
  .controller('DrawerController', function($scope, supersonic) {
    $scope.typesList = [
                  {'name':'Animals','checked': true}, 
                  {'name':'Library','checked': true},
                  {'name':'Museums and Art','checked': true},
                  {'name':'Nature','checked': true},
                  {'name':'Things to do','checked': true},
                  {'name':'Places of worship','checked': true}];


   $scope.submitFilters = function()
   {
        supersonic.data.channel('filters').publish($scope.typesList);
      }
 })