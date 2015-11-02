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
  	lat = position.coords.latitude;
  	longi = position.coords.longitude;
  	ngGPlacesAPI.nearbySearch({latitude:lat, longitude:longi}).then(
    function(places){
    //  .then(
    // function (data) {
    //   return data;
    // });
      angular.forEach(places, function(place)
      {
        ngGPlacesAPI.placeDetails({reference:place.reference}).then(
          function(details)
          {
              //$http.get("https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU&key=YOUR_API_KEY");
            supersonic.logger.log(details);
            $scope.places.push({
            name: place.name,
            vicinity: place.vicinity,
            address: details.formatted_address,
            phone: details.formatted_phone_number,
            url: details.website
          });
          });
        
    });
        });
      });
    }  
  });