<!DOCTYPE html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Radio</title>
	<link rel="stylesheet" href="stylesheet.css">
	<style>
		#log {
			display:block;
			max-height: 15%;
			max-width: 40%;
			overflow: auto;
			background-color: white;
			outline-width: 3px;
			outline-style: solid;
		}
</head>
<body>
<div id="log">
<p>Temporary playlist log from potatofields.<br> </p>
<?php
$logIndexer = 0;
$log = fopen("potatofields_playlist_log.txt","r") or die("could not read log");
while (!feof($log)) {
	echo $logIndexer++ . " " . fgets($log) . "<br>";
}
fclose($log);
?>
</div>
	<h1>
	Future home of the Mosasa Dogs!
	</h1>
	<div id="player-toplevel" class="player-div">
		<iframe id="player" width="560" height="315" src="https://www.youtube.com/embed/FcZOnrL9VKM" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
		<div id="queue" class="player-div">
			<p id="queue-test-text">
			How do I get this thing to stay in the middle?
			</p>
			<button type="button" onclick="button_test()">desd sgribd :DD</button>
		</div>
	</div>
<script src="queue_handler.js"></script> <!-- have no idea if I need an end tag for an external script. Can't hurt I guess -->
<noscript>why don'd u hab jabasgribd durnd on? :DDDDDDDDDDDDDDDD</noscript>
<a href="potatofields_playlist_log.txt">Temporary link to the playlist log</a>
</body>
</html>
