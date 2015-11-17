angular
  .module('example')
  .controller('SettingsController', function($scope, supersonic){
  	$scope.radiusSlider = 2.0;
  	 $scope.typesList = [
                  {'name':'Amusement','checked': true, 'icon':'ios-americanfootball-outline'},
                  {'name':'Animals','checked': true,'icon':'ios-paw-outline'}, 
                  {'name':'Library','checked': true, 'icon':'ios-book-outline'},
                  {'name':'Museums and Art','checked': true, 'icon':'ios-flask-outline'},
                  {'name':'Nature','checked': true, 'icon':'leaf'},
                  {'name':'Places of worship','checked': true, 'icon':'ios-moon-outline'}];
     $scope.hideFilter = true;


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

   $scope.hideFilters = function(){
   	$scope.hideFilter = !$scope.hideFilter;
   }

   $scope.translate = function(value){
   	return value + "mi";
   }

   $scope.$watch('radiusSlider', function(newvalue)
   {
   	//alert(newvalue);
   			supersonic.logger.log(newvalue);
   			supersonic.data.channel('radius').publish(newvalue);
   });
  }); //ngGPlacesAPI, $http, NgMap, $timeout) {