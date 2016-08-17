// 图片池,为动态生成每个page预留接口
var IMGPOOL = [ {
	"picNamePre" : "Tyrion-Lannister",
	"picNum" : 2
}, {
	"picNamePre" : "Emilia-Clarke",
	"picNum" : 4
} ];

$(function() {
	initWindowResize();
	initScrollIcon();
	initTopScroll();
	initImage();
});

// 监控浏览器滚动条
function initScrollIcon() {
//	navbar是否显示;true--是,false--否
	var navbarShow = false;
	$(window).scroll(function() {
//		在滚条位置>0且navbar未显示时navbar渐入
		if ($(this).scrollTop() > 0 && navbarShow === false) {
			navbarShow = true;
			$('.header').slideDown(1000);
//		在滚条位于顶端且navbar显示时navbar渐出
		} else if ($(this).scrollTop() === 0 && navbarShow === true) {
			navbarShow = false;
			$('.header').slideUp(1000);
		}
	
//		在首屏滚动时动态改变背景图片的margin-top值制造视差效果
		if ($(this).scrollTop() >= 0 && $(this).scrollTop() < $(".content").offset().top) {
			$("img.bg-"+IMGPOOL[0].picNamePre).css("margin-top", $(this).scrollTop() / 3);
		}
	});
};

// 监控窗口大小改变
function initWindowResize(){
	$(window).resize(function() {
//		遍历图片池
		for(var i=0; i<IMGPOOL.length; i++){
//			获取图片dom
			var imgDom = $(".bg-"+IMGPOOL[i].picNamePre);
//			重计算图片尺寸
			var imgStyle = countImageSize(imgDom.width(),imgDom.height());
//			调整图片样式
			imgDom.css(imgStyle);
		}
	});
}

// 页面按钮点击跳转动画
function initTopScroll() {
	$('i.href-icon').bind("click", function(e) {
		var anchor = $(this);
		$('html,body').stop().animate({
			scrollTop : $(anchor.attr('href')).offset().top
		}, 1500);
		e.preventDefault();
	});
};

// 初始化图片
function initImage(){
	for(var i=0; i<IMGPOOL.length; i++){
		loadImage(".bg-"+IMGPOOL[i].picNamePre,IMGPOOL[i].picNamePre,IMGPOOL[i].picNum);
	}
}

/*!
 * 异步加载图片
 * @param {string} cssName 图片所在dom选择器
 * @param {string} picName 图片文件命名
 * @param {string} picNum 备选图片数量
 */
function loadImage(cssName,picName,picNum){
	
//	异步返回图片信息(这里的异步是为了取得图片的原始尺寸,以便调整图片显示区域)
	var promise = getImage(picName,picNum);
	
	$.when(promise).done(function(imgData,b,c,d,e,f) {
//		计算图片显示区域
		var imgStyle = countImageSize(imgData.width,imgData.height);
//		渲染图片
		$(cssName).prop("src",imgData.url);
//		调整图片样式,显示
		$(cssName).css(imgStyle).removeClass("hide");
	}).fail(function(error) {
//		加载失败重新加载
		loadImage(cssName,picName,picNum);
	});
}

/*!
 * 异步获取图片
 * @param {string} picName 图片文件命名
 * @param {string} picNum 备选图片数量
 */
function getImage(picName,picNum) {
	var deferred = $.Deferred(),
//	从图片池里随机选取一张图片加载
		imgUrl = "img/" + picName + "-0" + random(1,parseInt(picNum)+1) + ".jpg",
		img = new Image();
	
//	加载成功回调
	img.onload = function () {
		deferred.resolve(
				{
					"url": img.src,
					"width": img.naturalWidth,
					"height": img.naturalHeight
				}
			);
	};
	
//	加载失败回调
	img.onerror = function(){
		deferred.reject();
    };
//  加载src
	img.src = imgUrl;
	return deferred.promise();
};

/*!
 * min-max间随机取一个数字,包含min不包含max
 * @param {number} min 开始值
 * @param {number} max 结束值
 */
function random(min,max){
    return Math.floor(min+Math.random()*(max-min));
}

/*!
 * 计算图片样式
 * @param {number} imgWidth 图片宽度
 * @param {number} imgHeight 图片高度
 * @return {object} returnStyle 返回样式
 */
function countImageSize(imgWidth,imgHeight){
//	浏览器可视区域宽度
	var wdWidth = $(window).width(),
//		浏览器可视区域高度
		wdHeight = $(window).height(),
//		图片宽度
		imgWidth = imgWidth ? parseInt(imgWidth) : 0,
//		图片高度
		imgHeight  = imgWidth ? parseInt(imgHeight) : 0,
//		浏览器可见区域宽高比
		wdWH = wdWidth/wdHeight,
//		图片宽高比
		imgWH = imgWidth/imgHeight,
//		计算后的图片样式
		returnStyle = {
				"width": "",
				"height": "",
				"margin-top": 0,
				"margin-left": 0
		};
		
//		浏览器宽高比 > 图片宽高比
		if(wdWH > imgWH){
//			图片缩放到与浏览器等宽
			returnStyle["width"] =  wdWidth;
//			放大后的图片高度,这里经过两次运算考虑四舍五入的情况,有图片非等比缩放的隐患,遂注掉,只设置图片宽度
			returnStyle["height"] =  "";
//			returnStyle["height"] =  wdWidth/imgWH;
//			图片纵向显示区域,因为备选人物照的脸都相对偏上,所以未做偏移,注掉的是纵向显示中间区域
			returnStyle["margin-top"] = 0;
//			returnStyle["margin-top"] = ((wdWidth/imgWH - wdHeight)/2)*-1;
//			横向能完整显示所以不做偏移
			returnStyle["margin-left"] = 0;
//		浏览器宽高比 <= 图片宽高比
		}else{
//			图片缩放到与浏览器等高
			returnStyle["height"] = wdHeight;
//			同理只设置图片高度
			returnStyle["width"] =  "";
//			returnStyle["width"] =  wdHeight*imgWH;
//			纵向完整显示不做偏移
			returnStyle["margin-top"] = 0;
//			横向显示中间区域
			returnStyle["margin-left"] = ((wdHeight*imgWH - wdWidth)/2)*-1;
		}
//	返回计算后样式
	return returnStyle;
}