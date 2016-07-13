angular.module('app', []).controller('Ctrl', function($scope, $http, $q) {
	
	$scope.loading = false;
	$scope.loadingProgress = 0;
	$scope.loadingPercent = {width: "0%"};
	$scope.imgsData = [];
	$scope.imgs = [];
	$scope.cfg = {
		"startStaffId": 1,
		"defaultEachNum": 50,
		"failTotalNum": 200
	};
	$scope.cfg["lastStaffId"] = $scope.cfg.startStaffId;
	$scope.cfg["staffId"] = $scope.cfg.lastStaffId;
	
	$scope.$on('$destroy',function(){
		/* fix bug: destroy the two dialogs generated from grid's navGrid method */
		$(window).off("scroll", lazyloading);
	});
	
	setTimeout(function() {
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
	    loadingTop = $("#progress-loading-l").offset().top;
		/* type1:  */
		if (y + windowH > hisTableHeight && $scope.loading == false ) {
			loadNextPage();
//		    console.log("show loading and do request1.");
		}
		  
		/* type2: */  
		if (y + windowH > loadingTop) {
//		    console.log("show loading and do request2.");
		}
	}, 500);// 250ms 执行一次
	
	function loadNextPage(){
		$scope.loading = true;
		$scope.cfg["eachNum"] = $scope.cfg.defaultEachNum;
		$scope.imgsData = [];
		loadNetImg();
	}
	
	function loadNetImg(){
		if($scope.cfg.staffId - $scope.cfg.lastStaffId > $scope.cfg.failTotalNum){
			$scope.imgs = $scope.imgs.concat($scope.imgsData);
			$scope.loading = false;
			return;
		}
		var promise = loadImage($scope.cfg.staffId,$scope.cfg.eachNum);
		promise.then(
			function(imgData){
				$scope.cfg.lastStaffId = $scope.cfg.staffId;
				$scope.cfg.eachNum --;
				$scope.cfg.staffId ++;
				$scope.loadingProgress = ((1 - $scope.cfg.eachNum/$scope.cfg.defaultEachNum)*100).toFixed(2);
				$scope.loadingPercent = {width: $scope.loadingProgress + "%"};
				$scope.imgsData.push(imgData);
				if($scope.cfg.eachNum === 0){
					$scope.imgs = $scope.imgs.concat($scope.imgsData);
					$scope.loading = false;
					return;
				}
				
				loadNetImg();
			},
			function(error) {
				if($scope.cfg.staffId - $scope.cfg.lastStaffId > $scope.cfg.failTotalNum){
					return;
				}else{
					$scope.cfg.staffId ++;
				}
				loadNetImg();
			}, 
			function(notify) {
				console.log("notify");
			}
		);
	};
	
	function staffIdAddYear(staffId){
		var nowYear = staffIdToString(staffId).substring(0,2);
			nextYearStart = (Number(nowYear)+1)*10000 + 1;
		return nextYearStart;
	}
	
	function staffIdToString(staffId){
		if(staffId.toString().length === 5){
			return "0" + staffId;
		}else{
			return staffId.toString();
		}
	}
	
	function loadImage(staffId) {
		var deferred = $q.defer(),
			imgUrl = "https://ss2.bdstatic.com/kfoZeXSm1A5BphGlnYG/skin/" + staffId + ".jpg",
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
			$("#imgDashboard").css("top",(screenHeight-fixHeight-60)/2);
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
	
	/**
     * apply one circle in angular.
     */
	function apply4check($scope) {
		if(!$scope.$$phase) {
		    $scope.$apply();
		}
	};
})
