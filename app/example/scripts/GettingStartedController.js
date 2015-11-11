angular
  .module('example')
  .controller('GettingStartedController', function($scope, supersonic, ngGPlacesAPI, $http) {
    $scope.useOriginalArray = false;
    $scope.categoryChoices = [true,true,true,true,true,true,true,true,true,true,true];
    $scope.types = [];
    $scope.typesList = [
                  {'name':'art_gallery','checked': false}, 
                  {'name':'aquarium','checked': false},
                  {'name':'city_hall','checked': false},
                  {'name':'embassy','checked': false},
                  {'name':'hindu_temple','checked': false},
                  {'name':'mosque','checked': false},
                  {'name':'museum','checked': false},
                  {'name':'park','checked': false},
                  {'name':'place_of_worship','checked': false},
                  {'name':'stadium','checked': false},
                  {'name':'synagogue','checked': false},
                  {'name':'natural_feature','checked': false}];
    //$scope.navbarTitle = "Settings";

    $scope.places = [];

    $scope.radiusSlider = 2.0;
    $scope.translate = function(value)
    {
        return value + ' mi';
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

   $scope.findMeAwesomePlaces = function()
   {
      $scope.useOriginalArray = true;
      $scope.places = [];
      $scope.filteredPlaces = [];
      supersonic.device.geolocation.getPosition().then( function(position) {
      var myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
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
      // Specify location, radius and place types for your Places API search.
      supersonic.logger.log($scope.types);
      var request = {
          location: myLocation,
          radius: $scope.radiusSlider * 1609.34,
          types: $scope.types.length > 0? $scope.types : defaultTypes
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
                $scope.places.push({
                    name:result.name,
                    icon: result.icon,
                    vicinity: result.vicinity,
                    address: details.formatted_address,
                    phone: details.formatted_phone_number,
                    rating: result.rating,
                    photo: photo,
                    types: result.types
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

    });
  }
});