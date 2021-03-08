//workflow: turn every entry in the log file into a logLine Object
//then use queueEntry objects to pack and unpack these items, so that the playlist never ends :DDDDDDDD

var queueIndex = new Array();
var queueEntryId = 0
var log = new Array();

class queueEntry {
	constructor(logLineObject) {
		this.lineData = logLineObject;
		queueIndex.push(this);
		this.create_entry();
		this.add_log_info(); //wip
	}

	create_entry() {
		this.create_entry_div()
		this.populate_entry_div()
	}

	remove_entry() {
		queueIndex.splice(queueIndex.indexOf(this),1)
	}

	create_entry_div() {
		queueEntryId += 1
		var queueContainer = document.getElementById("queue")
		this.entryDiv = document.createElement("div")
		this.entryDivId = "entry-" + queueEntryId
		this.entryDiv.setAttribute("id",this.entryDivId)
		this.entryDiv.setAttribute("class","entry-div")
		queueContainer.appendChild(this.entryDiv)
	}

	populate_entry_div() {
		this.entryTitle = document.createElement("p")
		this.entryTitle.setAttribute("class","entry-title")
		var entryTitleText = document.createTextNode(this.title) //will have to change this to get the video title instead of the url I guess
		//How to get video title from youtube url??
			//will have to add some youtube webAPI to do that..
		this.entryTitle.appendChild(entryTitleText)
		this.entryDiv.appendChild(this.entryTitle)
	}

	add_log_info() {
		//wip
	}
}

class logLine {
	constructor(logLine) {
		this.line = logLine;
	}
}

function get_log() {
	var log = document.getElementById("log").innerHTML;
	//test print
	document.getElementById("").innerHTML = log;
}


function make_div_test() {
	let testEntryDiv = new queueEntry("https://holedigging.club")
}

function button_test() {
	document.getElementById("queue-test-text").innerHTML = "queueLength is " + get_queue_length();
	make_div_test()
}

function play_queue() {
	play_next_entry()
	//queueIndex.shift();

}

function play_next_entry() {
	var nextEntryObject = queueIndex[0];
	player = document.getElementById("player");
	player.setAttribute("src",nextEntryObject.src);
	//nextEntryObject.remove_entry();
}

function get_queue_length() {
	var queueLength = document.getElementById("log_length").innerHTML;
	return queueLength;
}
//don't know if I need to add an update_queue() function, but I will see

