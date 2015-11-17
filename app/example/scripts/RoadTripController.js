angular
  .module('example')
  .controller('RoadTripController', function($scope, supersonic, ngGPlacesAPI, $http, NgMap, $timeout) {
    $scope.navbarTitle = "Settings";
    $scope.my = { newPlaces: false };
    $scope.places = [];
    $scope.useOriginalArray = false;
    $scope.categoryChoices = [true,true,true,true,true,true,true,true,true,true,true];
    $scope.types = [];
    $scope.typesList = [
                  {'name':'Animals','checked': true}, 
                  {'name':'Library','checked': true},
                  {'name':'Museums and Art','checked': true},
                  {'name':'Nature','checked': true},
                  {'name':'Amusement','checked': true},
                  {'name':'Places of worship','checked': true}];

    $scope.radiusSlider = 2.0;
    $scope.translate = function(value)
    {
        return value + ' mi';
    }

    var newPlacesNearby = function()
    {
      $scope.my.newPlaces = true;
      $timeout(function() {$scope.my.newPlaces = false;}, 3000);
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


   $scope.location1 = function(){
   	 findMeAwesomePlaces(42.0564634,-87.6774557);
   } 

   $scope.location2 = function(){
   	 findMeAwesomePlaces( 41.7055756,-86.2375275);
   } 

   $scope.location3 = function(){
   	 findMeAwesomePlaces(42.2780475,-83.7404128);
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
       $scope.previousPlaces = $scope.places.slice();
       findMeAwesomePlaces(e.latLng, function(arr1, arr2) {
        if (!compareArrays(arr1, arr2)){
          newPlacesNearby();
        }
       });

       
      });
    });

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