document.addEventListener("DOMContentLoaded", function() {
	bindEvent();
	initPage();
}, false);

function initPage() {
	var $rows = document.querySelectorAll(".content .row");
	for(var r=0; r<$rows.length; r++){
		var $currentRow = $rows[r],
			$currentArea = $currentRow.querySelector(".control .textarea");
		if(localStorage.getItem($currentArea.id)){
			$currentRow.classList.remove("hide");
			$currentArea.innerHTML = localStorage.getItem($currentArea.id);
			if(r === $rows.length-1){
				$currentArea.focus();
			}else{
				$currentArea.contentEditable = false;
			}
		}else{
			$currentRow.classList.add("hide");
			if(r === 0){
				$currentRow.classList.remove("hide");
				$currentArea.focus();
			}
		}
	}
}

function bindEvent() {
	var $tt_hours = document.querySelector("#tt_hours"),
		$tt_description = document.querySelector("#tt_description");

	var $area = document.querySelectorAll(".control .textarea");
	for (var i = 0; i < $area.length; i++) {
		var $currentArea = $area[i];
		$currentArea.onfocus = function(event) {
			window.setTimeout(function() {
				var $currentTarget = event.target;
				var sel, range;
				if (window.getSelection && document.createRange) {
					range = document.createRange();
					range.selectNodeContents($currentTarget);
					range.collapse(true);
					range.setEnd($currentTarget, $currentTarget.childNodes.length);
					range.setStart($currentTarget, $currentTarget.childNodes.length);
					sel = window.getSelection();
					sel.removeAllRanges();
					sel.addRange(range);
				} else if (document.body.createTextRange) {
					range = document.body.createTextRange();
					range.moveToElementText($currentTarget);
					range.collapse(true);
					range.select();
				}
			}, 1);
		}
		
		$currentArea.onkeydown = function(event) {
			var $currentTarget = event.target,
				$area = document.querySelectorAll(".control .textarea");
			
			var index = indexOfDom($currentTarget,$area),
				$preTarget = index > 0 ? $area[index-1] : null,
				$nextTarget = index < $area.length ? $area[index+1] : null;
			var e = event || window.event || arguments.callee.caller.arguments[0];
			if (e && e.keyCode == 8 && !$currentTarget.innerHTML && index != 0) {
				$currentTarget.contentEditable = false;
				$currentTarget.parentNode.parentNode.classList.add("hide");
				$preTarget.contentEditable = true;
				$preTarget.focus();
			}else if (e && e.keyCode == 13) {
				e.preventDefault();
				$currentTarget.contentEditable = false;
				if ($nextTarget){
					$nextTarget.parentNode.parentNode.classList.remove("hide");
					$nextTarget.contentEditable = true;
					$nextTarget.focus();
				} else {
					var postMsg = "";
					for (var i = 0; i < $area.length; i++) {
						var $currentArea = $area[i];
						localStorage.setItem($currentArea.id,$currentArea.innerHTML);
						postMsg += $currentArea.id+"="+$currentArea.innerHTML;
						if(i != $area.length-1){
							postMsg+= "&";
						}
					}
					
					var hrefUrl = "http://myhengtian:8033/WorkingReport/DailyReport.aspx";
						hrefUrl += postMsg ? "?"+postMsg : "";
					window.open(hrefUrl);
				};
			}
		};
	}
	
	function indexOfDom($dom,$domList){//need id
		for(var d=0; d<$domList.length; d++){
			var $currentDom = $domList[d];
			if($dom === $currentDom){
				return d;
			}
		}
		return null;
	}
	
	
//	$tt_hours.onkeydown = function(event) {
//		var e = event || window.event || arguments.callee.caller.arguments[0];
//		if (e && e.keyCode == 13) {
//			$tt_hours.contentEditable = false;
//			document.querySelector(".description_row").classList.remove("hide");
//			$tt_description.contentEditable = true;
//			$tt_description.focus();
//			e.preventDefault();
//		}
//	};
//	
//	$tt_description.onkeydown = function(event) {
//		var e = event || window.event || arguments.callee.caller.arguments[0];
//		if (e && e.keyCode == 8 && !$tt_description.innerHTML) {
//			$tt_description.contentEditable = false;
//			document.querySelector(".description_row").classList.add("hide");
//			$tt_hours.contentEditable = true;
//			$tt_hours.focus();
//		}else if (e && e.keyCode == 13) {
////			document.querySelector("#tt_description").setAttribute("contenteditable", "false");
//			e.preventDefault();
//		}
//	};
}