var mainEntryIndex = new Array();
var queueIndex = new Array(); //REMEMBER YOU RENAMED THIS, YOU WILL HAVE ETO GO THROUGH AND CAREFULLY LOOK AT THE CODE BECAUSE YOU INIIALLY NAMED IT LIKE A COMPLETE RETARD
var queueContainer = document.getElementById("queue");
var subQueueContainer = document.getElementById("subQueue-div");
var mosasaYTPlayer;
/**********************************************************************************************************/

/**********************************************************************************************************/
class entry {
	constructor(logLineObject) { //note that this logLineObject MUST be passed, even if it's not a main Entry!!
		this.lineData = logLineObject;
		this.idNumber = this.lineData.lineId;
	}

	createEntryDiv(divIdPrefix,divClass,divParentNode) {
		this.div = document.createElement("div");
		this.divId/*previously .entryDivId*/ = divIdPrefix + "-" + this.idNumber;
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

	createEntryButton(buttonIdSuffix,buttonClass,onClickAnonymousFunction,nodeText) {
		var button = document.createElement("button");
		button.setAttribute("type","button");
		var buttonId = this.divId + "-" + buttonIdSuffix;
		button.setAttribute("id",buttonId);
		button.setAttribute("class",buttonClass);
		button.addEventListener("click",onClickAnonymousFunction); //I have no idea if I can pass a function as an arg.. probably not
		button.appendChild(document.createTextNode(nodeText));
		this.buttonDiv.appendChild(button);
	}

	addEntryToIndex(indexArray) {
		indexArray.push();
	}

	replacePlayerSRC() {
		mosasaYTPlayer.loadVideoById(this.lineData.url);
	}
}
/**********************************************************************************************************/

/**********************************************************************************************************/
class mainEntry extends entry {
	constructor(logLineObject) {
		super(logLineObject);
		mainEntryIndex.push(this);
		this.createEntryDiv( 			//create main entry div
			"main-entry", 				//id prefix
			"entry-div", 				//class
			queueContainer 				//parent node
		);
		this.createEntryButton( 		//play button
			"play-btn", 						//id suffix
			"entry-btn", 						//class
			function(){playEntry(this.divId)}, 	//onclick=
			"Play" 								//text
		);
		this.createEntryButton( 		//add to queue button
			"add-sub-queue-btn",
			"entry-btn",
			function(){addEntryToSubQueue(this.divId)},
			"Queue"
		);
		this.createEntryButton( 		//remove from main button
			"remove-entry-btn",
			this.removeFromMain,
			"Delete"
		);
		
	}

	shiftInQueue(index) { //rename to shiftInMain //should be functional now
		var previousPos = mainEntryIndex.indexOf(this);
		if (index < previousPos) {previousPos += 1;}
		mainEntryIndex.splice(index,0,this);
		if (index >= mainEntryIndex.length-1) {
			queueContainer.appendChild(this.div);
		}else {
		var beforeDiv = mainEntryIndex[index + 1].div;
		queueContainer.insertBefore(this.div,beforeDiv);
		}
		mainEntryIndex.splice(previousPos,1);
	}

	removeFromMain() {
		mainEntryIndex.splice(mainEntryIndex.indexOf(this),1);
		queueContainer.removeChild(this.div);
	}
}
/**********************************************************************************************************/

/**********************************************************************************************************/
class queueEntry extends entry {
	constructor(logLineObject) {
		super(logLineObject);
		queueIndex.push(this);
		this.createEntryDiv(
			"queue-entry",
			"entry-div",
			subQueueContainer
		);
		this.createEntryButton(
			"remove-queue-entry-btn",
			"entry-btn",
			this.destroy, 		//will this work?
			"Remove"  				
		);
	}

