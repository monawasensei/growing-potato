// danmaku or nico video scrolling text mode for cytu.be
// paste into channel settings -> edit -> javascript
// stolen from https://cytu.be/r/25_days_of_autism
// extracted nico nico code from december.js and css
// ripped out all the garbage (what the hell is wrong with these people)
// changed the button to say danmaku (uncultured assholes)

// The interval of time (in ms) to flush messages to the screen
var NICO_NICO_MESSAGE_QUEUE_TIME = getOrDefault(CHANNEL.name + "_NICO_NICO_MESSAGE_QUEUE_TIME", 100);

var NICORIPOFF = getOrDefault(CHANNEL.name + "_NICORIPOFF", false);
var marqueeOffset = 0;
var marqueeheight = 28;
var playerparent = document.getElementsByClassName("embed-responsive-16by9")[0];
var playerwrap = document.getElementById("videowrap");

function getNicoPlayerDimensions() {
	var NICOW = playerparent.offsetWidth;
	return {
		NICOH: playerwrap.offsetHeight * 3 / 4,
		NICOW: NICOW,
		NICOS: NICOW * .2
	};
}

// Patch in enable button here
var controls = document.getElementById("emotelistbtn").parentNode;

nicobtn = $('<button id="nicobtn" class="btn btn-sm ' + (!NICORIPOFF ? 'btn-default' : 'btn-success') + '" title="Chat on video">Danmaku~</button>')
	.appendTo(controls)
	.on("click", function() {
		NICORIPOFF = !NICORIPOFF;
		setOpt(CHANNEL.name + "_NICORIPOFF", NICORIPOFF);
		if (!NICORIPOFF) {
			this.className = "btn btn-sm btn-danger";
			removeNicoText();
		} else {
			this.className = "btn btn-sm btn-success";
		}
	});
socket.on("chatMsg", addNicoNicoMessageDataToQueue);
socket.on("clearchat", removeNicoText);

// Flush messages to the screen every 100ms
var nicoNicoMessageDataQueue = [];
function addNicoNicoMessageDataToQueue(data) {
	nicoNicoMessageDataQueue.push(data);
}

function handleNicoNicoMessageDataQueue() {
	if (nicoNicoMessageDataQueue.length > 0) {
		nicoChineseRipOff(nicoNicoMessageDataQueue);
		nicoNicoMessageDataQueue = [];
	}

	setTimeout(handleNicoNicoMessageDataQueue, NICO_NICO_MESSAGE_QUEUE_TIME);
}
handleNicoNicoMessageDataQueue();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// who the hell is OBTO?
// BEGIN OBTO EDIT

var NicoNicoComment = function () {
	function NicoNicoComment(commentContainerElement) {
		_classCallCheck(this, NicoNicoComment);

		this._commentContainerElement = commentContainerElement;
		this._boundAnimationEndHandler = this._handleAnimationEnd.bind(this);
		this._isActive = false;
		this._activateTimeout = undefined;
		this._animationTimeout = undefined;
		this._lastActive = Date.now();

		this._initDomElement();
	}

	_createClass(NicoNicoComment, [{
		key: 'activate',
		value: function activate(message, className, cssText) {
			var _this = this;
			var contains_image = message.indexOf("<img ") > -1;

			if (!this.domElement) {
				this._initDomElement();
			}

			if (this._activateTimeout) {
				clearTimeout(this._activateTimeout);
				this._activateTimeout = undefined;
			}

			// Trigger next frame to ensure the animation plays again
			this.reset();
			this._activateTimeout = setTimeout(function () {
				_this.domElement.innerHTML = '<span>' + message + '</span>';
				_this.domElement.className = className;
				_this.domElement.style.cssText = cssText;
				_this._isActive = true;

				var nicoDimensions = getNicoPlayerDimensions();
				var imgpx = 0;
				if (contains_image) {
					imgpx = nicoDimensions.NICOW * .55;
				}

				// Manually calculate animation time
				var timeout = (nicoDimensions.NICOW + _this.domElement.firstChild.offsetWidth + imgpx) / nicoDimensions.NICOS * 1000;
				_this._animationTimeout = setTimeout(function() {
					_this.reset();
				}, timeout);
			}, 0);
		}
	}, {
		key: 'reset',
		value: function reset() {
			if (!this._isActive || !this.domElement) {
				return;
			}

			this.domElement.innerHTML = '';
			this.domElement.className = '';
			this.domElement.style.cssText = '';
			this._isActive = false;
			this._lastActive = Date.now();
		}
	}, {
		key: 'cleanup',
		value: function cleanup() {
			this._removeListeners();
			this._commentContainerElement.removeChild(this.domElement);
		}
	}, {
		key: 'isActive',
		value: function isActive() {
			return this._isActive;
		}
	}, {
		key: 'getLastActiveTime',
		value: function getLastActiveTime() {
			if (this._isActive) {
				return Date.now();
			}

			return this._lastActive;
		}
	}, {
		key: '_handleAnimationEnd',
		value: function _handleAnimationEnd() {
			this.reset();
		}
	}, {
		key: '_initDomElement',
		value: function _initDomElement() {
			if (this.domElement) {
				return;
			}

			this._removeListeners();
			this.domElement = document.createElement('div');
			this._commentContainerElement.appendChild(this.domElement);
			this._addListeners();
		}
	}, {
		key: '_addListeners',
		value: function _addListeners() {
			if (!this.domElement) {
				return;
			}

			this.domElement.addEventListener(NicoNicoComment.ANIMATION_END_EVENT, this._boundAnimationEndHandler);
		}
	}, {
		key: '_removeListeners',
		value: function _removeListeners() {
			if (this._animationTimeout) {
				clearTimeout(this._animationTimeout);
				this._animationTimeout = undefined;
			}

			if (!this.domElement) {
				return;
			}

			this.domElement.removeEventListener(NicoNicoComment.ANIMATION_END_EVENT, this._boundAnimationEndHandler);
		}
	}]);

  return NicoNicoComment;
}();

