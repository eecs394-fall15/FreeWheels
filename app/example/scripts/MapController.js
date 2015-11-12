angular
  .module('example')
  .controller('MapController', function($scope, supersonic, ngGPlacesAPI, $http, NgMap) {
	$scope.navbarTitle = "MAP";
	$scope.marker = null;
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