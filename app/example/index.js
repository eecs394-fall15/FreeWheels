angular.module('example', [
  // Declare here all AngularJS dependencies that are shared by the example module.
  'supersonic', 'ngGPlaces', 'rzModule', 'ngMap'
])
.directive('bsRating', function() {
    return {
 restrict : 'AE',
 link : function(scope, elem, attr){
   $(elem).rating('update', attr.value);
  }
 } 
});
