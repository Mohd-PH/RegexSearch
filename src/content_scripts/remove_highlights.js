function remove_highlighting(request) {
	if(request.action == "remove-highlights") {
		var previousHighlighters = document.querySelectorAll(".regexSearchHighlighter");
		
		previousHighlighters.forEach( (highlight) => {
		  highlight.style.backgroundColor = "transparent";
		  highlight.style.border = "";
		  highlight.classList.remove("regexSearchHighlighter");
		});
		previousHighlighters = document.querySelectorAll(".regexSearchMatch");
		previousHighlighters.forEach( (highlight) => {
		  highlight.style.backgroundColor = "transparent";
		  highlight.style.border = "";
		  highlight.classList.remove("regexSearchMatch");
		});
    }
    
    browser.runtime.onMessage.removeListener(remove_highlighting);
}

browser.runtime.onMessage.addListener(remove_highlighting);
