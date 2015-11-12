angular
  .module('example')
  .controller('NearbyController', function($scope, supersonic, ngGPlacesAPI, $http) {
    
    $scope.useOriginalArray = false;
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

    $scope.radiusSlider = 2.0;
    $scope.translate = function(value)
    {
        return value + ' mi';
    }


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
             case "Things to do":
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


   $scope.findMeAwesomePlaces = function()
   {
      $scope.useOriginalArray = true;
      $scope.places = [];
      $scope.filteredPlaces = [];
      supersonic.device.geolocation.getPosition().then( function(position) {
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
  $scope.filteredPlaces = $scope.places;
    });
  }
});