$(function() {
	initSize();
});

function initSize(){
	var windowsH = $(window).height(),
		windowsW = $(window).width();
	
	$("body").css({"height": windowsH , "width": windowsW});
}