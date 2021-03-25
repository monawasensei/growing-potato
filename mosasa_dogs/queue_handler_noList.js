/*
I have to have at least one global registry becasue otherwise there is no way to work from element -> object. it is only possible to go from object -> element.
*/
var entryRegistry = new Array(); //it doesn't have to be ordered but I do have to remove queueEntries as they are played
var mainContainer = document.getElementById("queue-entry-container");
var queueContainer = document.getElementById("subQueue-entry-container");
var mosasaYTPlayer;
var currentlyPlaying;
/**********************************************************************************************************/

/**********************************************************************************************************/
class entry {
	constructor(logLineObject) { //note that this logLineObject MUST be passed, even if it's not a main Entry!!
		this.lineData = logLineObject;
		this.idNumber = this.lineData.lineId;
	}

	createEntryDiv(divIdPrefix,divClass,divParentNode) {
		this.div = document.createElement("div");
		entryRegistry.push(this);
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
		//button.addEventListener("click",onClickAnonymousFunction); //I have no idea if I can pass a function as an arg.. probably not
		button.appendChild(document.createTextNode(nodeText));
		this.buttonDiv.appendChild(button);
		return button;
	}

	replacePlayerSrc() {
		mosasaYTPlayer.loadVideoById(this.lineData.url);
	}
	
	removeFromDiv(parentDiv) {
		parentDiv.removeChild(this.div);
	}
	
	addToDiv(parentDiv,index) { //I think I'll be able to use this to move entries so I will plan on that
		if (index == 0) { //add to the top
			var currentFirstEntry = parentDiv.firstChild;
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
		currentlyPlaying = this;
		updateCurrentlyPlayingDisplay();
	}
	
	moveEntry(parentDiv,distance) { //negative distance moves up
		if (distance > 0) {distance -= 1} //to account for the moving indeces of the list when an entry is removed
		var childrenList = parentDiv.children;
		var currentIndex = getListIndex(childrenList,this); //I really hope this works
		var nextIndex = currentIndex + distance;
		if (nextIndex < 0) {nextIndex = 0} 
		else if (nextIndex >= childrenList.length-1) {nextIndex = -1} //to ensure
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
			mainContainer 				//parent node
		);
		let playButton = this.createEntryButton("play-btn","entry-btn","Play");
		playButton.addEventListener("click",this.playEntry());
		let addToQueueButton = this.createEntryButton("add-sub-queue-btn","entry-btn","Queue");
		addToQueueButton.addEventListener("click",this.addToQueue());
		let removeEntryButton = this.createEntryButton("remove-entry-btn","entry-btn","Delete");
		removeEntryButton.addEventListener("click",this.removeFromDiv());
		
		
	}

	playEntry() {
		super.playEntry(mainContainer);
	}
	
	moveEntry(distance) {
		super.moveEntry(mainContainer,distance);
	}
	
	addToQueue() {
		newQueueEntry = new queueEntry(this.lineData);
	}
	
	removeFromDiv() {
		super.removeFromDiv(mainContainer);	
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
			queueContainer
		);
		let removeFromQueueButton = this.createEntryButton("remove-queue-entry-btn","entry-btn","Remove" );
		removeFromQueueButton.addEventListener("click",this.destroy());
	}
	
	playEntry() {
		super.playEntry(queueContainer);
		this.destroy();
	}

	destroy() {
		entryRegistry.splice(entryRegistry.indexOf(this),1);
		this.div.remove(); //this may cause issues but idk
	}
	
	moveEntry(distance) {
		super.moveEntry(queueContainer,distance);
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
/*required methodology
	methodology encompasses any actions that need to be or can be methods
	these are determined mostly by whether or not the are done or performed on a single object
	rather than a group of objects simultaneously. hopefully, most actions can fit in this section.
	the more methods the easier, as far as I anticipate at least.

****replacePlayerSrc()
****remove()
****moveEntry()
*/

/*required functionality
	any action or functionality which works on multiple objects simultaneously or queue divs as a whole
	shuffle(), getEndEntry(), and autoPlayNextEntry() are examples of this. The goal of these functions
	is not to actually do anything themselves but rather to call the correct method for a given circumstance
	the correct number of times.

getEndEntry() {} //don't think I actually need this
****playEntry()
****autoplayNextEntry()
****shuffle()
add/removeEntryQueue() //handled in methodology
**entryObjFromElement()
*/

//FUNCTIONS
function autoPlayNextEntry() {
	var lengthOfQueue = queueContainer.childElementCount;
	if (lengthOfQueue > 0) { //if there is something currently queued
		var currentFirstEntryDiv = queueContainer.firstChild
	} else { //plays next main entry if there is nothing in the queue
		var currentFirstEntryDiv = mainContainer.firstChild;
	}
	var entry = entryObjFromElement(currentFirstEntryDiv);
	entry.playEntry();
}

function shuffleMain() {
	var lengthOfList = mainContainer.children.length;
	for (i=0; i<=3; i++) {
		for (let div of mainContainer.children) { //hopefully I can loop over a collection like this
			var entry = entryObjFromElement(div);
			var randomPos = Math.floor(Math.random() * lengthOfList); //this will result in a lot of things being appended or added to the beginning FYI, because this is technically an index and not a distance
			entry.moveEntry(randomPos);
		}
	}
}

function updateCurrentlyPlayingDisplay() {
	document.getElementById("currently-playing-title").innerHTML = currentlyPlaying.lineData.title;
}
/***************************************ABSTRACT FUNCTIONS****************************************************************************************************/
function entryObjFromElement(entryElement) { //we are right back to listfaggotry but it's at least a little less retarded than last time.
	for (let entry of entryRegistry) {
		if (entry.div === entryElement) { //hopefully this will be an accurate check and won't cuck me on some logic I don't understand
			return entry;
		}
	}
	//throw new ArithmeticException("in the function entryObjFromElement(), no JS object was found which matched the specified element"); //throws error if no matching entry is found, this should never happen
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
	
/*****************************YOUTUBE API*****************************************************************************************************/
function loadYoutubeIframeAPIScript() {
	var tag = document.createElement('script');

	tag.src = "https://www.youtube.com/iframe_api";
      	var firstScriptTag = document.getElementsByTagName('script')[0];
      	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
	mosasaYTPlayer = new YT.Player('player', {
		height: '200',
		width: '200',
		videoId: 'FcZOnrL9VKM',
		playerVars: {
			'autoplay': 1,
			'disablekb': 0,
			'origin': 'https://holedigging.club',
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
	shuffleMain();
	//event.target.playVideo();
}

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.ENDED) {
		autoPlayNextEntry();
	}
}

function stopVideo() {
	mosasaYTPlayer.stopVideo();
}
/*****************************YOUTUBE API*****************************************************************************************************/

function main() {
	loadYoutubeIframeAPIScript();
}

main()
