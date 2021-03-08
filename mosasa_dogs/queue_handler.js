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

	replace_player_src() {
		embeddedURL = "https://www.youtube.com/embed/" + this.lineData.url;
		document.getElementById("player").setAttribute("src",embeddedURL);
	}

	remove_from_queue() {
		pos = this.get_queueIndex_pos();
		queueIndex.splice(pos,1);
		queueContainer.removeChild(this.entryDiv);
	}

	add_to_queue() {
		queueIndex.push(this);
		queueContainer.appendChild(this.entryDiv);
	}

	get_queueIndex_pos() {
		return queueIndex.indexOf(this);
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
		this.entryTitle.setAttribute("target","_blank");
		var entryTitleText = document.createTextNode(this.lineData.title)
		this.entryTitle.appendChild(entryTitleText)
		this.entryDiv.appendChild(this.entryTitle)
	}

	add_log_buttons() {
		this.buttonDiv = document.createElement("div");
		this.buttonDiv.setAttribute("class","entry-btn-div");
		this.buttonDiv.setAttribute("id",this.entryDivId + "btn-div");
		this.entryDiv.appendChild(this.buttonDiv);
		this.add_play_button();
		this.add_order_buttons();
	}

	add_play_button() {
		this.playButton = document.createElement("button");
		this.playButton.setAttribute("type","button");
		this.playButton.setAttribute("class","entry-btn");
		this.playButton.setAttribute("id", this.entryDivId + "-play-btn");
		this.play_button.setAttribute("onclick","play_entry(" + this.entryDivId + ")"); //this one will be tricky to figure out I think.
		this.playButton.appendChild(document.createTextNode("play"));
		this.buttonDiv.appendChild(this.playButton);
	}

	add_order_buttons() {
		this.orderUpButton = document.createElement("button");
		this.orderUpButton.setAttribute("type","button");
		this.orderUpButton.setAttribute("class","entry-btn");
		this.orderUpButton.setAttribute("id", this.entryDivId + "-order-up-btn");
		//this.play_button.setAttribute("onclick","move_entry(this,"up")"); //this one will be tricky to figure out I think.
		this.orderUpButton.appendChild(document.createTextNode("Move up"));
		this.buttonDiv.appendChild(this.orderUpButton);

		this.orderDownButton = document.createElement("button");
		this.orderDownButton.setAttribute("type","button");
		this.orderDownButton.setAttribute("class","entry-btn");
		this.orderDownButton.setAttribute("id", this.entryDivId + "-order-down-btn");
		//this.play_button.setAttribute("onclick","move_entry(this,"down")"); //this one will be tricky to figure out I think.
		this.orderDownButton.appendChild(document.createTextNode("Move down"));
		this.buttonDiv.appendChild(this.orderDownButton);
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
		this.titleEndPos = this.line.indexOf("\thttps://www.youtube.com/watch")-1;
		this.youtubeSubURLStartPos = this.line.indexOf("https://www.youtube.com/watch/") + "https://www.youtube.com/watch/".length;
		this.youtubeSubURLEndPos = this.line.indexOf("\n<br>",this.youtubeSubURLStartPos);
	}

	get_title() {
		this.title = this.line.slice(0,this.titleEndPos+1);
	}

	get_url() {
		this.url = this.line.slice(this.youtubeSubURLStartPos); //will have to add handling for urls of other types later, probably will be easier to implement on the server side
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


function button_test() {
	document.getElementById("queue-test-text").innerHTML = "queueLength is " + get_queue_length();
}

function get_queue_length() {
	var queueLength = document.getElementById("log_length").innerHTML;
	return queueLength;
}

function play_entry(entryDivId) {
	entry = get_entry_by_id(entryDivId); //find entry based on tag id
	entry.remove_from_queue(); //doesn't exist yet
	entry.add_to_queue(); //doesn't exist yet
	entry.replace_player_src();
}

function get_entry_by_id(id) {
	var done = 0;
	for (let entry of queueIndex) {
		if (id == entry.entryDivId) {
			let foundEntry = entry;
			done = 1;
			break;
		}
		else {
			continue;
		}
	}

	if (done != 1) {return 0};
	return foundEntry;
}

function main() {
	get_log();
}

main()