	destroy() {
		queueIndex.splice(queueIndex.indexOf(this),1);
		this.div.remove();
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

/*********************************************************************************************************/
/*************FUNCTIONS***********************************************************************************/
/*********************************************************************************************************/
function encodeSubQueueToURL() {
	var playListArray = new Array();
	for (let entry of queueIndex) {
		playListArray.push(entry.entryDivId);
	}
	var playListURI = encodeURIComponent(playListArray.join("_"));
	location.hash = playListURI;
}

function decodeSubQueueFromURL() {
	var playListURIEncoded = location.hash.slice(1); //gets the hashstring and removes "#" //hopefully
	var playListURI = decodeURIComponent(playListURIEncoded);
	var playListArray = playListURI.split("_"); //don't know if I should declare new Array(); before assigning this oh well.
	for (let entryDivId of playListArray) {
	  addEntryToSubQueue(entryDivId);
	}
	autoPlayNextEntry(); //we'll see how this works out here.
}

function makeRandomSubQueue10() {
	var logLength = getLogLength();
	for (i=1; i<=10; i++) {
	var entryIdNumber = Math.floor(Math.random() * logLength);
	var entryDivId = "entry-" + entryIdNumber; //hopefully this works
	addEntryToSubQueue(entryDivId);
	}
}

function addEntryToSubQueue(entryDivId) {
	var entry = getEntryById(entryDivId);
	let newQueueEntry = new queueEntry(entry.lineData);
}

/*///////////////////////////////////////*/
function removeEntryFromSubQueue(queueEntry) { //going to try passing the object sinnce I can assign this to a button, am retard though
	queueEntry.destroy();
}
/////////////////////////////////////////

function getLogLength() {
	var logLength = document.getElementById("log_length").innerHTML;
	return logLength;
}

function shuffleMain() {
	var mainLength = mainEntryIndex.length;
	for (i = 0; i <= 3; i++) {
		for (index = 0; index < mainLength; index++) {
			var randomPos = Math.floor(Math.random() * mainLength);
			mainEntryIndex[index].shiftInQueue(randomPos);
		}
	}
	autoPlayNextEntry();
}

function moveEntry(entryDivId,direction,number) { //need to add validation so that it checks direction to be either "up" or "down", though this isn't a  big deal
	var moveMod = 0;
	if (direction == "up") {number *= -1;}
	else if (direction == "down") {moveMod = 1;}
	var entry = getEntryById(entryDivId);
	var isEndEntry = isEndEntryById(entryDivId);
	if (isEndEntry == 1 && number < 0) {number = 0;}
	else if (isEndEntry == -1 && number > 0) {number = 0;}
	var queueStartPos = entry.getQueueIndexPos();
	number = moveDistanceInBounds(queueStartPos,number);
	var queueDestinationPos = queueStartPos + number + moveMod;
	entry.shiftInQueue(queueDestinationPos);
}

function moveDistanceInBounds(currentPos,number) {
	//make sure number is less than or equal to the bounds of the queue
	if (currentPos + number < 0) {
		number = -1 * currentPos;
	}else if (currentPos + number > mainEntryIndex.length) {
		number = mainEntryIndex.length - currentPos;
	}
	return number;
}

function autoPlayNextEntry() {
	if (queueIndex.length != 0) {
		playEntry(queueIndex[0].entryDivId);
		removeEntryFromSubQueue(queueIndex[0].entryDivId);
	}
	else {
		playEntry(getEndEntryId("top"));
	}
}

function playEntry(entryDivId) {
	var entry = getEntryById(entryDivId);
	entry.removeFromQueue();
	entry.addToQueue();
	entry.replacePlayerSrc();
}

function isEndEntryById(entryId) {
	var topId;
	topId = getEndEntryId("top");
	var bottomId;
	botomId = getEndEntryId("bottom");

	if (entryId == topId) {
		return 1;
	}
	else if (entryId == bottomId) {
		return -1;
	}
	else {
		return 0;
	}
}

function getEndEntryId(whichEnd) {
	var endIndex;
	var queueEntryNodeList = document.querySelectorAll("#queue div.entry-div");
	switch (whichEnd) {
		case "top":
			endIndex = 0;
			break;
		case "bottom":
			endIndex = queueEntryNodeList.length - 1;
			break;
		default:
			endIndex = 0;
	}

	var endEntry = queueEntryNodeList[endIndex];
	var endEntryId = endEntry.getAttribute("id");
	return endEntryId
}

function getEntryById(id) { //this function is really stupid and it's mega dumb how much the script relies on it.
	for (let entry of mainEntryIndex) {
		if (id == entry.entryDivId) {
			return entry;
		}
		else {
			continue;
		}
	}
	return 0
}

function getLog() {
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

/*****************************YOUTUBE API*****************************************************************************************************/
function loadYoutubeIframeAPIScript() {
	var tag = document.createElement('script');

	tag.src = "https://www.youtube.com/iframe_api";
      	var firstScriptTag = document.getElementsByTagName('script')[0];
      	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
	document.getElementById("queue-test-text").innerHTML = "youtubeAPI ready";
	mosasaYTPlayer = new YT.Player('player', {
		height: '200',
		width: '200',
		videoId: 'FcZOnrL9VKM',
		playerVars: {
			'autoplay': 1,
			'disablekb': 1,
			'origin': 'https://holedigging.club',
			'enablejsapi': 1
			},
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
			}
		});
	document.getElementById("queue-test-text").innerHTML = "mosasaYTPlayer object created";
}

function onPlayerReady(event) {
	document.getElementById("queue-test-text").innerHTML = "onPlayerReady";
	shuffleMain();
	//event.target.playVideo();
}

function onPlayerStateChange(event) {
	document.getElementById("queue-test-text").innerHTML = "onPlayerStateChange";
	if (event.data == YT.PlayerState.ENDED) {
		autoPlayNextEntry();
	}
}

function stopVideo() {
	mosasaYTPlayer.stopVideo();
}
/*****************************YOUTUBE API*****************************************************************************************************/

/*****************************EXECUTION BLOCK AND TEST FUNCTIONS*****************************************************************************/
function main() {
	loadYoutubeIframeAPIScript();
	getLog();
}

function button_test() {
	document.getElementById("queue-test-text").innerHTML = "logLength is " + getLogLength();
	autoPlayNextEntry();
}

main()
