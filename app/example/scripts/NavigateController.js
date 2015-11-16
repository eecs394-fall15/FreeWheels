angular
  .module('example')
  .controller('NavigateController', function($scope, supersonic) {
    
    supersonic.ui.views.current.whenVisible( function(){
      $scope.name = steroids.view.params.id;
    });
  })