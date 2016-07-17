$(function() {
	setKeyWidth();
	blindEvent();
});

function setKeyWidth() {
	var calculatorWidth = $(".calculator").width(),
		keyWidth = (calculatorWidth - 5) / 4, zeroWidth = keyWidth * 2 + 1;
	$(".key:not(.screen,.zero)").width(keyWidth);
	$(".key.zero").width(zeroWidth);
	$(".key:not(.screen)").css("line-height", $(".key.zero").height() + "px");
}

function blindEvent(){
	$(".calculator > .row").on("click", ".calcula", function(){
		$(".calcula.select").removeClass("select");
		$(".calcula.bottom-select").removeClass("bottom-select");
		$(this).addClass("select");
		$(this).parent().prev().children(".calcula").addClass("bottom-select");
	});
}

$(window).resize(function() {
	setKeyWidth();
});
