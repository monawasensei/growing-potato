<!DOCTYPE html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Radio</title>
	<link rel="stylesheet" href="../stylesheet.css">
	<script src="queue_handler.js" defer></script> <!-- have no idea if I need an end tag for an external script. Can't hurt I guess -->
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
		<h1 class="contents-title">Future home of the Mosasa Dogs!</h1>

		<div id="player-toplevel" class="contents-video">
			<iframe id="player" src="https://www.youtube.com/embed/FcZOnrL9VKM" frameborder="0" onended="autoplay_next_entry()" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
		</div>

		<div id="queue">
			<p><a href="log_display.php" class="link">Temporary link to the playlist log</a></p>

			<p id="queue-test-text">Queue goes here</p>

			<button type="button" onclick="button_test()" class="btn-primary">desd sgribd :DD</button>
		</div>
	</div>

	<noscript>why don'd u hab jabasgribd durnd on? :DDDDDDDDDDDDDDDD</noscript>
</body>
</html>
