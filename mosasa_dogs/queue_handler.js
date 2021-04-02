/*
I have to have at least one global registry becasue otherwise there is no way to work from element -> object. it is only possible to go from object -> element.
*/
var ENTRY_REGISTRY = new Array(); //it doesn't have to be ordered but I do have to remove queueEntries as they are played
var REMOVED_LIST = new Array();
var MAIN_CONTAINER = document.getElementById("queue-entry-container");
var QUEUE_CONTAINER = document.getElementById("subQueue-entry-container");
var MOSASA_YT_PLAYER;
var CURRENTLY_PLAYING;
/**********************************************************************************************************/

/**********************************************************************************************************/
class entry {
	constructor(logLineObject) { //note that this logLineObject MUST be passed, even if it's not a main Entry!!
		this.lineData = logLineObject;
		this.idNumber = this.lineData.lineId;
	}

	createEntryDiv(divIdPrefix,divClass,divParentNode) {
		ENTRY_REGISTRY.push(this);
		this.div = document.createElement("div");
		this.divId = divIdPrefix + "-" + this.idNumber; //previously .entryDivId
		this.div.setAttribute("id",this.divId);
		this.div.setAttribute("class",divClass);
		divParentNode.appendChild(this.div);
		this.entryTitle = document.createElement("a");
		this.entryTitle.setAttribute("class","entry-title");
		this.entryTitle.setAttribute("href","https://www.youtube.com/watch/" + this.lineData.url);
		this.entryTitle.setAttribute("target","_blank");
		this.entryTitle.appendChild(document.createTextNode(this.lineData.title));
		this.div.appendChild(this.entryTitle);
		this.buttonDiv = document.createElement("div");
		this.buttonDiv.setAttribute("id",this.divId + "-btn-div");
		this.buttonDiv.setAttribute("class","entry-btn-div");
		this.div.appendChild(this.buttonDiv);
	}

	createEntryButton(buttonIdSuffix,buttonClass,nodeText) {
		var button = document.createElement("button");
		button.setAttribute("type","button");
		var buttonId = this.divId + "-" + buttonIdSuffix;
		button.setAttribute("id",buttonId);
		button.setAttribute("class",buttonClass);
		button.appendChild(document.createTextNode(nodeText));
		this.buttonDiv.appendChild(button);
		return button;
	}

	replacePlayerSrc() {
		MOSASA_YT_PLAYER.loadVideoById(this.lineData.url);
	}
	
	removeFromDiv(parentDiv) {
		parentDiv.removeChild(this.div);
	}
	
	addToDiv(parentDiv,index) { //I think I'll be able to use this to move entries so I will plan on that
		if (index == 0) { //add to the top
			var currentFirstEntry = parentDiv.firstElementChild;
			parentDiv.insertBefore(this.div,currentFirstEntry);
		} else if (index == -1) { //add to the bottom
			parentDiv.appendChild(this.div);
		} else { //add to a certain location in the list
			var childrenList = parentDiv.children;
			parentDiv.insertBefore(this.div,childrenList[index]);
		}
	}
	
	playEntry(parentDiv) {
		this.removeFromDiv(parentDiv);
		this.addToDiv(parentDiv,-1);
		this.replacePlayerSrc();
		CURRENTLY_PLAYING = this;
		updateCurrentlyPlayingDisplay();
	}
	
	moveEntry(parentDiv,distance) { //negative distance moves up
		if (distance > 0) {distance -= 1} //to account for the moving indeces of the list when an entry is removed
		var childrenList = parentDiv.children;
		var currentIndex = getListIndex(childrenList,this);
		var nextIndex = currentIndex + distance;
		if (nextIndex < 0) {
			nextIndex = 0
		} else if (nextIndex >= childrenList.length-1) {
			nextIndex = -1
		} //to ensure
		this.removeFromDiv();
		this.addToDiv(parentDiv,nextIndex);
	}
	
}
/**********************************************************************************************************/

