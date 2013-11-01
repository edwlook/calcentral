(function(window, calcentral) {
  'use strict';

  /**
   * Video controller
   */
  calcentral.controller('VideoController', ['$http', '$scope', function($http, $scope) {

  	$scope.videos = [];
  	$scope.data;

  	var findVideos = function() {
  		var sort = function(obj) {
  			var title = obj.mediapackage.title;
  			var tracks = obj.mediapackage.media.track;
        angular.forEach(tracks, function(track) {
          if (track.mimetype === 'video/mp4') {
           $scope.videos.push({
             title: title,
             link: track.url
           });
          };
        });
  		};
      angular.forEach($scope.data, sort)
  	};

  	var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22http%3A%2F%2Fplayback-qa.ets.berkeley.edu%2Fsearch%2FpaellaEpisodeListing.json%3Fq%3D%26sid%3D0570faa9-c983-42a2-a788-95c11ae06cca%26limit%3D100000%26offset%3D0%26_%3D1383056817297%22&format=json&callback=JSON_CALLBACK';
  	$http.jsonp(url).
  		success(function(data, status, headers, config) {
    		$scope.data = data.query.results['search-results'].result;
    		findVideos();
  		});

  }]);

})(window, window.calcentral);
