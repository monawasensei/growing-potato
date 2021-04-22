/*
I have to have at least one global registry becasue otherwise there is no way to work from element -> object. it is only possible to go from object -> element.
*/
var ENTRY_REGISTRY = new Array(); //it doesn't have to be ordered but I do have to remove queueEntries as they are played
var REMOVED_LIST = new Array();
var MAIN_CONTAINER = document.getElementById("queue-entry-container");
var QUEUE_CONTAINER = document.getElementById("subQueue-entry-container");
var MOSASA_YT_PLAYER;
var CURRENTLY_PLAYING;
var LOG_LENGTH;
var PROBLEM_DICT = {"xOKY_wL9I_k": "Jinrui wa Suitai Shimashita OST - Fushigi na Jikan"};
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
		//if (distance > 0) {distance -= 1} //to account for the moving indeces of the list when an entry is removed
		var childrenList = parentDiv.children;
		var currentIndex = getListIndex(childrenList,this);
		var nextIndex = currentIndex + distance;
		if (nextIndex < 0) {
			nextIndex = 0
		} else if (nextIndex >= childrenList.length-1) {
			nextIndex = -1
		} //to ensure
		this.removeFromDiv(parentDiv); //I *doubt* anything bad will happen by adding this arg, since for some reason. it was not here before
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
		removeEntryButton.addEventListener("click",this.manualRemoveFromDiv.bind(this));	
	}

	playEntry() {
		super.playEntry(MAIN_CONTAINER);
	}
	
	moveEntry(distance) {
		super.moveEntry(MAIN_CONTAINER,distance);
	}
	
	addToQueue() {
		var newQueueEntry = new queueEntry(this.lineData,this);
	}
	
	removeFromDiv() {
		super.removeFromDiv(MAIN_CONTAINER);
	}
	
	manualRemoveFromDiv() {
		super.removeFromDiv(MAIN_CONTAINER);
		REMOVED_LIST.push(this.lineData.url);
	}
}
/**********************************************************************************************************/

/**********************************************************************************************************/
class queueEntry extends entry {
	constructor(logLineObject, parentMainEntry) {
		super(logLineObject);
		this.parentMainEntry = parentMainEntry;
		this.createEntryDiv(
			"queue-entry",
			"entry-div",
			QUEUE_CONTAINER
		);
		let removeFromQueueButton = this.createEntryButton("remove-queue-entry-btn","entry-btn","Remove");
		removeFromQueueButton.addEventListener("click",this.destroy.bind(this));
		let moveEntryUpButton = this.createEntryButton("move-queue-entry-up-btn","entry-btn","Move Up");
		moveEntryUpButton.addEventListener("click",this.moveEntryUp.bind(this));
		let moveEntryDownButton = this.createEntryButton("move-queue-entry-down-btn","entry-btn","Move Down");
		moveEntryDownButton.addEventListener("click",this.moveEntryDown.bind(this));
		let moveEntryTopButton = this.createEntryButton("move-queue-entry-top-btn","entry-btn","Top");
		moveEntryTopButton.addEventListener("click",this.moveEntryTop.bind(this));
		let moveEntryBottomButton = this.createEntryButton("move-queue-entry-bottom-btn","entry-btn","Bottom");
		moveEntryBottomButton.addEventListener("click",this.moveEntryBottom.bind(this));
	}
	
	//not a big fan of these four methods, but I can't into binding and passing args in an event listener
	moveEntryUp() {
		super.moveEntry(QUEUE_CONTAINER, -1);
	}
	
	moveEntryDown() {
		super.moveEntry(QUEUE_CONTAINER, 1);
	}
	
	moveEntryTop() {
		super.moveEntry(QUEUE_CONTAINER, -1000);
	}
	