/**********************************************************************************************************/
class mainEntry extends entry {
	constructor(logLineObject) {
		super(logLineObject);
		this.createEntryDiv( 			//create main entry div
			"main-entry", 				//id prefix
			"entry-div", 				//class
			MAIN_CONTAINER 				//parent node
		);
		let playButton = this.createEntryButton("play-btn","entry-btn","Play");
		playButton.addEventListener("click",this.playEntry.bind(this));
		let addToQueueButton = this.createEntryButton("add-sub-queue-btn","entry-btn","Queue");
		addToQueueButton.addEventListener("click",this.addToQueue.bind(this));
		let removeEntryButton = this.createEntryButton("remove-entry-btn","entry-btn","Delete");
		removeEntryButton.addEventListener("click",this.removeFromDiv.bind(this));	
	}

	playEntry() {
		super.playEntry(MAIN_CONTAINER);
	}
	
	moveEntry(distance) {
		super.moveEntry(MAIN_CONTAINER,distance);
	}
	
	addToQueue() {
		var newQueueEntry = new queueEntry(this.lineData);
	}
	
	removeFromDiv() {
		super.removeFromDiv(MAIN_CONTAINER);
		REMOVED_LIST.push(this.divId);
	}
}
/**********************************************************************************************************/

/**********************************************************************************************************/
class queueEntry extends entry {
	constructor(logLineObject) {
		super(logLineObject);
		this.createEntryDiv(
			"queue-entry",
			"entry-div",
			QUEUE_CONTAINER
		);
		let removeFromQueueButton = this.createEntryButton("remove-queue-entry-btn","entry-btn","Remove" );
		removeFromQueueButton.addEventListener("click",this.destroy.bind(this));
	}
	
	playEntry() {
		super.playEntry(QUEUE_CONTAINER);
		this.destroy();
	}

	destroy() {
		ENTRY_REGISTRY.splice(ENTRY_REGISTRY.indexOf(this),1);
		this.div.remove(); //this may cause issues but idk
	}
	
	moveEntry(distance) {
		super.moveEntry(QUEUE_CONTAINER,distance);
	}
}
/**********************************************************************************************************/

/*************CLASS LOGLINE********************************************************************************/
class logLine {
	constructor(logLine,lineId) {
		this.line = logLine;
		this.getIndeces();
		this.getTitle();
		this.getURL();
		this.lineId = lineId;
	}

	getIndeces() {
		this.titleEndPos = this.line.indexOf("\t")-1; //may have to look into changing this from \t to a better delimiter - Mar 20 2021 monax
		this.youtubeSubURLStartPos = this.line.indexOf("\t") + "\t".length;
		//this.youtubeSubURLEndPos = this.line.indexOf("\n<br>",this.youtubeSubURLStartPos); //consider also, making a better endline delimiter too, instead of a potentially ubiquitous "/n<br>" - Mar 20 2021 monax
	}

	getTitle() {
		this.title = this.line.slice(0,this.titleEndPos+1);
	}

	getURL() {
		this.url = this.line.slice(this.youtubeSubURLStartPos); //will have to add handling for urls of other types later, probably will be easier to implement on the server side
	}
}
/*************CLASS LOGLINE********************************************************************************/

//FUNCTIONS
function autoPlayNextEntry() {
	var lengthOfQueue = QUEUE_CONTAINER.childElementCount;
	if (lengthOfQueue > 0) { //if there is something currently queued
		var currentFirstEntryDiv = QUEUE_CONTAINER.firstElementChild
	} else { //plays next main entry if there is nothing in the queue
		var currentFirstEntryDiv = MAIN_CONTAINER.firstElementChild;
	}
	var entry = entryObjFromElement(currentFirstEntryDiv);
	entry.playEntry();
}

function shuffleMain() {
	var lengthOfList = MAIN_CONTAINER.children.length;
	for (i=0; i<=3; i++) {
		for (let div of MAIN_CONTAINER.children) { //hopefully I can loop over a collection like this
			var entry = entryObjFromElement(div);
			var randomPos = Math.floor(Math.random() * lengthOfList); //this will result in a lot of things being appended or added to the beginning FYI, because this is technically an index and not a distance
			entry.moveEntry(randomPos);
		}
	}
}

