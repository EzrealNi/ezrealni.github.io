$(function(){  
  initScrollIcon();
  initTopScroll();
  initImage();
});


function initScrollIcon() {
  var navbarShow = false;
  $(window).scroll(function(){
    if ($(this).scrollTop() > 0 & navbarShow === false) {
      navbarShow = true;
      $('.header').slideDown(1500);
    } else if($(this).scrollTop() === 0 & navbarShow === true){
      navbarShow = false;
      $('.header').slideUp(1500);
    }
    
    if($(this).scrollTop() >= 0 && $(this).scrollTop() < $(".content").offset().top){
    	$("img.bg-index").css("margin-top",$(this).scrollTop()/2);
    }
  });
};

function initTopScroll(){
  $('i.href-icon').bind("click", function(e) {
    var anchor = $(this);
    $('html,body').stop().animate({
      scrollTop : $(anchor.attr('href')).offset().top
    }, 1500);
      e.preventDefault();
  });
};

function initImage(){
	loadImage(".bg-index","Tyrion-Lannister",2);
	loadImage(".bg-content","Emilia-Clarke",4);
}

function loadImage(cssName,picName,picNum){
	
	var promise = getImage(picName,picNum);
	
	$.when(promise).done(function(imgData,b,c,d,e,f) {
		var imgStyle = countImageSize(imgData.width,imgData.height);
		
		$(cssName).prop("src",imgData.url);
		$(cssName).css(imgStyle).removeClass("hide");
	}).fail(function(error) {
		loadImage(cssName,picName,picNum);
	});
}

function getImage(picName,picNum) {
	var deferred = $.Deferred(),
		imgUrl = "img/" + picName + "-0" + random(1,parseInt(picNum)+1) + ".jpg",
		img = new Image();
	
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
	return deferred.promise();
};

function random(min,max){
    return Math.floor(min+Math.random()*(max-min));
}

function countImageSize(imgWidth,imgHeight){
	var wdWidth = $(window).width(),
		wdHeight = $(window).height(),
		imgWidth = imgWidth ? parseInt(imgWidth) : 0,
		imgHeight  = imgWidth ? parseInt(imgHeight) : 0,
		wdWH = wdWidth/wdHeight,
		imgWH = imgWidth/imgHeight,
		returnStyle = {
				"width": 0,
				"height": 0,
				"margin-top": 0,
				"margin-left": 0
		};
		
		if(wdWH > imgWH){
			returnStyle["width"] =  wdWidth;
			returnStyle["height"] =  wdWidth/imgWH;
			returnStyle["margin-top"] = 0;
			returnStyle["margin-left"] = 0;
//			returnStyle["margin-top"] = ((returnStyle["height"] - wdHeight)/2)*-1;
		}else{
			returnStyle["height"] = wdHeight;
			returnStyle["width"] =  wdHeight*imgWH;
			returnStyle["margin-top"] = 0;
			returnStyle["margin-left"] = ((returnStyle["width"] - wdWidth)/2)*-1;
		}
	
	return returnStyle;
}