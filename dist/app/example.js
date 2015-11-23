angular.module('example', [
  // Declare here all AngularJS dependencies that are shared by the example module.
  'supersonic', 'ngGPlaces', 'rzModule', 'ngMap'
]);

angular
  .module('example')
  .controller('DrawerController', function($scope, supersonic) {
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
      }
 })
angular
  .module('example')
  .controller('LearnMoreController', function($scope, supersonic) {

    $scope.navbarTitle = "Learn More";

  });

angular
  .module('example')
  .controller('NavigateController', function($scope, supersonic) {
    
    supersonic.ui.views.current.whenVisible( function(){
      $scope.name = steroids.view.params.id;
    });
  })

angular
  .module('example')
  .controller('NearbyController', function($scope, supersonic, ngGPlacesAPI, $http) {
    $scope.useOriginalArray = false;
    $scope.filterView = new supersonic.ui.View("example#Settings");
    $scope.categoryChoices = [true,true,true,true,true,true,true,true,true,true,true];
    $scope.types = ["Animals", "Library", "Museums and Art", "Nature", "Things to do", "Places of worship"] ;
    $scope.typesList = [
                  {'name':'Animals','checked': true}, 
                  {'name':'Library','checked': true},
                  {'name':'Museums and Art','checked': true},
                  {'name':'Nature','checked': true},
                  {'name':'Amusement','checked': true},
                  {'name':'Places of worship','checked': true}];
    //$scope.navbarTitle = "Settings";


    $scope.places = [];
    $scope.filteredPlaces = [];


    $scope.start = function(dest, isModal) {
  var viewId=dest,
      view=new supersonic.ui.View({
        location: dest,
        id: viewId
      });
  view.isStarted().then(function(started) {
    if (started) {
      if (isModal) {supersonic.ui.modal.show(view);}
      else {supersonic.ui.layers.push(view);}
    } else {
      // Start Spinner
      supersonic.ui.views.start(view).then(function() {
        if (isModal) {supersonic.ui.modal.show(view);}
        else {supersonic.ui.layers.push(view);}
        // Stop Spinner
      }, function(error) {
        // Stop Spinner
        A.error(error);
      });
    }
  });
};
    $scope.openFilterView = function(){
      //var modalView = new supersonic.ui.View("example#Settings");
    var options = {
      animate: true
    }
    $scope.start('example#Settings',true);
    //supersonic.ui.modal.show($scope.filterView, options);
    }
    $scope.translate = function(value)
    {
        return value + ' mi';
    }

     $scope.navigate = function(name)
     {
        supersonic.data.channel('navigate').publish(name);
       // supersonic.logger.log("NearbyController: " + name);
        var modalView = new supersonic.ui.View("example#navigate");
        var options = {
            animate: true
      }

        supersonic.ui.modal.show(modalView, options);
     }

    supersonic.data.channel('radius').subscribe( function(value){
      $scope.radiusSlider = value;
    });
    supersonic.data.channel('filters').subscribe( function(message) {
      $scope.typesList = message;
      $scope.types = filterTypes($scope.typesList);
      $scope.filteredPlaces = [];
      if($scope.types.length)
      {
        $scope.filteredPlaces = filterExistingPlaces($scope.types);
        if($scope.filteredPlaces.length)
        {
        $scope.filteredPlaces = $scope.filteredPlaces.sort(function(a,b){
                  if (!a.rating){return 1;}
                  if (!b.rating){return -1;}
                  return b.rating - a.rating;
                });
        $scope.useOriginalArray = false;
      }
      }
      $scope.$apply();
    });

    var filterExistingPlaces = function(types)
    {
      var filteredPlaces = [];
      loop1:
       for(var i = 0; i < types.length; i++)
       { //supersonic.logger.log("i: "  + i);
          loop2:
          for(var j = 0; j < $scope.places.length; j++)
          {
              //supersonic.logger.log("j: " + j + "Place:" + $scope.places[j].name);
              var placesTypes = $scope.places[j].types;
              loop3:
              for(var k = 0; k < placesTypes.length; k++)
              {         
                  if(matchType(types[i], placesTypes[k]))
                    {
                      supersonic.logger.log("Type: " + types[i] +  "Place:"  + $scope.places[j].name + "PlaceType: " + placesTypes[k]) ;  
                      //supersonic.logger.log("k: " + k + "," + "name:" + $scope.places[j].name + "," + placesTypes[k]);
                      //supersonic.logger.log($scope.places[j].name + "," + types[i] + "," + placesTypes[k]);
                      filteredPlaces.push($scope.places[j]);
                      continue loop2;
                    }
              }
          }
       }
         return filteredPlaces;
     }
    
    // var filterExistingPlaces = function(types)
    // {
    //   var filteredPlaces = [];
    //       angular.forEach(types, function(type)
    //       {
    //           angular.forEach($scope.places, function(place)
    //           {
    //                 angular.forEach(place.types, function(placeType)
    //                 {
    //                       if(placeType == type)
    //                         filteredPlaces.push(place);
    //                 });
    //           });
    //       });
    //       return filteredPlaces;
    // }
    var filterTypes = function(list)
    {
      var filteredArray = [];
      angular.forEach(list, function(value, key)
      {
          if(value.checked == true)
            filteredArray.push(value.name);
      });
        return filteredArray;
    }

    var matchType = function(type, placeType)
    {
      var returnValue = false;
        switch(type)
         { case "Places of worship":
              if(placeType == "church" || placeType == "hindu_temple"
                || placeType == "synagogue" || placeType == "place_of_worship" 
                || placeType == "mosque")
              {
                returnValue =  true;
              }
              break;
           case "Museums and Art":
              if(placeType == "museum" || placeType == "art_gallery")
              {
                returnValue = true;         
              }
              break;
             case "Nature":
              if(placeType == "park" || placeType == "campground"
                || placeType == "natural_feature")
              {
                returnValue =  true;       
              }
              break;
             case "Amusement":
              if(placeType == "stadium" || placeType == "casino"
                || placeType == "bowling_alley" || placeType == "amusement_park" )
              {
                 returnValue =  true;
              };
              break;
            case "Animals":
              if(placeType == "zoo" || placeType == "aquarium")
              {
                returnValue =  true;
              };
              break;
            case "Library":
              if(placeType == "library")   
              {
                  returnValue =  true;
              }
              break;       
          }
          return returnValue;
    }

     $scope.openGoogleMaps = function(navigateURL){
        supersonic.app.openURL(navigateURL);
      }

   $scope.findMeAwesomePlaces = function()
   {
      supersonic.logger.log("in findMeAwesomePlaces");
      $scope.useOriginalArray = true;
      $scope.places = [];
      $scope.filteredPlaces = [];
      supersonic.device.geolocation.getPosition().then( function(position) {
        supersonic.logger.log("LAT:" + position.coords.latitude);
      var myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var defaultTypes = ['art_gallery',
                  'aquarium',
                  'hindu_temple',
                  'mosque',
                  'museum',
                  'park',
                  'place_of_worship',
                  'stadium',
                  'synagogue',
                  'natural_feature',
                  'church',
                  'campground',
                  'casino',
                  'bowling_alley',
                  'amusement_park',
                  'zoo',
                  'library'
                  ];
      // Specify location, radius and place types for your Places API search.
      var requestTypes = [];
      angular.forEach($scope.types, function(type)
      {
        if (type == 'Places of worship'){
          requestTypes.push('church');
          requestTypes.push('hindu_temple');
          requestTypes.push('synagogue');
          requestTypes.push('place_of_worship');
          requestTypes.push('mosque');
        }
        else if (type == 'Museums and Art'){
          requestTypes.push('museum');
          requestTypes.push('art_gallery');
        }
        else if (type == 'Nature'){
          requestTypes.push('park');
          requestTypes.push('campground');
          requestTypes.push('natural_feature');
        }
        else if (type == 'Amusement'){
          requestTypes.push('stadium');
          requestTypes.push('casino');
          requestTypes.push('bowling_alley');
          requestTypes.push('amusement_park');
        }
        else if (type == 'Library'){
          requestTypes.push('library');
        }
        else if (type == 'Animals'){
          requestTypes.push('zoo');
          requestTypes.push('aquarium');
        }
      });
  supersonic.logger.log("RADIUS LINE 262" + $scope.radiusSlider);
      var request = {
          location: myLocation,
          radius: $scope.radiusSlider * 1609.34,
          types: $scope.types.length > 0? requestTypes : defaultTypes
      };

    // Create the PlaceService and send the request.
    // Handle the callback with an anonymous function.
      var service = new google.maps.places.PlacesService(map);
       service.nearbySearch(request, function(results, status) {
        supersonic.logger.log("success");
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            supersonic.logger.log("details");
            angular.forEach(results, function(result)
            {
                   request = {
                placeId : result.place_id
              } 
              service.getDetails(request, function(details){
                if(details != null && details.photos != undefined && details.photos != null)
                {
                 var photo = details.photos[0].getUrl({'maxWidth': 300});
                 var navstring = "comgooglemaps://?daddr="+result.geometry.location.toUrlValue();
                $scope.places.push({
                    name:result.name,
                    icon: result.icon,
                    vicinity: result.vicinity,
                    address: details.formatted_address,
                    phone: details.formatted_phone_number,
                    rating: result.rating,
                    photo: photo,
                    types: result.types,
                    url:"https://www.google.com/maps/place/{{result.name}}",
                    navstr: navstring
                  });
                $scope.places = $scope.places.sort(function(a,b){
                  if (!a.rating){return 1;}
                  if (!b.rating){return -1;}
                  return b.rating - a.rating;
                });
                $scope.$apply();
              }
              });
            });
        }
      });
  $scope.filteredPlaces = $scope.places;
    });
  }
});
angular
  .module('example')
  .controller('RoadTripController', function($scope, supersonic, ngGPlacesAPI, $http, NgMap, $timeout, $interval) {
    $scope.navbarTitle = "Settings";
    $scope.filterView = new supersonic.ui.View("example#Settings");
    $scope.my = { newPlaces: false };
    $scope.places = [];
    $scope.visibleplaces = [];
    $scope.useOriginalArray = false;
    $scope.categoryChoices = [true,true,true,true,true,true,true,true,true,true,true];
    $scope.types = [];
    $scope.filteredPlaces = [];
    $scope.latlng = "";
    $scope.refreshTime = 0.5;
    $scope.minRating = 3;
    $scope.sortBy = 'R';
    $scope.prevLatLng = "";
    var promise;
    supersonic.ui.tabs.hide();


    $scope.typesList = [
                  {'name':'Animals','checked': true}, 
                  {'name':'Library','checked': true},
                  {'name':'Museums and Art','checked': true},
                  {'name':'Nature','checked': true},
                  {'name':'Amusement','checked': true},
                  {'name':'Places of worship','checked': true}];

    $scope.translate = function(value)
    {
        return value + ' mi';
    }



      //MAP STUFF
     $scope.marker = null;
    supersonic.device.geolocation.getPosition().then( function(position) {
      var myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      $scope.latlng = myLocation;
      $scope.mapCenter = myLocation.lat() + "," +myLocation.lng();


    var refreshPlaces = function() {
      supersonic.logger.log("REFRESH CALLED");
      $scope.previousPlaces = $scope.places.slice();
     findMeAwesomePlaces($scope.latlng, function(arr1, arr2) {
      //supersonic.logger.log(angular.toJson($scope.visibleplaces));
      if (!compareArrays(arr1, arr2)){
        newPlacesNearby();
      }
     });
    }

    $scope.startPlaces = function() {
     supersonic.logger.log("lat long start: " + $scope.latlng);
      // $scope.previousPlaces = $scope.places.slice();
     findMeAwesomePlaces($scope.latlng, function(arr1, arr2) {
      $scope.pushNewPlaces();
      //supersonic.logger.log(angular.toJson($scope.visibleplaces));
     });
    }

    

    promise = $interval(refreshPlaces, $scope.refreshTime * 60000);

    $scope.manualRefresh = function()
    {
      supersonic.logger.log("In manual refresh function");
      $interval.cancel(promise);
      refreshPlaces();
    }

    var newPlacesNearby = function()
    {
      supersonic.logger.log("NEW PLACES:" + $scope.places.length);
      if($scope.places.length)
      $scope.my.newPlaces = true;
    }

    $scope.pushNewPlaces = function() {
      supersonic.logger.log("NEW PLACES:" + $scope.places.length);
      $scope.visibleplaces = angular.copy($scope.places);
      $scope.my.newPlaces = false;
    }

        $scope.start = function(dest, isModal) {
  var viewId=dest,
      view=new supersonic.ui.View({
        location: dest,
        id: viewId
      });
  view.isStarted().then(function(started) {
    if (started) {
      if (isModal) {supersonic.ui.modal.show(view);}
      else {supersonic.ui.layers.push(view);}
    } else {
      // Start Spinner
      supersonic.ui.views.start(view).then(function() {
        if (isModal) {supersonic.ui.modal.show(view);}
        else {supersonic.ui.layers.push(view);}
        // Stop Spinner
      }, function(error) {
        // Stop Spinner
        A.error(error);
      });
    }
  });
};
    $scope.openFilterView = function(){
      //var modalView = new supersonic.ui.View("example#Settings");
    var options = {
      animate: true
    }
    $scope.start('example#Settings',true);
    //supersonic.ui.modal.show($scope.filterView, options);
    }


    supersonic.data.channel('filters').subscribe( function(message) {
      $scope.typesList = message;
      $scope.types = filterTypes($scope.typesList);
      supersonic.logger.log("TYPES:" + $scope.types);
      $scope.filteredPlaces = [];
      if($scope.types.length)
      {
        $scope.filteredPlaces = filterExistingPlaces($scope.types);
        if($scope.filteredPlaces.length)
        {
        $scope.filteredPlaces = $scope.filteredPlaces.sort(function(a,b){
                  if (!a.rating){return 1;}
                  if (!b.rating){return -1;}
                  return b.rating - a.rating;
                });
        $scope.useOriginalArray = false;
      }
      }
      $scope.$apply();
    });

     supersonic.data.channel('radius').subscribe( function(value){
      $scope.radiusSlider = value;
    });

     supersonic.data.channel('rating').subscribe( function(value){
      $scope.minRating = value;
    });
      supersonic.data.channel('sorting').subscribe( function(value){
      $scope.sortBy = value;
    });

      supersonic.data.channel('refreshTime').subscribe( function(value){
      //supersonic.logger.log("REFRESHTIME:" + value + "," + "MINRATING:" + $scope.minRating);
      $interval.cancel(promise);
      $scope.refreshTime = value;
      if($scope.refreshTime != 0)
      promise =  $interval(refreshPlaces, $scope.refreshTime * 60000);
    });

    var filterExistingPlaces = function(types)
    {
      var filteredPlaces = [];
          angular.forEach(types, function(type)
          {
              angular.forEach($scope.places, function(place)
              {
                    angular.forEach(place.types, function(placeType)
                    {
                          if(placeType == type)
                            filteredPlaces.push(place);
                    });
              });
          });
          return filteredPlaces;
    }
    var filterTypes = function(list)
    {
      var filteredArray = [];
      angular.forEach(list, function(value, key)
      {
          if(value.checked == true)
            filteredArray.push(value.name);
      });
        return filteredArray;
    }

  $scope.openGoogleMaps = function(navigateURL){
    supersonic.app.openURL(navigateURL);
  }

   var findMeAwesomePlaces = function(myLocation, callback)
   {
      supersonic.logger.log(myLocation);
      $scope.useOriginalArray = true;
      $scope.places = [];
      $scope.filteredPlaces = [];
      //var myLocation = new google.maps.LatLng(lat, longitude);
      var defaultTypes = ['art_gallery',
                  'aquarium',
                  'city_hall',
                  'embassy',
                  'hindu_temple',
                  'mosque',
                  'museum',
                  'park',
                  'place_of_worship',
                  'stadium',
                  'synagogue',
                  'natural_feature'];
                  var requestTypes = [];
      angular.forEach($scope.types, function(type)
      {
        if (type == 'Places of worship'){
          requestTypes.push('church');
          requestTypes.push('hindu_temple');
          requestTypes.push('synagogue');
          requestTypes.push('place_of_worship');
          requestTypes.push('mosque');
        }
        else if (type == 'Museums and Art'){
          requestTypes.push('museum');
          requestTypes.push('art_gallery');
        }
        else if (type == 'Nature'){
          requestTypes.push('park');
          requestTypes.push('campground');
          requestTypes.push('natural_feature');
        }
        else if (type == 'Amusement'){
          requestTypes.push('stadium');
          requestTypes.push('casino');
          requestTypes.push('bowling_alley');
          requestTypes.push('amusement_park');
        }
        else if (type == 'Library'){
          requestTypes.push('library');
        }
        else if (type == 'Animals'){
          requestTypes.push('zoo');
          requestTypes.push('aquarium');
        }
      });

      // Specify location, radius and place types for your Places API search.
      var request = {
          location: myLocation,
          radius: $scope.radiusSlider * 1609.34,
          types: $scope.types.length > 0? requestTypes : defaultTypes

      };

    // Create the PlaceService and send the request.
    // Handle the callback with an anonymous function.
      var service = new google.maps.places.PlacesService(map);
       service.nearbySearch(request, function(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            angular.forEach(results, function(result)
            {
                   request = {
                placeId : result.place_id
              } 
              service.getDetails(request, function(details){
                if(details != null && details.photos != undefined && details.photos != null)
                {
                 var photo = details.photos[0].getUrl({'maxWidth': 300});
                 //supersonic.logger.log(photo);
                 var navstring = "comgooglemaps://?daddr="+result.geometry.location.toUrlValue();
                 var distance = google.maps.geometry.spherical.computeDistanceBetween($scope.latlng, result.geometry.location) * 0.000621371;
                 if((result.rating >= $scope.minRating) || (result.rating == null && $scope.minRating == 0))
                {
                  $scope.places.push({
                    name: result.name,
                    icon: result.icon,
                    vicinity: result.vicinity,
                    address: details.formatted_address,
                    phone: details.formatted_phone_number,
                    rating: result.rating,
                    photo: photo,
                    types: result.types,
                    navstr: navstring,
                    distance: distance
                  });
                }
                // supersonic.logger.log("162:" + $scope.places.length);
                if($scope.sortBy == 'R')
                {
                    $scope.places = $scope.places.sort(function(a,b){
                      if (!a.rating){return 1;}
                      if (!b.rating){return -1;}
                      return b.rating - a.rating;
                    });
                }
                else if($scope.sortBy == 'D')
                {
                    $scope.places = $scope.places.sort(function(a,b){
                      return a.distance - b.distance;
                    });

                }
                 supersonic.logger.log("SCOPE.place in line 173:" + angular.toJson($scope.places));     
                callback($scope.previousPlaces, $scope.places); 
                $scope.$apply();
              }
              });      
            });
        }  
      });
      $scope.filteredPlaces = $scope.places;
  }
    

    NgMap.getMap().then(function(map) {
      placeMarkerAndPanTo($scope.latlng, map);

      $timeout($scope.startPlaces, 500);
      map.addListener('click', function(e) {
       placeMarkerAndPanTo(e.latLng, map);
       $scope.prevLatLng = angular.copy($scope.latlng);
       $scope.latlng = e.latLng;
       //supersonic.logger.log("PREV LATLONG:" + $scope.prevLatLng.lat());
       //supersonic.logger.log("NEW LATLONG:" + $scope.latlng.lat());
       if($scope.refreshTime == 0)
          refreshPlaces();
      });
    });

   

  var filterExistingPlaces = function(types)
    {
      var filteredPlaces = [];
      loop1:
       for(var i = 0; i < types.length; i++)
       { //supersonic.logger.log("i: "  + i);
          loop2:
          for(var j = 0; j < $scope.places.length; j++)
          {
              //supersonic.logger.log("j: " + j + "Place:" + $scope.places[j].name);
              var placesTypes = $scope.places[j].types;
              loop3:
              for(var k = 0; k < placesTypes.length; k++)
              {         
                  if(matchType(types[i], placesTypes[k]))
                    {
                     // supersonic.logger.log("Type: " + types[i] +  "Place:"  + $scope.places[j].name + "PlaceType: " + placesTypes[k]) ;  
                      //supersonic.logger.log("k: " + k + "," + "name:" + $scope.places[j].name + "," + placesTypes[k]);
                      //supersonic.logger.log($scope.places[j].name + "," + types[i] + "," + placesTypes[k]);
                      filteredPlaces.push($scope.places[j]);
                      continue loop2;
                    }
              }
          }
       }
         return filteredPlaces;
     }

     var filterTypes = function(list)
    {
      var filteredArray = [];
      angular.forEach(list, function(value, key)
      {
          if(value.checked == true)
            filteredArray.push(value.name);
      });
        return filteredArray;
    }

    var matchType = function(type, placeType)
    {
      var returnValue = false;
        switch(type)
         { case "Places of worship":
              if(placeType == "church" || placeType == "hindu_temple"
                || placeType == "synagogue" || placeType == "place_of_worship" 
                || placeType == "mosque")
              {
                returnValue =  true;
              }
              break;
           case "Museums and Art":
              if(placeType == "museum" || placeType == "art_gallery")
              {
                returnValue = true;         
              }
              break;
             case "Nature":
              if(placeType == "park" || placeType == "campground"
                || placeType == "natural_feature")
              {
                returnValue =  true;       
              }
              break;
             case "Amusement":
              if(placeType == "stadium" || placeType == "casino"
                || placeType == "bowling_alley" || placeType == "amusement_park" )
              {
                 returnValue =  true;
              };
              break;
            case "Animals":
              if(placeType == "zoo" || placeType == "aquarium")
              {
                returnValue =  true;
              };
              break;
            case "Library":
              if(placeType == "library")   
              {
                  returnValue =  true;
              }
              break;       
          }
          return returnValue;
    }

  function compareArrays(Array1, Array2){
       // supersonic.logger.log("Compare Called:" + Array1.length + "," +  Array2.length);
        // for (i = 0; i < Array2.length; i++){
        //   var foundName = false;
        //   for (j = 0; j < Array1.length; j++){
        //     if (Array1[j].name == Array2[i].name){
        //       foundName = true;
        //     }
        //   }
        //   if (!foundName)
        //     {return false;}
        // }
        // return true;
        if($scope.prevLatLng == "")
        {
          supersonic.logger.log("1st time");
            return false;
        }
        else
        {
          var d  = google.maps.geometry.spherical.computeDistanceBetween($scope.prevLatLng, $scope.latlng);
         supersonic.logger.log("DISTANCE in metres:"  + d);

         if(d >= 2000)
          {
            return false;
          }
         else
         {
            return true;
         }
       }

  }

  function placeMarkerAndPanTo(latLng, map) {
   if ($scope.marker){
     $scope.marker.setMap(null);
  }
    var marker = new google.maps.Marker({
      position: latLng,
      map: map
    });
    $scope.marker = marker;
    map.panTo(latLng);
  }

});
});
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
                  {'name':'Amusement','checked': true, 'icon':'ios-americanfootball-outline'},
                  {'name':'Animals','checked': true,'icon':'ios-paw-outline'}, 
                  {'name':'Library','checked': true, 'icon':'ios-book-outline'},
                  {'name':'Museums and Art','checked': true, 'icon':'ios-flask-outline'},
                  {'name':'Nature','checked': true, 'icon':'leaf'},
                  {'name':'Places of worship','checked': true, 'icon':'ios-moon-outline'}];

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
                  {'name':'None','value': 0}];

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