	moveEntryBottom() {
		super.moveEntry(QUEUE_CONTAINER, 1000);
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

function autoRemoveFromList() {
	var cookieString;
	cookieString = parseValuePairFromCookie("removedList");
	if (cookieString == "") {
		return 0;
	}
	var tempRemovedList = new Array();
	var entry;
	tempRemovedList = cookieString.split("_");
	for (let entryURL of tempRemovedList) {
		entry = entryObjFromURL(entryURL); //this probably works but I will double check
		try {
			entry.manualRemoveFromDiv();
		} catch(err) {
			console.log("unable to retrieve entry with url" + entryURL);
		}
		
	}
}

function clearQueue() {
	var childrenList = QUEUE_CONTAINER.children;
	var childrenListLength = childrenList.length;
	for (i = 0; i < childrenListLength; i++) {
		entryObjFromElement(childrenList[0]).destroy();
	}
}

function getPlaylistFromCookie() {
	var playlistCookieName = "playlist_" + document.getElementById("saved-queue-number").innerHTML;
	var cookieString = parseValuePairFromCookie(playlistCookieName);
	if (cookieString == "") {
		return 0;
	}
	var tempPlaylistArray = cookieString.split("_");
	var mainEntry;
	clearQueue();
	for (let mainEntryURL of tempPlaylistArray) {
		mainEntry = entryObjFromURL(mainEntryURL);
		mainEntry.addToQueue();
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

function entryObjFromURL(url) { //hopefully the try/catch clauses will allow me to only return a mainEntry
	var returnEntry;
	var entryURL;
	for (let entry of ENTRY_REGISTRY) {
		entryURL = entry.lineData.url;
		if (entryURL == url) {
			if (entry.parentMainEntry != "object") {
				returnEntry = entry;
				break;
			} else {
				returnEntry = entry.parentMainEntry;
				break;
			}
		}
	}
	if (returnEntry == undefined) {
			throw("unable to retrieve entry with url of " + url);
	}
	return returnEntry;
}

function getJSON() {
	var log = document.getElementById("log").innerHTML;
	var JSONArray = new Array();
	var lineObject;
	JSONArray = JSON.parse(log);
	for (let line of JSONArray) {
		lineObject = line;
		let playlistQueueEntry = new mainEntry(lineObject);
	}
}

function getLogLength() {
	LOG_LENGTH = document.getElementById("log_length").innerHTML;
}

function getListIndex(list,item) {
		var count = 0;
		for (let entry of list) {
			if (entry == item.div) {
				return count;
			}
			count++;
		}
}

function saveRemovedListToCookie() {
	if (REMOVED_LIST.length > 0)
	createNewCookie("removedList",REMOVED_LIST.join("_"));
}

function savePlaylistToCookie() {
	if (QUEUE_CONTAINER.children.length == 0) {
		return 0;
	}
	var tempPlaylistArray = new Array();
	var entry;
	var playlistCookieName = "playlist_" + document.getElementById("saved-queue-number").innerHTML;
	for (let div of QUEUE_CONTAINER.children) {
		entry = entryObjFromElement(div);
		tempPlaylistArray.push(entry.parentMainEntry.lineData.url);
	}
	createNewCookie(playlistCookieName,tempPlaylistArray.join("_"));
}

function parseValuePairFromCookie(value) {
	var valueExpression = value + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var valuePairList = decodedCookie.split(";");
	for (let valuePair of valuePairList) {
		if (valuePair.indexOf(valueExpression) != -1) {
			return valuePair.split("=")[1]; //returns the string of the value from the value pair
		}
	}
	return "";
}
	
function createNewCookie(cookieName, cookieValue) {
	var date = new Date();
	var expiry;
	date.setTime(date.getTime() + (30*24*60*60*1000)); //date = 30 days from now
	expiry  = "expires=" + date.toUTCString();
	document.cookie = cookieName + "=" + cookieValue + ";" + expiry + ";path=/"; // creates a cookie with expiry date and path=/, no other info.
}

function changePlaylistVisibility() {
	var visibility = document.getElementById("subQueue-div").style.visibility;
	if (visibility != "hidden") {
		visibility = "hidden";
		document.getElementById("playlist-visibility-btn").innerHTML = "Show Playlist";
	} else {
		visibility = "visible";
		document.getElementById("playlist-visibility-btn").innerHTML = "Hide Playlist";
	}
	document.getElementById("subQueue-div").style.visibility = visibility;
}

function changeSavedQueueNumber(value) { //value is pretty much gonna be -1 or 1
	value = parseInt(value);
	var currentValue = parseInt(document.getElementById("saved-queue-number").innerHTML);
	if ((currentValue + value) < 1 || (currentValue + value) > 5) {
		return 0;
	} else {
		document.getElementById("saved-queue-number").innerHTML = (currentValue + value);
	}
}
/*****************************Debugging and maintenance functions*****************************************************************************/
function cookieVersionSync() {
	var potentialCookieList = ["removedList", "playlist_1", "playlist_2", "playlist_3", "playlist_4", "playlist_5"];
	var currentCookieList = getCurrentCookieList(potentialCookieList);
	findAndRemoveProblemValues(currentCookieList);
}

function findAndRemoveProblemValues(currentCookieList) {
	var errorList = new Array();
	for (let valueString of currentCookieList) {
		for (let URLKey of PROBLEM_DICT) {
			if (valueString.search(URLKey) == -1) {
				errorList.push(PROBLEM_DICT[URLKey]);
			}
		}
	}
	if (errorList.length > 0) {
		alert("The following damaged cookies were found: \n\n" + errorList + "\n\nThese aren't being fixed yet, but they will be soon :^)");
	}
}

function getCurrentCookieList(potentialCookieList) {
	var populatedCookieList = new Array();
	var cookieValues;
	for (let cookieName of potentialCookieList) {
		cookieValues = parseValuePairFromCookie(cookieName);
		if (cookieValues != "") {
			populatedCookieList.push(cookieValues);
		}
	}
	return populatedCookieList;
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
	getJSON();
	autoRemoveFromList();
	window.addEventListener("unload", saveRemovedListToCookie);
	cookieVersionSync();
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
