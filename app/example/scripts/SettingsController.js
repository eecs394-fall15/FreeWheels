angular
  .module('example')
  .controller('SettingsController', function($scope, supersonic, ngGPlacesAPI, $http) {
    $scope.navbarTitle = "Settings";

    $scope.places = [];

    $scope.radiusSlider = 2.0;
    $scope.translate = function(value)
    {
        return value + ' mi';
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

   var findMeAwesomePlaces = function(lat, longitude)
   {
      $scope.places = [];
      var myLocation = new google.maps.LatLng(lat, longitude);

      // Specify location, radius and place types for your Places API search.
      var request = {
          location: myLocation,
          radius: $scope.radiusSlider * 1609.34,
          types: ['art_gallery',
                  'aquarium',
                  'city_hall',
                  'embassy',
                  'hindu_temple',
                  'mosque',
                  'museum',
                  'park',
                  'place_of_worship',
                  //'stadium',
                  'synagogue',
                  'natural_feature']

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
                 var photo = details.photos[0].getUrl({'maxWidth': 300});
                 supersonic.logger.log(photo);
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
              });
            });
        }
      });
  }
});