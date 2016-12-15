angular.module('app', []).controller('Ctrl', function($scope, $http, $q) {
	
	$scope.progress = false;
	$scope.imgs = [];
	$scope.cfg = {
		"startStaffId": 160001,
		"finalStaffId": getfinalStaffId(),
		"defaultEachNum": 400,
		"failTotalNum": 40
	};
	$scope.cfg["lastStaffId"] = $scope.cfg.startStaffId;
	$scope.cfg["staffId"] = $scope.cfg.lastStaffId;
//	var lastStaffId = 40001;
//	var	startStaffId = lastStaffId;
//	var	finalStaffId = getfinalStaffId();
//	var staffId = startStaffId;
//	var	eachNum = 40;
//	var	failTotalNum = 20;
	
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
	
	function initPage(){
		$http.get('data/beautifulGirl.json').success(function(imgs) {
			$scope.imgs = imgs.sort(function() {
				return 0.5 - Math.random();
			})
		});
	};
	
	function getfinalStaffId(){
		var nextYear = new Date().getFullYear() + 1;
		return Number(nextYear.toString().substring(2,4) + "0000");
	}
	
	function loadNextPage(){
		$scope.progress = true;
		$scope.cfg["eachNum"] = $scope.cfg.defaultEachNum;
		loadNetImg();
	}
	
	function loadNetImg(){
		if($scope.cfg.staffId >= $scope.cfg.finalStaffId){
			$scope.progress = false;
			return;
		}
		var promise = loadImage($scope.cfg.staffId,$scope.cfg.eachNum);
		promise.then(
			function(imgData){
				$scope.cfg.lastStaffId = $scope.cfg.staffId;
				$scope.cfg.eachNum --;
				$scope.imgs.push(imgData);
				if($scope.cfg.eachNum === 0){
//					$scope.imgs = $scope.imgs.concat(imgList);
					$scope.progress = false;
					$scope.cfg.staffId ++;
					return;
				}else{
					if($scope.cfg.staffId - $scope.cfg.lastStaffId > $scope.cfg.failTotalNum){
						$scope.cfg.staffId = staffIdAddYear($scope.cfg.staffId);
					}else{
						$scope.cfg.staffId ++;
					}
					loadNetImg();
				}
			},
			function(error) {
				if($scope.cfg.staffId - $scope.cfg.lastStaffId > $scope.cfg.failTotalNum){
					console.log("lastStaffId -- "+$scope.cfg.lastStaffId);
					console.log("staffId -- " +$scope.cfg.staffId);
					$scope.cfg.staffId = staffIdAddYear($scope.cfg.staffId);
					$scope.cfg.lastStaffId = $scope.cfg.staffId;
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
			imgUrl = "http://myhengtian/photo/" + staffIdToString(staffId) + ".png",
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
})
