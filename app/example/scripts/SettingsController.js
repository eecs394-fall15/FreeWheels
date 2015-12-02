angular
  .module('example')
  .controller('SettingsController', function($scope, supersonic){
  	$scope.radiusSlider = 2.0;
    var toggleCategoryIcon = 0;
    var toggleFrequencyIcon = 0;
    var toggleRatingIcon = 0;
    var toggleSortingIcon = 0;
    $scope.categoriesIcon = "super-chevron-down";
     $scope.FrequencyIcon = "super-chevron-down";
     $scope.RatingIcon = "super-chevron-down";
     $scope.SortingIcon = "super-chevron-down";

     $scope.selectedFrequency = {
      value: 0.5};
      $scope.selectedRating = {
      value: 4};
       $scope.selectedSorting = {
      value: 'R'};

  	 $scope.typesList = [
                  {'name':'Amusement Park', 'category':'amusement_park', 'checked': true},
                  {'name':'Art Gallery', 'category':'art_gallery', 'checked': true},
                  {'name':'Bowling Alley', 'category':'bowling_alley', 'checked': true},
                  {'name':'Casino', 'category':'casino', 'checked': true},
                  {'name':'Movie Theater', 'category':'movie_theater', 'checked': true},
                  {'name':'Museum', 'category':'museum', 'checked': true},
                  {'name':'Night Club', 'category':'night_club', 'checked': true},
                  {'name':'Park', 'category':'park', 'checked': true},
                  {'name':'Place of Worship', 'category':'place_of_worship', 'checked': true},
                  {'name':'Restaurant', 'category':'restaurant', 'checked': true},
                  {'name':'Spa', 'category':'spa', 'checked': true},
                  {'name':'Stadium', 'category':'stadium', 'checked': true},
                  {'name':'Store', 'category':'store', 'checked': true},
                  {'name':'University', 'category':'university', 'checked': true},
                  {'name':'Zoo', 'category':'zoo', 'checked': true}
                  ];

      $scope.FrequencyList = [
                  {'name':'Manual', 'value': 100},
                  {'name':'Every 10 seconds (Default)','value': 1/6},
                  {'name':'Every 5 minutes','value': 5}, 
                  {'name':'Every 10 minutes','value': 10},
                  {'name':'Every 30 minutes','value': 30},
                  {'name':'Every hour', 'value': 60}];

       $scope.RatingList = [
                  {'name':'4 Stars & Up', 'value': 4},
                  {'name':'3 Stars & Up','value': 3},
                  {'name':'2 Stars & up','value': 2},
                  {'name':'1 Star & up','value': 1}, 
                  {'name':'No Ratings','value': 0}];

      $scope.SortingList = [
                  {'name':'Distance', 'value': 'D'},
                  {'name':'Rating','value': 'R'}];

     $scope.hideTypesFilter = true;
     $scope.hideFrequencyFilter = true;
     $scope.hideRatingFilter = true;
     $scope.hideSortingFilter = true;

    $scope.SetCurrentType =function(name)
     {
        setSelectedType(name);
        supersonic.data.channel('filters').publish($scope.typesList);
     }

     var setSelectedType = function(name)
     {
        angular.forEach($scope.typesList, function(type)
        {
              if(name == type.name)
              {
                type.checked = !type.checked;
              }
        });
     }

     $scope.SetCurrentItem =function(value)
     {
        $scope.selectedFrequency.value = value;
        supersonic.data.channel('refreshTime').publish(value);
     }

     $scope.SetCurrentRating =function(value)
     {
        $scope.selectedRating.value = value;
        supersonic.data.channel('rating').publish(value);
     }

     $scope.SetCurrentSorting =function(value)
     {
        $scope.selectedSorting.value = value;
        supersonic.data.channel('sorting').publish(value);
     }

   // $scope.submitFilters = function()
   // {
   //      supersonic.data.channel('filters').publish($scope.typesList);
   //      //window.localStorage.setItem("typesList",$scope.typesList);
   //    }

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

   $scope.hideRatingFilters = function(){
    $scope.hideRatingFilter = !$scope.hideRatingFilter;
    if (toggleRatingIcon == 0){
      $scope.RatingIcon = "super-chevron-up";
      toggleRatingIcon = 1;
    }
    else{
      $scope.RatingIcon = "super-chevron-down";
      toggleRatingIcon = 0;
    }
   }

   $scope.hideSortingFilters = function(){
    $scope.hideSortingFilter = !$scope.hideSortingFilter;
    if (toggleSortingIcon == 0){
      $scope.SortingIcon = "super-chevron-up";
      toggleSortingIcon = 1;
    }
    else{
      $scope.SortingIcon = "super-chevron-down";
      toggleSortingIcon = 0;
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