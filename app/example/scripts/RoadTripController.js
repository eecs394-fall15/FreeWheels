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
    $scope.latlng = new google.maps.LatLng(42.0563195,-87.6969445);

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

    var refreshPlaces = function() {
      $scope.previousPlaces = $scope.places.slice();
     findMeAwesomePlaces($scope.latlng, function(arr1, arr2) {
      supersonic.logger.log(angular.toJson($scope.visibleplaces));
      if (!compareArrays(arr1, arr2)){
        newPlacesNearby();
      }
     });
    }

    $interval(refreshPlaces, 30000);

    var newPlacesNearby = function()
    {
      $scope.my.newPlaces = true;
    }

    $scope.pushNewPlaces = function() {
      $scope.visibleplaces = $scope.places;
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
      supersonic.logger.log($scope.types);
      $scope.filteredPlaces = filterExistingPlaces($scope.types);
      supersonic.logger.log($scope.places);
      supersonic.logger.log($scope.filteredPlaces);
      $scope.useOriginalArray = false;
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
                 supersonic.logger.log(photo);
                 var navstring = "comgooglemaps://?daddr="+result.geometry.location.toUrlValue();
                $scope.places.push({
                    name: result.name,
                    icon: result.icon,
                    vicinity: result.vicinity,
                    address: details.formatted_address,
                    phone: details.formatted_phone_number,
                    rating: result.rating,
                    photo: photo,
                    types: result.types,
                    navstr: navstring
                  });
                // supersonic.logger.log("162:" + $scope.places.length);
                $scope.places = $scope.places.sort(function(a,b){
                  if (!a.rating){return 1;}
                  if (!b.rating){return -1;}
                  return b.rating - a.rating;
                });
                 // supersonic.logger.log("SCOPE.place in line 173:" + angular.toJson($scope.places));     
                callback($scope.previousPlaces, $scope.places); 
                $scope.$apply();
              }
              });      
            });
        }  
      });
    $scope.filteredPlaces = $scope.places;
  }

  //MAP STUFF
  $scope.marker = null;
    supersonic.device.geolocation.getPosition().then( function(position) {
      var myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      $scope.mapCenter = myLocation.lat() + "," +myLocation.lng();
      supersonic.logger.log("loc: " + myLocation.lat() + "," +myLocation.lng());
    });

    NgMap.getMap().then(function(map) {
      map.addListener('click', function(e) {
       placeMarkerAndPanTo(e.latLng, map);
       $scope.latlng = e.latLng;
       // refreshPlaces();
      });
    });

    supersonic.data.channel('radius').subscribe( function(value){
      $scope.radiusSlider = value;
    })
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

        for (i = 0; i < Array2.length; i++){
          var foundName = false;
          for (j = 0; j < Array1.length; j++){
            if (Array1[j].name == Array2[i].name){
              foundName = true;
            }
          }
          if (!foundName)
            {return false;}
        }
        return true;
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