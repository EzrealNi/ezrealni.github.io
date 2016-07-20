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
	
//	var clacula = document.querySelector(".calculator > .row > .screen");
//	clacula.addEventListener("touchstart", function(e){
//	       e.preventDefault();
//	       clacula.style.background = "red";
//	       console.log("touchstart");
//	});
//	
//	clacula.addEventListener("click", function(e){
//		clacula.style.background = "blue";
//	       console.log("click");
//	});
//	
//	$(".calculator > .row > .calcula").click( function(){
//		$(".calcula.select").removeClass("select");
//		$(".calcula.bottom-select").removeClass("bottom-select");
//		$(this).addClass("select");
//		$(this).parent().prev().children(".calcula").addClass("bottom-select");
//		lastNum = currentNum;
//		currentNum = "0";
//	} );
//	
//	$(".calculator > .row > .num").click( function(){
//		if(!isFinite(currentNum)){
//			currentNum = "0";
//		}
//		var keyCode = $(this).find("span").attr("keyCode"),
//			keyValue = keyValueObj[keyCode];
//		if(currentNum.replace(".","").replace(new RegExp(/(,)/g),'').length >= 9){
//			return;
//		}else if(currentNum == "0" && keyCode != "18"){
//			currentNum = keyValue;
//		}else if(currentNum.indexOf(".")  > -1 && keyCode == "18"){
//			return;
//		}else{
//			currentNum += keyValue;
//		}
//		showCurrentNum();
//	});
//	
//	$(".calculator > .row > .func").click( function(){
//		if(!Number(currentNum)){
//			currentNum = "0";
//		}
//		var keyCode = $(this).find("span").attr("keyCode");
//		if(keyCode == "1"){
//			currentNum = "0";
//			$(".calcula.select").removeClass("select");
//			$(".calcula.bottom-select").removeClass("bottom-select");
//		}else if(keyCode == "2"){
//			currentNum = (Number(currentNum)*(-1)).toString();
//		}else if(keyCode == "3"){
//			currentNum = (Number(currentNum)/100).toString();
//		}
//		showCurrentNum();
//	});
//	
//	$(".calculator > .row > .result").click( function(){
//		if(!Number(currentNum)){
//			currentNum = "0";
//		}
//		var selectKeyCode = $(".calcula.select").find("span").attr("keyCode"),
//			integerLastNum = Number(lastNum),
//			integerCurrentNum = Number(currentNum),
//			resultNum = "";
//		if(!selectKeyCode){
//			return;
//		}else if(selectKeyCode == "16"){
//			resultNum = (integerLastNum + integerCurrentNum).toString();
//		}else if(selectKeyCode == "12"){
//			resultNum = (integerLastNum - integerCurrentNum).toString();
//		}else if(selectKeyCode == "8"){
//			resultNum = (integerLastNum * integerCurrentNum).toString();
//		}else if(selectKeyCode == "4"){
//			resultNum = (integerLastNum / integerCurrentNum).toString();
//		}
//		$(".calcula.select").removeClass("select");
//		$(".calcula.bottom-select").removeClass("bottom-select");
//		currentNum = resultNum;
//		showCurrentNum();
//	});
	
	var calcula = $(".calculator > .row > .calcula");
	calcula.on("touchstart",calculaClick);
	calcula.on("click",calculaClick);
	
	var num = $(".calculator > .row > .num");
	num.on("touchstart",numClick);
	num.on("click",numClick);
	
	var func = $(".calculator > .row > .func");
	func.on("touchstart",funcClick);
	func.on("click",funcClick);
	
	var result = $(".calculator > .row > .result");
	result.on("touchstart",resultClick);
	result.on("click",resultClick);
}

function calculaClick(){
	event = event || e || "";
	if(event.type === "touchstart"){
		event.preventDefault();
	}
	$(".calcula.select").removeClass("select");
	$(".calcula.bottom-select").removeClass("bottom-select");
	$(this).addClass("select");
	$(this).parent().prev().children(".calcula").addClass("bottom-select");
	lastNum = currentNum;
	currentNum = "0";
}

function numClick(){
	event = event || e || "";
	if(event.type === "touchstart"){
		event.preventDefault();
	}
	if(!isFinite(currentNum)){
		currentNum = "0";
	}
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
	showCurrentNum();
}

function funcClick(){
	event = event || e || "";
	if(event.type === "touchstart"){
		event.preventDefault();
	}
	if(!Number(currentNum)){
		currentNum = "0";
	}
	var keyCode = $(this).find("span").attr("keyCode");
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

function resultClick(){
	event = event || e || "";
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
	if(formatCurrentNum.split("e")[0].replace(".","").replace(new RegExp(/(,)/g),'').length > 9){
		formatCurrentNum = (Number(formatCurrentNum)).toPrecision(8).indexOf("e")  > -1 ? (Number(formatCurrentNum)).toPrecision(6) : (Number(formatCurrentNum)).toPrecision(8);
		if(formatCurrentNum.indexOf("e") > -1){
			formatCurrentNum = Number(formatCurrentNum.split("e")[0]).toString() + "e" + formatCurrentNum.split("e")[1];
		}else{
			formatCurrentNum = Number(formatCurrentNum).toString();
		}
		if(formatCurrentNum > -1 && formatCurrentNum < 1 && formatCurrentNum.indexOf("e") === -1){
			formatCurrentNum = Number(Number(formatCurrentNum).toFixed(8)).toString();
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
	
	var fontClass = "font-big font-length-8 font-length-9 font-length-10 font-length-11 font-length-12 font-length-13";
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
