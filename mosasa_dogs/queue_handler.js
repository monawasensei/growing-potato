//workflow: turn every entry in the log file into a logLine Object
//then use queueEntry objects to pack and unpack these items, so that the playlist never ends :DDDDDDDD

var queueIndex = new Array();
var queueEntryId = 0
//var log = new Array();

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
		this.add_log_buttons()
	}

	remove_entry() { //this doesn't work yet so don't call it
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
		this.entryTitle = document.createElement("a")
		this.entryTitle.setAttribute("class","entry-title")
		this.entryTitle.setAttribute("href","https://www.youtube.com/watch/" + this.lineData.url);
		var entryTitleText = document.createTextNode(this.lineData.title)
		this.entryTitle.appendChild(entryTitleText)
		this.entryDiv.appendChild(this.entryTitle)
	}

	add_log_buttons() {
		this.add_play_button();
		this.add_order_buttons();
	}

	add_play_button() {
		this.playButton = document.createNewElement("button");
		this.playButton.setAttribute("type","button");
		this.playButton.setAttribute("class","queue-entry-btn");
		this.playButton.setAttribute("id", this.entryDivId + "-play-btn");
		//this.play_button.setAttribute("onclick","play_entry(this)"); //this one will be tricky to figure out I think.
		this.playButton.appendChild(document.createTextNode("play"));
		this.entryDiv.appendChild(this.playButton);
	}

	add_order_buttons() {
		this.orderUpButton = document.createNewElement("button");
		this.orderUpButton.setAttribute("type","button");
		this.orderUpButton.setAttribute("class","queue-entry-btn");
		this.orderUpButton.setAttribute("id", this.entryDivId + "-order-up-btn");
		//this.play_button.setAttribute("onclick","move_entry(this,"up")"); //this one will be tricky to figure out I think.
		this.orderUpButton.appendChild(document.createTextNode("Move up"));
		this.entryDiv.appendChild(this.orderUpButton);

		this.orderDownButton = document.createNewElement("button");
		this.orderDownButton.setAttribute("type","button");
		this.orderDownButton.setAttribute("class","queue-entry-btn");
		this.orderDownButton.setAttribute("id", this.entryDivId + "-order-down-btn");
		//this.play_button.setAttribute("onclick","move_entry(this,"down")"); //this one will be tricky to figure out I think.
		this.orderDownButton.appendChild(document.createTextNode("Move down"));
		this.entryDiv.appendChild(this.orderDownButton);
	}

	add_log_info() {
		//wip
	}
}

class logLine {
	constructor(logLine) { //don't need to push to global index since an entry is made right after this object is made.
		this.line = logLine;
		this.get_indeces();
		this.get_title();
		this.get_url();
	}

	get_indeces() {
		this.titleEndPos = this.line.indexOf("https://www.youtube.com/watch")-1;
		this.youtubeSubURLStartPos = this.line.indexOf("https://www.youtube/watch/") + "https://www.youtube/watch/".length;
	}

	get_title() {
		this.title = this.line.slice(0,this.titleEndPos);
	}

	get_url() {
		this.url = this.line.slice(this.titleEndPos+1,this.youtubeSubURLStartPos); //will have to add handling for urls of other types later, probably will be easier to implement on the server side
	}
}

function get_log() {
	var log = document.getElementById("log").innerHTML;
	var _Line_Pos = 0;
	var _Line_EndPos;
	var next_Line_Pos = 0;
	var _Line_String;
	var logEntryText;
	var length = get_queue_length();
	for (index = 0; index <= length; index++) {
		_Line_Pos = log.indexOf("_LINE_",next_Line_Pos);
		_Line_String = "_LINE_" + index;
		_Line_Pos = _Line_Pos + _Line_String.length;
		next_Line_Pos = log.indexOf("_LINE_",_Line_Pos);
		_Line_EndPos = next_Line_Pos - "\n<br>".length;
		logEntryText = log.slice(_Line_Pos,_Line_EndPos);
		let logLineObject = new logLine(logEntryText);
		let playlistQueueEntry = new queueEntry(logLineObject);
	}
}

//function make_div_test() {
//	let testEntryDiv = new queueEntry("https://holedigging.club")
//}

function button_test() {
	document.getElementById("queue-test-text").innerHTML = "queueLength is " + get_queue_length();
	make_div_test()
}

//function play_queue() {
//	play_next_entry()
	//queueIndex.shift();
//}

//function play_next_entry() {
//	var nextEntryObject = queueIndex[0];
//	player = document.getElementById("player");
//	player.setAttribute("src",nextEntryObject.src);
	//nextEntryObject.remove_entry();
//}

function get_queue_length() {
	var queueLength = document.getElementById("log_length").innerHTML;
	return queueLength;
}
//don't know if I need to add an update_queue() function, but I will see

function main() {
	get_log();
}

main()
