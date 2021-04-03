<!DOCTYPE html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Radio</title>
	<link rel="stylesheet" href="../stylesheet.css">
	<script id="queue-handler" src="queue_handler.js" defer></script> <!-- have no idea if I need an end tag for an external script. Can't hurt I guess -->
	<style>
	#subQueue-div {
	  position: absolute;
	  display: inline;
	  max-width: 300px;
	  top: 126px;
	  right: 300px;
	}

	#queue-control-div {
	  padding-bottom: 15px;
	}

	#queue-control-div button {
	  display: inline;
	}
	
	#subQueue-control-div {
	margin: auto;
	padding-bottom: 80px;
	}

	#subQueue-control-div .btn-primary {
		float: left;
		margin: 2px;
	}
	
	#subQueue-div .entry-btn {
  		border: none;
	}
	
	#currently-playing-title {
	height: 50px;
	max-height: 50px;
	overflow: hidden;
	}
	</style>
</head>
<body>
	<div id="log" style="display:none">
	<?php

	$logIndexer = 0;
	$log = fopen("potatofields_playlist_formatted_log.txt","r") or die("could not read log");

	while (!feof($log)) {
		echo "_LINE_" . $logIndexer++ . fgets($log) . "<br>";
	}

	fclose($log);
	echo "<p id=\"log_length\">" . ($logIndexer-=2) . "</p>";
	?>

	</div>

	<div class="contents-box">
		<h1 class="contents-title">Currently playing:</h1>
		<h2 id="currently-playing-title" class="contents-title">N/A</h2>

		<div id="player-toplevel" class="contents-video">
			<div id="player">
			</div>
		</div>

		<div id="queue">
			<p><a href="log_display.php" class="link">Temporary link to the playlist log</a></p>

			<div id="queue-control-div">
				<button type="button" onclick="autoPlayNextEntry()" class="btn-primary">Play Next</button>
				<button type="button" onclick="shuffleMain()" class="btn-primary">Shuffle</button>
				<button type="button" onclick="changePlaylistVisibility()" class="btn-primary">Show Playlist</button>
			</div>
			<div id="queue-entry-container"> <!--Actual entry items go here-->
			</div>
		</div>
	</div>

	<div class="contents-box-secondary" id="subQueue-div" style="visibility: hidden">
		<h2 class="contents-title">Playlist Queue</h2>
		<div id="subQueue-control-div">
			<button type="button" onclick="savePlaylistToCookie()" class="btn-primary">Save</button>
			<button type="button" onclick="getPlaylistFromCookie()" class="btn-primary">Load</button>
			<!--
			<p id="saved-queue-number">1</p>
			<div id="saved-queue-number-select-div" style="visibilty: hidden">
				<button type="button" class="btn-primary">+</button>
				<button type="button" class="btn-primary">-</button>
			</div>
			-->
		</div>
		<div id="subQueue-entry-container">
		</div>
	</div>

	<noscript>sdob usingg mothra and durn on ur jabasgridb :DDDDDDDD</noscript>
</body>
</html>
