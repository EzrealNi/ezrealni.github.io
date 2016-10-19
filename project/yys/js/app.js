function search() {
	var searchStr = document.querySelector("#search").value,
		$contentPList = document.querySelectorAll(".content p");

	for (var i = 0; i < $contentPList.length; i++) {
		var $currentP = $contentPList[i];
		if ($currentP.innerHTML.indexOf(searchStr) === -1) {
			$currentP.classList.remove("show");
			$currentP.classList.add("hide");
		} else {
			$currentP.classList.remove("hide");
			$currentP.classList.add("show")
		}
	}

	var $chapterList = document.querySelectorAll(".content .chapter");
	for (var j = 0; j < $chapterList.length; j++) {
		var $currentChapter = $chapterList[j];

		if ($currentChapter.querySelectorAll("p.show").length === 0) {
			$currentChapter.classList.add("hide");
		} else {
			$currentChapter.classList.remove("hide");
		}
	}

}