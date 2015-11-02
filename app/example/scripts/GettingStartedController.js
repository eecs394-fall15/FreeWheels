angular
  .module('example')
  .controller('GettingStartedController', function($scope, supersonic, ngGPlacesAPI, $http) {
    $scope.navbarTitle = "Settings";
    $scope.places = [];
    var lat, longi;
    //  $scope.details = ngGPlacesAPI.placeDetails({reference:"CnRnAAAAnRm_imIW_SFd74bsj6iRwvRxBamZqtUaSyRjlb-i1vvkapOSVXyA5Dj452GSpBpno_MHbxyGsuFx9zqZvr_aa2a7uG0IZE8tC-N2OccvUC_i5N3QRQ11WmSRayo441riHebwQGqlbaf3RY-5KVsfGBIQXGtmUICHsD9LH2rd_y-J2hoUvW0lUEIHHtRnD15QyeUqi6tkHIg"})
    //  .then(
    // function (data) {
    //   return data;
    // });

   $scope.findMeAwesomePlaces = function()
   {
      supersonic.device.geolocation.getPosition().then( function(position) {
    // lat = position.coords.latitude;
    // longi = position.coords.longitude;
      var myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      // var map = new google.maps.Map(document.getElementById('map'), {
      //    center: myLocation,
      //    zoom: 15,
      //    scrollwheel: false
      // });

      // Specify location, radius and place types for your Places API search.
      var request = {
          location: myLocation,
          radius: '500',
          types: ['store', 'food']
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
                 var photo = details.photos[0].getUrl({'maxWidth': 35, 'maxHeight': 35});
                 supersonic.logger.log(photo);
                $scope.places.push({
                    name:result.name,
                    icon: result.icon,
                    vicinity: result.vicinity,
                    address: details.formatted_address,
                    phone: details.formatted_phone_number,
                    rating: result.rating,
                    photo: photo
                  });
                $scope.$apply();
              });
            });
        //     for (var i = 0; i < results.length; i++) {
        //       request = {
        //         placeId : results[i].place_id
        //       } 
        //       service.getDetails(request, function(details){
              
        //         $scope.places.push({
        //             name:results[i].name,
        //             icon: results[i].icon,
        //             vicinity: results[i].vicinity,
        //             address: details.formatted_address,
        //             phone: details.formatted_phone_number,
        //             rating: results[i].rating
        //           });
        //       });
              
        // // If the request succeeds, draw the place location on
        // // the map as a marker, and register an event to handle a
        // // click on the marker.
        //     // var marker = new google.maps.Marker({
        //     // map: map,
        //     // position: myLocation
        //     // });
        //   }
           
        }
      });
    });

   //  supersonic.device.geolocation.getPosition().then( function(position) {
  	// lat = position.coords.latitude;
  	// longi = position.coords.longitude;
   //  supersonic.logger.log(lat);
   //  supersonic.logger.log(longi);
  	// ngGPlacesAPI.nearbySearch({latitude:lat, longitude:longi}).then(
   //  function(places){
   //  //  .then(
   //  // function (data) {
   //  //   return data;
   //  // });
   //    angular.forEach(places, function(place)
   //    {
   //      ngGPlacesAPI.placeDetails({reference:place.reference}).then(
   //        function(details)
   //        {
        //     var location = -33.8670 + ',' + 151.195;
        //     var apiKey = 'AIzaSyBn2MJwcqRd2PWx50vDsZikH1UbC4N9EMY';
        //      $http.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json',
        //              { params: {
        //                           location:location, 
        //                           radius:500,
        //                           key:apiKey
        //                         }
        //             })
        //           .success( function (data){
        // // With the data succesfully returned, call our callback
        //            supersonic.logger.log("hello");
        //             //supersonic.logger.log(data[0].name);

        //       // $http({
        //       //         method: 'GET',
        //       //         url: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + data.photos[0].photo_reference + '&key=AIzaSyBn2MJwcqRd2PWx50vDsZikH1UbC4N9EMY'
        //       // }).then(function success(place){
        //       //       supersonic.logger.log(place);
           
        //       //       $scope.places.push({
        //       //       name: place.name,
        //       //       vicinity: place.vicinity,
        //       //       address: details.formatted_address,
        //       //       phone: details.formatted_phone_number,
        //       //       url: details.website,
        //       //       });
        //       //       },
        //       //       function errorCallback(response) {});
        //       });
   //});
}
    //       });
    //     });   
    // });
    //     });
    //   });
    // }  
  });