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
    $scope.refreshTime = 1/6;
    $scope.minRating = 0;
    $scope.sortBy = 'R';
    $scope.prevLatLng = "";

    $scope.showRefreshing = false;

    $scope.useDeviceLocation = true;

    var promise, map;
    supersonic.ui.tabs.hide();
      $scope.showMap = true;
     //$("#input-id").rating();

  var filterBtn = new supersonic.ui.NavigationBarButton({
  onTap: function() {
    $scope.openFilterView();
  },
  styleId: "nav-filter"
})

  var changeRefresh = function()
  {
    $scope.showRefreshing = false;
  }

var refreshBtn = new supersonic.ui.NavigationBarButton({
  onTap: function() {
    $scope.showRefreshing = true;
    $timeout(changeRefresh, 1000); 
   $scope.manualRefresh();
  },
  styleId: "nav-refresh"
})

supersonic.ui.navigationBar.update({
  title: "FreeWheels",
  overrideBackButton: false,
  buttons: {
    left: [filterBtn],
    right: [refreshBtn]
  }
}).then(supersonic.ui.navigationBar.show());

    function placeMarkerAndPanTo(latLng, map) {
    supersonic.logger.log("create marker" + $scope.marker);
   if ($scope.marker){
     $scope.marker.setMap(null);
  }

    var marker = new google.maps.Marker({
      position: latLng,
      map: map
    });
    $scope.marker = marker;
    supersonic.logger.log("creating marker" + $scope.marker);
     $scope.marker.setMap(map);
  }

    $scope.toggleMap = function() {
      supersonic.logger.log("TOGGLEMAP!");
      $scope.showMap = !$scope.showMap;
      $scope.useDeviceLocation = false;
      if($scope.showMap)
      {
        supersonic.logger.log("Create Map");
        $scope.mapCenter = $scope.latlng.lat() + "," +$scope.latlng.lng();
       NgMap.getMap().then(function(map) {
        $scope.marker = null;
          google.maps.event.trigger(map,'resize');

          placeMarkerAndPanTo($scope.latlng, map);

      //     supersonic.logger.log("map created");
        
          map.addListener('click', function(e) {
          placeMarkerAndPanTo(e.latLng, map);
        $scope.prevLatLng = angular.copy($scope.latlng);
        $scope.latlng = e.latLng;
       if($scope.refreshTime == 0)
          refreshPlaces();
        });
      });
      }
    }

    $scope.typesList = [];

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


    function refreshPlaces () {
      supersonic.logger.log("REFRESH CALLED");
      $scope.previousPlaces = $scope.places.slice();
      
      if ($scope.useDeviceLocation){
        supersonic.device.geolocation.getPosition().then( function(position) {
          var myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          $scope.latlng = myLocation;
        });
      }

      findMeAwesomePlaces($scope.latlng, 1);
     // findMeAwesomePlaces($scope.latlng, function() {
     //  //supersonic.logger.log(angular.toJson($scope.visibleplaces));
     //  if (!compareArrays(arr1, arr2)){
     //    newPlacesNearby();
     //  }
     // });
    }

    $scope.startPlaces = function() {
     supersonic.logger.log("lat long start: " + $scope.latlng);
      //$scope.prevLatLng = $scope.latlng;
      // $scope.previousPlaces = $scope.places.slice();
      findMeAwesomePlaces($scope.latlng, 0);
     // findMeAwesomePlaces($scope.latlng, function() {
     //  $scope.pushNewPlaces();
     //   //firstTime = false;
     //  //supersonic.logger.log(angular.toJson($scope.visibleplaces));
     // });
    }

    
    function compareArrays(){
       supersonic.logger.log("compareArrays:PREV:" + $scope.prevLatLng + ",CURRENT:" +  $scope.latlng);

        if($scope.prevLatLng == "")
        {
          supersonic.logger.log("1st time");
          $scope.prevLatLng = angular.copy($scope.latlng);
            return false;
        }
        else
        {
          var d  = google.maps.geometry.spherical.computeDistanceBetween($scope.prevLatLng, $scope.latlng);
         supersonic.logger.log("DISTANCE in metres:"  + d);

         if($scope.oldPlaces.length != $scope.places.length)
          {
            return false;

          }
         else
         {
           supersonic.logger.log("failed");
            return true;
         }
       }
  }

    promise = $interval(refreshPlaces, $scope.refreshTime * 60000);

    $scope.manualRefresh = function()
    {
      supersonic.logger.log("In manual refresh function");
      //$interval.cancel(promise);
      refreshPlaces();
    }

    function newPlacesNearby()
    {
      supersonic.logger.log("NEW PLACES:" + $scope.places.length);
      if($scope.places.length) {
      $scope.my.newPlaces = true;
      $scope.showRefreshing = false;
      }
    }

    $scope.pushNewPlaces = function() {
      supersonic.logger.log("FIRST TIME NEW PLACES:" + $scope.places.length);
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

    supersonic.data.channel('startRefresh').subscribe( function(value){
      supersonic.logger.log("startRefresh");
      $scope.manualRefresh();
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
            filteredArray.push(value.category);
      });
        return filteredArray;
    }

  $scope.openGoogleMaps = function(navigateURL){
    supersonic.app.openURL(navigateURL);
  }

  $scope.openWebsite = function(navigateURL){
    supersonic.app.openURL(navigateURL);
  }

   function findMeAwesomePlaces(myLocation, firstTime)
   {
      supersonic.logger.log(myLocation);
      $scope.useOriginalArray = true;
      $scope.oldPlaces = $scope.places;
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
                  var requestTypes = $scope.types;
      

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
            async.each(results, function(result, callback)
            {
              //supersonic.logger.log("index:" + index);
                   request = {
                placeId : result.place_id
              } 
              service.getDetails(request, function(details){
                if(details != null && details.photos != undefined && details.photos != null)
                {
                 var photo = details.photos[0].getUrl({'maxWidth': 300});
                 //supersonic.logger.log(photo);
                 var navstring = "comgooglemaps://?saddr=" + $scope.latlng.lat() + "," +$scope.latlng.lng() + "&daddr="+result.geometry.location.toUrlValue();
                 var distance = google.maps.geometry.spherical.computeDistanceBetween($scope.latlng, result.geometry.location) * 0.000621371;
                 if((result.rating >= $scope.minRating) || (result.rating == null && $scope.minRating == 0))
                {
                  var d = new Date();
                  var day = d.getDay();
                  var openhours = "";

                  //supersonic.logger.log("Opening hours" + result.name + ":" + angular.toJson(details.opening_hours));
                  if (details.opening_hours != null){
                       //supersonic.logger.log("periods" + details.opening_hours.periods);
                    if(details.opening_hours.weekday_text != undefined && details.opening_hours.weekday_text.length){
                        openhours = details.opening_hours.weekday_text[day];
                        openhours = openhours.split(/:(.+)?/)[1];
                        //supersonic.logger.log("weekday:" + openhours);
                    } else {
                      if (details.opening_hours.open_now){
                        openhours = "Open Now"
                      } else {
                        openhours = "Closed"
                      }

                      //supersonic.logger.log("No weekday:" + openhours);
                    }
                  } else {
                    openhours = "No hours"
                  }
                  //var openhours = result.opening_hours.weekday_text[day];
                  //supersonic.logger.log(openhours);
                  //supersonic.logger.log("DEETAILS" + angular.toJson(details));
                  var grosstype = result.types[0];
                  var find = '_';
                  var re = new RegExp(find, 'g');

                  var cleantype = grosstype.replace(re, ' ');
                  cleantype = cleantype.replace(/\b./g, function(m){ return m.toUpperCase(); });
                  


                  if (distance <= $scope.radiusSlider){
                    $scope.places.push({
                      name: result.name,
                      icon: result.icon,
                      vicinity: result.vicinity,
                      address: details.formatted_address,
                      phone: details.formatted_phone_number,
                      rating: result.rating,
                      photo: photo,
                      types: result.types,
                      type: cleantype,
                      navstr: navstring,
                      distance: distance,
                      openhours: openhours,
                      website: details.website != undefined? details.website: ""
                    });
                  }
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
                 supersonic.logger.log("SCOPE.place in line 173:" + angular.toJson($scope.places));     
                 
                $scope.$apply();
              }
              callback();  
              });            
            },
            function(error)
            {
                supersonic.logger.log("loop done");
                if(!compareArrays())
                {
                 //  supersonic.logger.log("firstTime" + firstTime);
                 if(firstTime == 0)
                 {
                    supersonic.logger.log("firstime-pushnewplaces");
                    $scope.pushNewPlaces();
                 }
                 else if(firstTime == 1)
                 {
                     newPlacesNearby();
                 }
                }
            });
        }  
      });
      $scope.filteredPlaces = $scope.places;
  }
    
   
    NgMap.getMap().then(function(map1) {
       map = map1;
      placeMarkerAndPanTo($scope.latlng, map);
     
       $scope.showMap = false;
      map.addListener('click', function(e) {
       placeMarkerAndPanTo(e.latLng, map);
       $scope.prevLatLng = angular.copy($scope.latlng);
       $scope.latlng = e.latLng;
       //$scope.$apply();
       //supersonic.logger.log("PREV LATLONG:" + $scope.prevLatLng.lat());
       //supersonic.logger.log("NEW LATLONG:" + $scope.latlng.lat());
       if($scope.refreshTime == 0)
          refreshPlaces();
      });
        $timeout($scope.startPlaces, 2000);  
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
            filteredArray.push(value.category);
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




});
});