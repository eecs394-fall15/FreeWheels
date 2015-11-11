angular
  .module('example')
  .controller('MapController', function($scope, supersonic, ngGPlacesAPI, $http, NgMap) {
	$scope.navbarTitle = "MAP";

  	supersonic.device.geolocation.getPosition().then( function(position) {
      var myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      $scope.mapCenter = myLocation.lat() + "," +myLocation.lng();
      supersonic.logger.log("loc: " + myLocation.lat() + "," +myLocation.lng());
  	});

    NgMap.getMap().then(function(map) {
    	map.addListener('click', function(e) {
		   placeMarkerAndPanTo(e.latLng, map);
		});
    });

	function placeMarkerAndPanTo(latLng, map) {
	  var marker = new google.maps.Marker({
	    position: latLng,
	    map: map
	  });
	  map.panTo(latLng);
	}

});