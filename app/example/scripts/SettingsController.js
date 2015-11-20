angular
  .module('example')
  .controller('SettingsController', function($scope, supersonic){
  	$scope.radiusSlider = 2.0;
    var toggleCategoryIcon = 0;
    var toggleFrequencyIcon = 0;
    $scope.categoriesIcon = "super-chevron-down";
     $scope.FrequencyIcon = "super-chevron-down";
     $scope.selectedFrequency = {
      value: 0.5};
  	 $scope.typesList = [
                  {'name':'Amusement','checked': true, 'icon':'ios-americanfootball-outline'},
                  {'name':'Animals','checked': true,'icon':'ios-paw-outline'}, 
                  {'name':'Library','checked': true, 'icon':'ios-book-outline'},
                  {'name':'Museums and Art','checked': true, 'icon':'ios-flask-outline'},
                  {'name':'Nature','checked': true, 'icon':'leaf'},
                  {'name':'Places of worship','checked': true, 'icon':'ios-moon-outline'}];

      $scope.FrequencyList = [
                  {'name':'Default', 'value': 0.5},
                  {'name':'Never','value': 0},
                  {'name':'Every 30 minutes','value': 30},
                  {'name':'Every 1 hour','value': 60}, 
                  {'name':'Every 2 hours','value': 120},
                  {'name':'Every 3 hours','value': 180},
                  {'name':'Every 4 hours', 'value': 240},
                  {'name':'Every 5 hours', 'value': 300}];
     $scope.hideTypesFilter = true;
     $scope.hideFrequencyFilter = true;


     $scope.SetCurrentItem =function(value)
     {
        $scope.selectedFrequency.value = value;
        supersonic.data.channel('refreshTime').publish(value);
     }
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

   $scope.hideTypesFilters = function(){
   	$scope.hideTypesFilter = !$scope.hideTypesFilter;
    if (toggleCategoryIcon == 0){
      $scope.categoriesIcon = "super-chevron-up";
      toggleCategoryIcon = 1;
    }
    else{
      $scope.categoriesIcon = "super-chevron-down";
      toggleCategoryIcon = 0;
    }
   }

   $scope.hideFrequencyFilters = function(){
    $scope.hideFrequencyFilter = !$scope.hideFrequencyFilter;
    if (toggleFrequencyIcon == 0){
      $scope.FrequencyIcon = "super-chevron-up";
      toggleFrequencyIcon = 1;
    }
    else{
      $scope.FrequencyIcon = "super-chevron-down";
      toggleFrequencyIcon = 0;
    }
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