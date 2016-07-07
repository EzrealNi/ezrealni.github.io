$(function(){
	initDashBoardData();
	blindEvent();
}); 

function initDashBoardData(){
	var ScreenWidth = $(window).width(),
		tdWidth = (ScreenWidth-150)/10;
	var yearStart = 15,
		yearEnd = 16,
		numStart = 1,
		numEnd = 1500;
	var tbodyHtml = "",
		trHtml = "<tr>",
		tdNum = 0;
	
	
	for(var year = yearStart ; year < yearEnd ; year ++ ){
		for(var num = numStart ; num < numEnd ; num ++ ){
			var showNum = "",showYear = year;
			if(num < 10){
				showNum = "000" + num;
			}else if(10 <= num && num < 100){
				showNum = "00" + num;
			}else if(100 <= num && num < 1000){
				showNum = "0" + num;
			}else{
				showNum = "" + num;
			}
			if(year < 10){
				showYear = "0" + year;
			}
			getUrl = "http://myhengtian/photo/" + showYear + "" + showNum + ".png";
			if(tdNum < 10){
				trHtml += "<td><img style='width:"+tdWidth+"px;' src='"+getUrl+"'  alt='img load failed'/></td>";
				tdNum++;
			}else{
				trHtml += "</tr>";
				tbodyHtml += trHtml;
				trHtml = "<tr>";
				trHtml += "<td><img style='width:"+tdWidth+"px;' src='"+getUrl+"'  alt='img load failed'/></td>";
				tdNum = 1;
			}
		}
	}
	$(".dashboard_div table > tbody").append(tbodyHtml);
}

function blindEvent(){
	$("table td").delegate("img","dblclick",function(){
		window.open(this.src);
	});
}
