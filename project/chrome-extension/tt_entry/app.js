var DAILYTIME = "",
	DAILYDESC = "",
	AUTOCOMMIT = "";

parseUrl();
setCommitMsg();
loadMonitor();

function parseUrl(){
	var url = location.search;
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			var currentParam = strs[i].split("=");
			localStorage.setItem(currentParam[0],currentParam[1]);
		}
	}
}

function setCommitMsg(){
	DAILYTIME = localStorage.getItem("tt_hours") || "8",
	DAILYDESC = localStorage.getItem("tt_description") || "DEV",
	AUTOCOMMIT = localStorage.getItem("tt_autocommit") || "N";
}

function loadMonitor(){
	var jsInitChecktimer = setInterval (checkForJS_Finish, 500);

    function checkForJS_Finish () {
        if (document.getElementById ("ctl00_ContentPlaceHolder1_lbNewDailyReport")
        ) {
            clearInterval (jsInitChecktimer);
            enterTaskTrack();
        }
    }
};

function enterTaskTrack(){
	document.getElementById("ctl00_ContentPlaceHolder1_lbNewDailyReport").click();
	var reportDashboardInitChecktimer = setInterval (checkForReportDashboard_Finish, 500);
    function checkForReportDashboard_Finish () {
        if (document.getElementById ("ctl00_ContentPlaceHolder1_tbHours")){
            clearInterval (reportDashboardInitChecktimer);
            submitTaskTrack();
        }
    }
}

function submitTaskTrack(){
	var lastReportTimeContainer = document.querySelector("#ctl00_ContentPlaceHolder1_gvDailyReportsOfThisMonth tbody tr:nth-child(2) td:nth-child(2)");
		lastReportTime =  lastReportTimeContainer ? lastReportTimeContainer.innerHTML : null; 
	
	if(lastReportTime && lastReportTime.trim() ){
		var todayStart = dayStart(new Date),
			lastReportStart = dayStart(new Date(lastReportTime));
		if(todayStart.getTime() > lastReportStart.getTime()){
			document.getElementById("ctl00_ContentPlaceHolder1_tbHours").value = DAILYTIME;
			document.getElementById("ctl00_ContentPlaceHolder1_tbDescription").value = DAILYDESC;
			if(AUTOCOMMIT === "Y"){
				document.getElementById("ctl00_ContentPlaceHolder1_btnCommit").click();
			}
		}
	}
};

function dayStart(today) {
	today = today || new Date();
	var temp = new Date(today.getTime());
	temp.setHours(0);
	temp.setMinutes(0);
	temp.setSeconds(0);
	temp.setMilliseconds(0);
	return temp;
};

