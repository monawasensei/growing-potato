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
	
	#subQueue-div .entry-btn {
  		border: none;
	}
	</style>
</head>
<body>
	<div id="log" style="display:none">
	<?php
	$logIndexer = 0;
	/*
	$log = fopen("potatofields_playlist_formatted_log.txt","r") or die("could not read log");

	while (!feof($log)) {
		echo "_LINE_" . $logIndexer++ . fgets($log) . "<br>";
	}

	fclose($log);
	echo "<p id=\"log_length\">" . ($logIndexer-=2) . "</p>";
	*/
	
	$conn = new mysqli("monawasensei56192.domaincommysql.com", "tuber", "Test123!@#","potato_database"); 
			if ($conn->connect_error) { 
				die('Could not connect: ' . $conn->connect_error); 
			}
			
		
			$sql = "SELECT title, concat(\'https://www.youtube.com/watch/\',url_id) as \'url\' from potatofields_playlist_log";
			$result = $conn->query($sql);
		
			if ($result->num_rows > 0) {
				while($row = $result->fetch_assoc()) {
					$title = $row["title"];
					$url = $row["url"];
					echo "_LINE_" . $logIndexer++ . $title . "\t" . $url . "<br>";
				}
			}
		
			else {
				echo "\n0 results";
			}
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
