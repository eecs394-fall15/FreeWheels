angular
  .module('example')
  .controller('SettingsController', function($scope, supersonic){
  	 $scope.typesList = [
                  {'name':'Amusement','checked': true, 'icon':'ios-americanfootball-outline'},
                  {'name':'Animals','checked': true,'icon':'ios-paw-outline'}, 
                  {'name':'Library','checked': true, 'icon':'ios-book-outline'},
                  {'name':'Museums and Art','checked': true, 'icon':'ios-flask-outline'},
                  {'name':'Nature','checked': true, 'icon':'leaf'},
                  {'name':'Places of worship','checked': true, 'icon':'ios-moon-outline'}];


   $scope.submitFilters = function()
   {
        supersonic.data.channel('filters').publish($scope.typesList);
        //window.localStorage.setItem("typesList",$scope.typesList);
      }

   $scope.removeView = function(){
   	var options = {
  		animate: false
	}

	supersonic.ui.modal.hide();

   }
  }); //ngGPlacesAPI, $http, NgMap, $timeout) {