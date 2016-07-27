var lastNum = "0",
	currentNum = "0",
	keyValueObj = {"1": "C","2": "+/-","3": "%","4": "÷","5": "7","6": "8","7": "9","8": "×","9": "4","10": "5","11": "6","12": "-","13": "1","14": "2","15": "3","16": "+","17": "0","18": ".","19": "="},
	typeWriterMessage = ["Support by:","Yiran Wang."],
	titleMessage = typeWriterMessage[0].split(""),
	nameMessage = typeWriterMessage[1].split(""),
	colorList = ["#8bcbf7","#459968","#efc4cb","#e7cfa6","#c92b2b","#000000"];

$(function() {
	setKeyWidth();
	blindEvent();
	typewriter();
});

function typewriter(){
	if(titleMessage.length > 0){
		setTimeout(function(){
			$(".message-title").append(titleMessage.shift());
			typewriter();
		}, 150);
	}else if(nameMessage.length > 0){
		setTimeout(function(){
			$(".message-name").append(nameMessage.shift());
			typewriter();
		}, 200);
	}else{
		$(".showpic-p").show(3000,
			initCanvas
		);
	}
}

function initCanvas(){
	$(".loading-progress").show();
	changeProgress();
//	setTimeout("changeColor()",5000);
}

var loadNum = 0;
function changeProgress(){
	setTimeout(function(){
		$(".loading-progress .bar").css("width",(loadNum/10)*100 + "%");
		loadNum ++;
		if(loadNum < 11){
			changeProgress();
		}else{
			setTimeout(function(){
				$(".loading-progress").hide();
				changeColor();
			}, 1000);
		}
	}, 250);
}

function changeColor(){
	if(colorList.length > 0){
		setTimeout(function(){
			$("body").css("background-color",colorList.shift());
			changeColor();
		}, 1000);
	}else{
		$(".showmessage-p").css("color","#FFFFFF");
		canvas();
	}
}

function canvas(){
	$(".loading").slideUp( 2000, function(){
		$(".calculator").slideDown(2000);
    });
}

function setKeyWidth() {
	var screenHeight = $(window).height(),
		screenWidth = $(window).width(),
		calculatorWidth = $(".calculator").width(),
		keyWidth = (calculatorWidth - 5) / 4, zeroWidth = keyWidth * 2 + 1;
	$(".key:not(.screen,.zero)").width(keyWidth);
	$(".key.zero").width(zeroWidth);
	$(".key:not(.screen)").css("line-height", $(".key.zero").height() + "px");
	
//	$(".loading").css("line-height", screenHeight/3 + "px");
	$(".show-pic").css("width",screenWidth-parseInt($(".showpic-p").css("padding-left"))-parseInt($(".showpic-p").css("padding-right")));
	$(".showmessage-p").css("top",screenWidth);
}

function blindEvent(){
	var calcula = $(".calculator > .row > .calcula");
	calcula.on({
		touchstart: function (e) {
			$(this).addClass("op-touch");
			e = e || event;
			calculaClick(e,this);
		},
		touchend: function (e) {
			$(this).removeClass("op-touch");
		},
		click: function (e) {
			e = e || event;
			calculaClick(e,this);
		}
	});
	
	var num = $(".calculator > .row > .num");
	num.on({
		touchstart: function (e) {
			$(this).addClass("nf-touch");
			e = e || event;
			numClick(e,this);
		},
		touchend: function (e) {
			$(this).removeClass("nf-touch");
		},
		click: function (e) {
			e = e || event;
			numClick(e,this);
		}
	});
	
	var func = $(".calculator > .row > .func");
	func.on({
		touchstart: function (e) {
			$(this).addClass("nf-touch");
			e = e || event;
			funcClick(e,this);
		},
		touchend: function (e) {
			$(this).removeClass("nf-touch");
		},
		click: function (e) {
			e = e || event;
			funcClick(e,this);
		}
	});
	
	var result = $(".calculator > .row > .result");
	result.on({
		touchstart: function (e) {
			$(this).addClass("op-touch");
			e = e || event;
			resultClick(e,this);
		},
		touchend: function (e) {
			$(this).removeClass("op-touch");
		},
		click: function (e) {
			e = e || event;
			resultClick(e,this);
		}
	});
}

function calculaClick(event,thisObj){
	if(event.type === "touchstart"){
		event.preventDefault();
	}
	$(".calcula.select").removeClass("select");
	$(".calcula.bottom-select").removeClass("bottom-select");
	$(thisObj).addClass("select");
	$(thisObj).parent().prev().children(".calcula").addClass("bottom-select");
	lastNum = currentNum;
	currentNum = "0";
}

function numClick(event,thisObj){
	if(event.type === "touchstart"){
		event.preventDefault();
	}
	if(!isFinite(currentNum)){
		currentNum = "0";
	}
	var keyCode = $(thisObj).find("span").attr("keyCode"),
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
	showCurrentNum();
}

