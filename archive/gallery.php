<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="https://holedigging.club/archiveStyle.CSS">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
	<div>
		<?php
			$sqlite = new SQLite3("archive.db")
				or die("Could not connect: " . $sqlite->lastErrorMsg());
			$possibledirectory = array("artbook","colours","edits","pics","fanart","misc","screencaps");
			$directory = $_GET['directory'];
			foreach ($possibledirectory as $potential) {
				if ($directory == "$potential") {
						$isvalid = 1;
				}
			}
			if ($isvalid != 1) {
					echo "very naughty";
					exit;
			}
			$sql = "SELECT image_path, thumbnail_path FROM archive WHERE image_path LIKE '%images/${directory}/%' ORDER BY image_path";
			$result = $sqlite->query($sql);
			if (! $result) {
				echo "0 results returned from query";
			}
			while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
				$imagePath = $row["image_path"];
				$thumbnailPath = $row["thumbnail_path"];
				echo "<a href=\"/archive/${imagePath}\" target=\"_blank\"> <image src=\"/archive/${thumbnailPath}\"></a>" . "<br>";
			}
			$sqlite->close();
		?>
	</div>
</body>
</html>
