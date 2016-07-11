angular.module('app', []).controller('Ctrl', function($scope, $http) {
	$http.get('data/beautifulGirl.json').success(function(imgs) {
		$scope.imgs = imgs.sort(function() {
//			return 0.5 - Math.random()
		})
	});

	$(".fav-list").delegate("img", "click", function() {
		//	  $scope.showImgSrc = this.src;
		var imgHeight = this.naturalHeight,
			imgWidth = this.naturalWidth,
			scaleImg = imgHeight / imgWidth,
			
			screenHeight = $(window).height(),
			screenWidth = $(window).width(),
			scaleScreen = screenHeight / screenWidth,
			
			fixHeight,fixWidth;
		

		$("#showImg").attr("src", this.src);
		if(scaleImg > scaleScreen){
			fixHeight = screenHeight - 60;
			fixWidth = fixHeight/scaleImg;
			$("#imgDashboard").css("top","0");
		}else{
			fixWidth = screenWidth*0.8;
			fixHeight = fixWidth*scaleImg;
			$("#imgDashboard").css("top",(screenHeight-fixHeight)/2);
		}
		
		$("#imgDashboard .modal-dialog").width(fixWidth);
		$("#showImg").height(fixHeight);
		$("#imgDashboard").modal("show");
	});
})