NicoNicoComment.ANIMATION_END_EVENT = function () {
	var element = document.createElement('fakeelement');
	var transitions = {
		"animation": "animationend",
		"OAnimation": "oAnimationEnd",
		"MozAnimation": "animationend",
		"WebkitAnimation": "webkitAnimationEnd"
	};

	for (var t in transitions) {
		if (element.style[t] !== undefined) {
			return transitions[t];
		}
	}
}();

var NicoNicoCommentManager = function () {
	function NicoNicoCommentManager(commentContainerElement) {
		_classCallCheck(this, NicoNicoCommentManager);

		this._commentContainerElement = commentContainerElement;
		this._comments = [];
		for (var i = 0; i < NicoNicoCommentManager.MINIMUM_COMMENTS_ALLOCATED; i++) {
			this._comments.push(new NicoNicoComment(this._commentContainerElement));
		}

		this._cleanupUnusedCommentsTimeout();
	}

	_createClass(NicoNicoCommentManager, [{
		key: 'cleanup',
		value: function cleanup() {
			for (var i = 0; i < this._comments.length; i++) {
				var comment = this._comments[i];
				comment.cleanup();
			}
			this._comments = [];

			if (this._cleanupTimeout) {
				clearTimeout(this._cleanupTimeout);
				this._cleanupTimeout = undefined;
			}
		}
	}, {
		key: 'addComments',
		value: function addComments(messageConfigArr) {
			var messageIndex = 0;
			for (var i = 0; i < this._comments.length && messageIndex < messageConfigArr.length; i++) {
				var comment = this._comments[i];
				if (comment.isActive()) {
					continue;
				}

				var config = messageConfigArr[messageIndex];
				comment.activate(config.message, config.className, config.cssText);
				messageIndex++;
			}

			// Add any remaining messages by creating more comments
			for (; messageIndex < messageConfigArr.length; messageIndex++) {
				var config = messageConfigArr[messageIndex];
				var comment = new NicoNicoComment(this._commentContainerElement);
				comment.activate(config.message, config.className, config.cssText);
				this._comments.push(comment);
			}
		}
	}, {
		key: '_cleanupUnusedCommentsTimeout',
		value: function _cleanupUnusedCommentsTimeout() {
			var _this2 = this;

			this._cleanupUnusedComments();
			this._cleanupTimeout = setTimeout(function () {
				_this2._cleanupUnusedCommentsTimeout();
			}, NicoNicoCommentManager.TARGET_EVICTION_TIME_MS);
		}
	}, {
		key: '_cleanupUnusedComments',
		value: function _cleanupUnusedComments() {
			var currentTime = Date.now();
			for (var i = NicoNicoCommentManager.MINIMUM_COMMENTS_ALLOCATED; i < this._comments.length; i++) {
				var comment = this._comments[i];
				if (currentTime - comment.getLastActiveTime() >= NicoNicoCommentManager.TARGET_EVICTION_TIME_MS) {
					// Mark for deletion
					comment.cleanup();
					this._comments[i] = null;
				}
			}

			this._comments = this._comments.filter(function (a) {
			return !!a;
			});
		}
	}]);

	return NicoNicoCommentManager;
}();
NicoNicoCommentManager.MINIMUM_COMMENTS_ALLOCATED = 50;
NicoNicoCommentManager.TARGET_EVICTION_TIME_MS = 2 * 1000;

