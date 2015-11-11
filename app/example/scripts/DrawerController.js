angular
  .module('example')
  .controller('DrawerController', function($scope, supersonic) {
    $scope.typesList = [
                  {'name':'Animals','checked': true,'icon':'ios-paw-outline'}, 
                  {'name':'Library','checked': true, 'icon':'ios-book-outline'},
                  {'name':'Museums and Art','checked': true, 'icon':'ios-flask-outline'},
                  {'name':'Nature','checked': true, 'icon':'leaf'},
                  {'name':'Things to do','checked': true, 'icon':'ios-americanfootball-outline'},
                  {'name':'Places of worship','checked': true, 'icon':'ios-moon-outline'}];


   $scope.submitFilters = function()
   {
        supersonic.data.channel('filters').publish($scope.typesList);
      }
 })