function autoRemoveFromList() { //for each entry in REMOVED_LIST, remove that entry //to be called after log is getted
	createNewCookie(); //pretty sure this is fine since it's just making an expire= and path= value pair
	var cookieString = parseValuePairFromCookie("removedList");
	if (cookieString == 0) {
		REMOVED_LIST = []; //initialize the array
		return 0; //there is nothing to remove if this is true
	}	
	REMOVED_LIST = cookieString.split("_"); //
	for (let entryId of REMOVED_LIST) {
		let entry = entryObjFromElementId(entryId); //this probably works but I will double check
		entry.removeFromDiv();
	}
}

function updateCurrentlyPlayingDisplay() {
	document.getElementById("currently-playing-title").innerHTML = CURRENTLY_PLAYING.lineData.title;
}
/***************************************ABSTRACT FUNCTIONS****************************************************************************************************/
function entryObjFromElement(entryElement) { //we are right back to listfaggotry but it's at least a little less retarded than last time.
	for (let entry of ENTRY_REGISTRY) {
		var entryId = entry.divId; //var entryId = entry.div.getAttribute("id"); //this will only not work if the objects are not stored in ENTRY_REGISTRY
		var entryElementId = entryElement.getAttribute("id");
		if (entryId == entryElementId) {
			return entry;
		}
	}
}

function entryObjFromElementId(entryElementId) { //basically the same as the above function but with one step removed
	for (let entry of ENTRY_REGISTRY) {
		var entryId = entry.divId;
		if (entryId == entryElementId) {
			return entry;
		}
	}
}

function getLog() { //parses each line of the invisible log div and makes a mainEntry object for each one
	var log = document.getElementById("log").innerHTML;
	var _Line_Pos = 0;
	var _Line_EndPos;
	var next_Line_Pos = 0;
	var _Line_String;
	var logEntryText;
	var length = getLogLength();
	for (index = 0; index <= length; index++) {
		_Line_Pos = log.indexOf("_LINE_",next_Line_Pos);
		_Line_String = "_LINE_" + index;
		_Line_Pos = _Line_Pos + _Line_String.length;
		next_Line_Pos = log.indexOf("_LINE_",_Line_Pos);
		_Line_EndPos = next_Line_Pos - "\n<br>".length;
		logEntryText = log.slice(_Line_Pos,_Line_EndPos);
		let logLineObject = new logLine(logEntryText,index);
		let playlistQueueEntry = new mainEntry(logLineObject);
	}
}

function getLogLength() {
	var logLength = document.getElementById("log_length").innerHTML;
	return logLength;
}

function getListIndex(list,item) {
		var count = 0;
		for (let entry of list) {
			if (entry === item) {
				return count;
			}
			count++;
		}
}

function saveRemovedListToCookie() {
	if (REMOVED_LIST.length > 0)
	document.cookie = "removedList=" + REMOVED_LIST.join("_");
}

function parseValuePairFromCookie(value) {
	var valueExpression = value + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var valuePairList = decodedCookie.split("=");
	for (let valuePair of valuePairList) {
		if (valuePair.indexOf(valueExpression) != -1) {
			return valuePair.split("=")[1]; //returns the string of all removed entries
		}
	}
	return "";
}
	
function createNewCookie() {
	var date = new Date();
	var expiry;
	date.setTime(d.getTime() + (30*24*60*60*1000)); //date = 30 days from now
	expiry  = "expires=" + date.toUTCString();
	document.cookie = expires + ";path=/"; // creates a cookie with expiry date and path=/, no other info.
}
	
/*****************************YOUTUBE API*****************************************************************************************************/
function loadYoutubeIframeAPIScript() {
	var tag = document.createElement('script');

	tag.src = "https://www.youtube.com/iframe_api";
      	var firstScriptTag = document.getElementsByTagName('script')[0];
      	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
	MOSASA_YT_PLAYER = new YT.Player('player', {
		height: '200',
		width: '200',
		videoId: 'FcZOnrL9VKM',
		playerVars: {
			'autoplay': 1,
			'disablekb': 0,
			'origin': 'https://cool.holedigging.club',
			'enablejsapi': 1
			},
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
			}
		});
}

function onPlayerReady(event) {
	getLog();
	//event.target.playVideo();
}

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.ENDED) {
		autoPlayNextEntry();
	}
}

function stopVideo() {
	MOSASA_YT_PLAYER.stopVideo();
}
/*****************************YOUTUBE API*****************************************************************************************************/

function main() {
	loadYoutubeIframeAPIScript();
}

main()
