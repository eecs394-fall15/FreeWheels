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
    var firstTime = true;
    supersonic.ui.tabs.hide();


    $scope.toggleMap = function() {
      supersonic.logger.log("TOGGLEMAP!");
    }

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
      $scope.prevLatLng = $scope.latlng;
      // $scope.previousPlaces = $scope.places.slice();
     findMeAwesomePlaces($scope.latlng, function(arr1, arr2) {
      $scope.pushNewPlaces();
       firstTime = false;
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
      //supersonic.logger.log("NEW PLACES:" + $scope.places.length);
      if($scope.places.length != $scope.visibleplaces.length) {
      $scope.my.newPlaces = true;
      }
    }

    $scope.pushNewPlaces = function() {
      //supersonic.logger.log("NEW PLACES:" + $scope.places.length);
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
                  var d = new Date();
                  var day = d.getDay();
                  var openhours = "";

                  supersonic.logger.log("Opening hours" + result.name + ":" + angular.toJson(details.opening_hours));
                  if (details.opening_hours != null){
                       supersonic.logger.log("periods" + details.opening_hours.periods);
                    if(details.opening_hours.weekday_text != undefined && details.opening_hours.weekday_text.length){
                        openhours = details.opening_hours.weekday_text[day];
                        openhours = openhours.split(/:(.+)?/)[1];
                        supersonic.logger.log("weekday:" + openhours);
                    } else {
                      if (details.opening_hours.open_now){
                        openhours = "Open Now"
                      } else {
                        openhours = "Closed"
                      }

                      supersonic.logger.log("No weekday:" + openhours);
                    }
                  } else {
                    openhours = "No hours"
                  }
                  //var openhours = result.opening_hours.weekday_text[day];
                  //supersonic.logger.log(openhours);
                  supersonic.logger.log("DEETAILS" + angular.toJson(details));
                  $scope.places.push({
                    name: result.name,
                    icon: result.icon,
                    vicinity: result.vicinity,
                    address: details.formatted_address,
                    phone: details.formatted_phone_number,
                    rating: result.rating,
                    photo: photo,
                    types: result.types,
                    type: result.types[0],
                    navstr: navstring,
                    distance: distance,
                    openhours: openhours,
                    website: details.website != undefined? details.website: ""
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
                 //supersonic.logger.log("SCOPE.place in line 173:" + angular.toJson($scope.places));     
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
        if(firstTime)
        {
          supersonic.logger.log("1st time");
            return false;
        }
        else if($scope.prevLatLng == $scope.latlng)
        {
          return true;
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