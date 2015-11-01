angular
  .module('example')
  .controller('SettingsController', function($scope, supersonic, ngGPlacesAPI) {
    $scope.navbarTitle = "Settings";
    //  $scope.details = ngGPlacesAPI.placeDetails({reference:"CnRnAAAAnRm_imIW_SFd74bsj6iRwvRxBamZqtUaSyRjlb-i1vvkapOSVXyA5Dj452GSpBpno_MHbxyGsuFx9zqZvr_aa2a7uG0IZE8tC-N2OccvUC_i5N3QRQ11WmSRayo441riHebwQGqlbaf3RY-5KVsfGBIQXGtmUICHsD9LH2rd_y-J2hoUvW0lUEIHHtRnD15QyeUqi6tkHIg"})
    //  .then(
    // function (data) {
    //   return data;
    // });

  ngGPlacesAPI.nearbySearch({latitude:42.058076, longitude:-87.675977}).then(
    function(data){
    	//supersonic.logger.log("DATA: "data);
     $scope.data =  data;
    });
  });
