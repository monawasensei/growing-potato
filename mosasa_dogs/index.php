<!DOCTYPE html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Radio</title>
	<link rel="stylesheet" href="../stylesheet.css">
	<script id="queue-handler" src="queue_handler.js" defer></script> <!-- have no idea if I need an end tag for an external script. Can't hurt I guess -->
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
		<h1 class="contents-title">The Mosasa Dogs Present: Potatofields Radio!</h1>

		<div id="player-toplevel" class="contents-video">
			<div id="player">
			</div>
		</div>

		<div id="queue">
			<p><a href="log_display.php" class="link">Temporary link to the playlist log</a></p>

			<p id="queue-test-text" style="display:none">Queue goes here</p>

			<div id="queue-control-div">
				<button type="button" onclick="autoplay_next_entry()" class="btn-primary">Play Next</button>
				<button type="button" onclick="shuffle_queue()" class="btn-primary">Shuffle</button> 
			</div>
		</div>
	</div>

	<div class="contents-box-secondary" id="subQueue-div">
		<h2 class="contents-title">Playlist Queue</h2>
	</div>

	<noscript>why don'd u hab jabasgribd durnd on? :DDDDDDDDDDDDDDDD</noscript>
</body>
</html>
