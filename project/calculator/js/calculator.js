var lastNum = "0",
	currentNum = "0",
	keyValueObj = {"1": "C","2": "+/-","3": "%","4": "÷","5": "7","6": "8","7": "9","8": "×","9": "4","10": "5","11": "6","12": "-","13": "1","14": "2","15": "3","16": "+","17": "0","18": ".","19": "="};

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
	
	$(".calculator > .row").on("click", ".num", function(){
		var keyCode = $(this).find("span").attr("keyCode"),
			keyValue = keyValueObj[keyCode];
		if(currentNum.replace(".","").replace(new RegExp(/(,)/g),'').length >= 9){
			return;
		}else if(currentNum == "0" && keyCode != "18"){
			currentNum = keyValue;
		}else if(currentNum.indexOf(".")  > -1 && keyCode == "18"){
			return;
		}else{
			currentNum += keyValue;
		}
		$(".screen span").html(currentNum);
	});
	
	$(".calculator > .row").on("click", ".func", function(){
		var keyCode = $(this).find("span").attr("keyCode"),
			keyValue = keyValueObj[keyCode];
		var clickKey = $(this).find("span").text();
		if(keyCode == "1"){
			currentNum = "0";
		}else if(keyCode == "2"){
			currentNum = (Number(currentNum)*(-1)).toString();
		}else if(keyCode == "3"){
			currentNum = (Number(currentNum)/100).toString();
		}
		$(".screen span").html(currentNum);
	});
}

function showCurrentNum(){
	var splitNum = currentNum.split(".");
	
}

$(window).resize(function() {
	setKeyWidth();
});
