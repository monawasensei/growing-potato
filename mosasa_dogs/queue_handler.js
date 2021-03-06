var queueIndex = new Array();

class queueEntry {
	constructor(src) {
		this.src = src;
		this.create_entry_element()
	}
	create_entry_element() {
		var queueContainer = document.getElementById("queue")
		this.entryDiv = document.createElement("div")
		//need to assign a class or id to the div here but I think it's fine to ignore for now.
		queueContainer.appendChild(this.entryDiv)

		this.entryTitle = document.createElement("p")
		this.entryTitle.setAttribute("class","entry-title")
		var entryTitleText = document.createTextNode(this.src) //will have to change this to get the video title instead of the url I guess
		this.entryTitle.appendChild(entryTitleText)

		this.entryDiv.appendChild(this.entryTitle)
	}
}


function make_div_test() {
	let testEntryDiv = new queueEntry("https://holedigging.club")
}

function button_test() {
	document.getElementById("queue-test-text").innerHTML = "desting jabasgribd :DDDDDDDDDDD"
	make_div_test()
}


