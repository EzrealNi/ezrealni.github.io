angular.module('app', []).controller('Ctrl', function($scope, $http, $q) {
	
	$scope.progress = false;
	$scope.imgs = [];
	$scope.cfg = {
		"edition": 1,
		"picture": 1,
		"defaultEachNum": 400,
		"failTotalNum": 5,
		"urlConfig": [{"pre": "ROSI","last": "jpg"},{"pre": "ROSI","last": "JPG"},{"pre": "rosimm","last": "jpg"},{"pre": "rosimm","last": "JPG"}],
		"configIndex": 0
	};
	$scope.cfg["lastEdition"] = $scope.cfg.edition;
	$scope.cfg["lastPicture"] = $scope.cfg.picture;
	$scope.cfg["lastConfigIndex"] = $scope.cfg.configIndex;
	
	$scope.$on('$destroy',function(){
		/* fix bug: destroy the two dialogs generated from grid's navGrid method */
		$(window).off("scroll", lazyloading);
	});
	
	setTimeout(function() {
//		initPage();
//		loadNetImg();
		initScrollEvent();
		loadNextPage();
	}, 400);
	
	function initScrollEvent(){
		$(window).on('scroll', lazyloading);
	}
	
	var lazyloading = throttle(function(e) {
		var hisTable = $(".fav-list"),
	    windowH = $(window).height(), // current window's height
	    y = $(window).scrollTop(), // current scroll y
	    hisTableHeight =  hisTable.height() + hisTable.offset().top, // total height
	    loadingTop = $("#progress-loading").offset().top;
		/* type1:  */
		if (y + windowH > hisTableHeight && $scope.progress == false ) {
			loadNextPage();
//		    console.log("show loading and do request1.");
		}
		  
		/* type2: */  
		if (y + windowH > loadingTop) {
//		    console.log("show loading and do request2.");
		}
	}, 500);// 250ms 执行一次
	
	function loadNextPage(){
		$scope.progress = true;
		$scope.cfg["eachNum"] = $scope.cfg.defaultEachNum;
		loadNetImg();
	}
	
	function loadNetImg(){
		if($scope.cfg.edition - $scope.cfg.lastEdition >= $scope.cfg.failTotalNum ){
			$scope.progress = false;
			return;
		}
		var promise = loadImage();
		promise.then(
			function(imgData){
				$scope.cfg.lastEdition = $scope.cfg.edition;
				$scope.cfg.lastPicture = $scope.cfg.picture;
				$scope.cfg.lastConfigIndex = $scope.cfg.configIndex;
				$scope.cfg.eachNum --;
				$scope.imgs.push(imgData);
				if($scope.cfg.eachNum === 0){
//					$scope.imgs = $scope.imgs.concat(imgList);
					$scope.progress = false;
					$scope.cfg.picture ++;
					return;
				}else{
					if($scope.cfg.picture - $scope.cfg.lastPicture > $scope.cfg.failTotalNum){
						$scope.cfg.edition ++;
						$scope.cfg.picture = 1;
						$scope.cfg.lastPicture = 1;
					}else{
						$scope.cfg.picture ++;
					}
					loadNetImg();
				}
			},
			function(error) {
				if($scope.cfg.picture - $scope.cfg.lastPicture > $scope.cfg.failTotalNum){
					$scope.cfg.edition ++;
					$scope.cfg.picture = 1;
					$scope.cfg.lastPicture = 1;
				}else if($scope.cfg.picture === 1){
					$scope.cfg.configIndex < 3 ? $scope.cfg.configIndex ++ : $scope.cfg.configIndex = 0;
					if($scope.cfg.configIndex === $scope.cfg.lastConfigIndex){
						$scope.cfg.picture ++;
					}
				}else{
					$scope.cfg.picture ++;
				}
				loadNetImg();
			}, 
			function(notify) {
				console.log("notify");
			}
		);
	};
	
	function staffIdToString(staffId){
		if(staffId.toString().length === 1){
			return "00" + staffId;
		}else if(staffId.toString().length === 2){
			return "0" + staffId;
		}else{
			return staffId.toString();
		}
	}
	
	function loadImage() {
		var deferred = $q.defer(),
			urlPre = $scope.cfg.urlConfig[$scope.cfg.configIndex]["pre"],
			urlLast = $scope.cfg.urlConfig[$scope.cfg.configIndex]["last"],
			imgUrl = "http://www.rosixz.com/photo/" + staffIdToString($scope.cfg.edition) + "/"+urlPre+"_" + staffIdToString($scope.cfg.edition) + "_" + staffIdToString($scope.cfg.picture) + "." + urlLast,
			img = new Image();
		 
//		if(img.complete) {
//			deferred.resolve(
//				{
//					"url": img.src,
//					"width": img.naturalWidth,
//					"height": img.naturalHeight
//				}
//			);
//		}else{
//			deferred.reject();
//		}
		
		img.onload = function () {
			deferred.resolve(
					{
						"url": img.src,
						"width": img.naturalWidth,
						"height": img.naturalHeight
					}
				);
		};
		
		img.onerror = function(){
			deferred.reject();
        };
		img.src = imgUrl;
		
//		if(!img.complete){
//			deferred.reject();
//		}
		
		return deferred.promise;
	};
		
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
			fixWidth = screenWidth - 60;
			fixHeight = fixWidth*scaleImg;
			$("#imgDashboard").css("top",(screenHeight-fixHeight)/2);
		}
		
		$("#imgDashboard .modal-dialog").width(fixWidth);
		$("#showImg").height(fixHeight);
		$("#imgDashboard").modal("show");
	});
	
	/**
	 * @param fn {Function}		实际要执行的函数
	 * @param delay {Number}	延迟时间，也是阀值，单位毫秒(ms)
	 * @param scope {Object}	上下文对象
	 * @returns {Function}		返回一个"已节流"了的函数
	 */
	function throttle(fn, delay, scope){
		var timer, last, threshhold = delay || 250;
		return function() {
			var context = scope || this, args = arguments;
			var now = +new Date();
			if (last && now < last + threshhold) {
				clearTimeout(timer);
				setTimeout(function(){
					last = now;
					fn.apply(context, args);
				}, threshhold);
			} else { // first time
				last = now;
				fn.apply(context, args);
			}
		};
	};
})