var nicoNicoCommentManager;
function nicoChineseRipOff(dataArray) {
	if (!NICORIPOFF) {
		return;
	}

	// Filter out bad messages
	dataArray = dataArray.filter(function(data) {
		if (data.username === "[server]" || data.meta.shadow) {
			return false;
		}

		return true;
	});

	if (dataArray.length <= 0) {
		return;
	}

	if (!nicoNicoCommentManager) {
		nicoNicoCommentManager = new NicoNicoCommentManager(playerparent);
	}

	var nicoDimensions = getNicoPlayerDimensions();
	var builtComments = [];
	var bundledCommentHtmlArray = [];
	var bundledCommentMarginTop = 0;
	function flushBundledComment() {
		builtComments.push({
			message: bundledCommentHtmlArray.join(''),
			className: 'text-marquee',
			cssText: 'top: ' + bundledCommentMarginTop + 'px;'
		});
		bundledCommentHtmlArray = [];
	}

	for (var i = 0; i < dataArray.length; i++) {
		var data = dataArray[i];

		var className = "";
		if (data.meta.addClass === "shout") {
			className += " shout";
		}

		var is_image = data.msg.indexOf("<img ") > -1;
		if (!is_image && bundledCommentHtmlArray.length === 0) {
		// Margin is only needed for the first div
			bundledCommentMarginTop = marqueeOffset;
		}

		if (is_image) {
			// Don't add images to the bundled comment html
			builtComments.push({
				message: data.msg,
				className: 'text-marquee ' + className,
				cssText: 'top: ' + (nicoDimensions.NICOH / 5) + 'px;'
			});
		} else {
			bundledCommentHtmlArray.push(
				'<span class="' + className + '">' +
				data.msg +
				'<br>' +
				'</span>');
		}

		marqueeOffset += marqueeheight;
		if (marqueeOffset > nicoDimensions.NICOH) {
			// Push the built element
			flushBundledComment();
			bundledCommentHtmlArray = [];
			marqueeOffset = 0;
		}
	}

	// Add the remaining bundled comment
	if (bundledCommentHtmlArray.length > 0) {
		flushBundledComment();
	}
	nicoNicoCommentManager.addComments(builtComments);
}

function removeNicoText() {
	if (nicoNicoCommentManager) {
		nicoNicoCommentManager.cleanup();
		nicoNicoCommentManager = undefined;
	}
}

// END OBTO EDIT

$("#videowrap").append('<div id="playercontrols" class="btn-group" />');

var styles = `
#vidchat {
    position:absolute;
    color:white;
    font-size: 14pt;
    text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
    width: 2000px !important;
    top: 0px;
    right: 0px;
}

.text-marquee img {
    opacity:0.7;
}

.text-marquee {
    text-shadow:
	-1px -1px 0 #000,
	1px -1px 0 #000,
	-1px 1px 0 #000,
	1px 1px 0 #000;
    color: #FFFFFF !important;
    font-size: 20px;
    font-weight: bold;
    position: absolute;
    left: 100%;
    white-space: nowrap;
    -webkit-transform: translateX(0%);
        -ms-transform: translateX(0%);
            transform: translateX(0%);
    width: 100%;
    -webkit-animation: 30s forwards linear shift-full-left;
            animation: 30s forwards linear shift-full-left;
}

@-webkit-keyframes shift-full-left {
    100% {
        -webkit-transform: translateX(-600%);
                transform: translateX(-600%);
    }
}

@keyframes shift-full-left {
    100% {
        -webkit-transform: translateX(-600%);
                transform: translateX(-600%);
    }
}
`

var styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = styles
document.head.appendChild(styleSheet)

//IT IS TIME FOR MY OWN SCRIPT - MONAX
class colorAssignButton {
	constructor() {
		this.create_button_and_pack();
		this.create_form()
	}

	create_button_and_pack() {
		this.button = document.createElement("button");
		this.button.setAttribute("type","button");
		this.button.setAttribute("onclick","this.pack_form()"); //this function doesn't exist yet
		this.button.setAttribute("class","btn btn-sm btn-default");
		this.buttonId = "assignUsernamebtn";
		this.button.setAttribute("id",this.buttonId);

		this.buttonText = document.createTextNode("Change color");
		this.button.appendChild(this.buttonText);
		this.location = document.getElementById("leftcontrols");
		this.location.appendChild(this.button);
	}

	create_form() {
		this.form = document.createElement("form");
		this.form.setAttributes("type","submit");
		this.formId = "assignColorfrm";
		this.form.setAttribute("id",this.formId);
	}

	pack_form() {

	}

	pack_forget_form() {

	}

}

function assign_username_color_main() {
	let button = new colorAssignButton();
}