function funcClick(event,thisObj){
	if(event.type === "touchstart"){
		event.preventDefault();
	}
	if(!Number(currentNum)){
		currentNum = "0";
	}
	var keyCode = $(thisObj).find("span").attr("keyCode");
	if(keyCode == "1"){
		currentNum = "0";
		$(".calcula.select").removeClass("select");
		$(".calcula.bottom-select").removeClass("bottom-select");
	}else if(keyCode == "2"){
		currentNum = (Number(currentNum)*(-1)).toString();
	}else if(keyCode == "3"){
		currentNum = (Number(currentNum)/100).toString();
	}
	showCurrentNum();
}

function resultClick(event,thisObj){
	if(event.type === "touchstart"){
		event.preventDefault();
	}
	if(!Number(currentNum)){
		currentNum = "0";
	}
	var selectKeyCode = $(".calcula.select").find("span").attr("keyCode"),
		integerLastNum = Number(lastNum),
		integerCurrentNum = Number(currentNum),
		resultNum = "";
	if(!selectKeyCode){
		return;
	}else if(selectKeyCode == "16"){
		resultNum = (integerLastNum + integerCurrentNum).toString();
	}else if(selectKeyCode == "12"){
		resultNum = (integerLastNum - integerCurrentNum).toString();
	}else if(selectKeyCode == "8"){
		resultNum = (integerLastNum * integerCurrentNum).toString();
	}else if(selectKeyCode == "4"){
		resultNum = (integerLastNum / integerCurrentNum).toString();
	}
	$(".calcula.select").removeClass("select");
	$(".calcula.bottom-select").removeClass("bottom-select");
	currentNum = resultNum;
	showCurrentNum();
}

function showCurrentNum(){
	if(!isFinite(currentNum)){
		$(".screen span").html("错误");
		currentNum = "0";
		return;
	}
	var formatCurrentNum = Number(currentNum) >= 0 ? currentNum : ((Number(currentNum))*-1).toString(),
		showCurrentNum = "";
	if((formatCurrentNum.indexOf("e") > -1 && formatCurrentNum.split("e")[0].replace(".","").replace(new RegExp(/(,)/g),'').length > 6)||(formatCurrentNum.indexOf("e") === -1 && formatCurrentNum.split("e")[0].replace(".","").replace(new RegExp(/(,)/g),'').length > 9)){
//		formatCurrentNum = (Number(formatCurrentNum)).toPrecision(8).indexOf("e")  > -1 ? (Number(formatCurrentNum)).toPrecision(6) : (Number(formatCurrentNum)).toPrecision(8);
		formatCurrentNum = (Number(formatCurrentNum)).toPrecision(6);
		if(formatCurrentNum.indexOf("e") > -1){
			formatCurrentNum = Number(formatCurrentNum.split("e")[0]).toString() + "e" + formatCurrentNum.split("e")[1];
		}else{
			formatCurrentNum = Number(formatCurrentNum).toString();
		}
		if(formatCurrentNum > -1 && formatCurrentNum < 1 && formatCurrentNum.indexOf("e") === -1){
			formatCurrentNum = Number(Number(formatCurrentNum).toFixed(6)).toString();
		}	
	}
	
	if(formatCurrentNum.indexOf("e") === -1){
		var splitNum = formatCurrentNum.split("."),
			integerPart = splitNum[0],
			decimalPart = splitNum[1] ? splitNum[1] : "";
		if(integerPart.length > 3 && integerPart.length <= 6){
			showCurrentNum = integerPart.slice(0,integerPart.length-3) + "," + integerPart.slice(integerPart.length-3);
		}else if(integerPart.length > 6 && integerPart.length <= 9){
			showCurrentNum = integerPart.slice(0,integerPart.length-6) + "," + integerPart.slice(integerPart.length-6,integerPart.length-3) + "," + integerPart.slice(integerPart.length-3);
		}else{
			showCurrentNum = integerPart;
		}
		if(formatCurrentNum.indexOf(".")  > -1){
			showCurrentNum += "." + decimalPart;
		}
	}else{
		showCurrentNum = formatCurrentNum;
	}
	
	if(Number(currentNum) < 0){
		showCurrentNum = "-"+showCurrentNum;
	}
	
	var fontClass = "font-big font-length-8 font-length-9 font-length-10 font-length-11 font-length-12 font-length-13 font-length-14 font-length-15";
	if(showCurrentNum.length <= 7){
		$(".screen span").removeClass(fontClass).addClass("font-big");
	}else{
		$(".screen span").removeClass(fontClass).addClass("font-length-"+showCurrentNum.length);
	}
	if(showCurrentNum === "0"){
		$(".key.func:first").find("span").html("AC");
	}else{
		$(".key.func:first").find("span").html("C");
	}
	$(".screen span").html(showCurrentNum);
}

$(window).resize(function() {
	setKeyWidth();
});
