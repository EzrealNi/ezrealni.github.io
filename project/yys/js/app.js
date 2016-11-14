function search(matchValue) {
	var searchStr = matchValue || document.querySelector("#searchItem").value,
		cellList = document.querySelectorAll(".content .table > .table-row-group > .table-row > .table-cell");

	resetLightFont();
	removeChildNodesHide(document.querySelector(".content"));
	if(searchStr && searchStr.trim()){
		displayCell(searchStr,cellList);
	}
}

function displayCell(searchStr,cellList){
	for (var i = 0; i < cellList.length; i++) {
		var $currentCell = cellList[i],
			innerHTML = $currentCell.innerHTML;
		if (innerHTML.indexOf(searchStr) > -1) {
			if($currentCell.classList.contains("clue-cell")){
				var matchValue = $currentCell.parentNode.querySelectorAll(".table-cell")[1].innerHTML;
				if(matchValue && matchValue.trim()){
					search(matchValue);
					return;
				}
			}else{
				$currentCell.classList.remove("hide");
				var lightHtml = "<span class='light'>"+searchStr+"</span>";
//				$currentCell.innerHTML = innerHTML.replace(searchStr,lightHtml);
				$currentCell.innerHTML = innerHTML.split(searchStr).join(lightHtml);//replaceAll
			}
		} else{
			$currentCell.classList.add("hide");
		}
	}

	displayChapter();
}

function displayChapter(){
	var tableList = document.querySelectorAll(".content .table");
	for(var t = 0; t < tableList.length; t++){
		var $currentTable = tableList[t],
			groupList = $currentTable.querySelectorAll(".table-row-group");
		
		for(var g = 0; g < groupList.length; g++){
			var $currentGroup = groupList[g],
				rowList = $currentGroup.querySelectorAll(".table-row");
			
			for(var r = 0; r < rowList.length; r++){
				var $currentRow = rowList[r];
				if($currentRow.querySelectorAll(".table-cell:not(.hide)").length === 0){
					$currentRow.classList.add("hide");
				}else{
					$currentRow.classList.remove("hide");
					removeChildNodesHide($currentRow);
				}
			}
			
			if($currentGroup.querySelectorAll(".table-row:not(.hide)").length === 0){
				$currentGroup.classList.add("hide");
			}else{
				$currentGroup.classList.remove("hide");
				var $currentGroupHeader = $currentGroup.querySelector(".table-row.chapter-header");
				if($currentGroupHeader.classList.contains("hide")){
					$currentGroupHeader.classList.remove("hide");
					removeChildNodesHide($currentGroupHeader);
				}else{
					for(var rr = 0; rr < rowList.length; rr++){
						var $currentRow = rowList[rr];
						$currentRow.classList.remove("hide");
						removeChildNodesHide($currentRow);
					}
				}
			}	
		}
		
		if($currentTable.querySelectorAll(".table-row-group:not(.hide)").length === 0){
			$currentTable.classList.add("hide");
		}else{
			$currentTable.classList.remove("hide");
		}
	}
}

function removeChildNodesHide(element){
	var childNodes = element.querySelectorAll(".hide");
	for(var n = 0 ; n < childNodes.length; n++){
		childNodes[n].classList.remove("hide");
	}
}

function resetLightFont(){
	var lights = document.querySelectorAll("span.light");
	for(var l = 0; l < lights.length; l++){
		var $currentLight = lights[l];
		$currentLight.outerHTML = $currentLight.innerHTML;
	}
}
