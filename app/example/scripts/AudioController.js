angular
  .module('example')
    .controller('AudioController', function($scope, supersonic) {
      steroids.on('ready', function() {
      // Play the audio file at url
      var myMedia = new Media("http://api.ispeech.org/api/rest?apikey=developerdemokeydeveloperdemokey&action=convert&text=this%20place%20is%20awesome%20and%20sam%20is%20sexy&voice=usenglishfemale&format=mp3&frequency=44100&bitrate=128&speed=1&startpadding=1&endpadding=1&pitch=110&filename=myaudiofile");
      $scope.play = function() {
        myMedia.play();
        $scope.isPlaying = true;
      }
      $scope.stop = function() {
       myMedia.stop();
       $scope.isPlaying = false;
      }
      $scope.pause = function() {
       myMedia.pause();
       $scope.isPlaying = false;
      }
      $scope.release = function() {
       myMedia.play();
       $scope.isPlaying = true;
      }
    });
  });
