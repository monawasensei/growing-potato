<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="https://holedigging.club/archiveStyle.CSS">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
	<div>
		<?php
			$sqlite = new SQLite3("gallery.db")
				or die("Could not connect: " . $sqlite->lastErrorMsg());
			// $conn = pg_connect("host=localhost dbname=holediggingsql user={$getenv("GALLERY_USER")} password={$getenv("GALLERY_PASSWORD")}")
			// 	or die("Could not connect: " . pg_last_error() );
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
			$sql = "SELECT * FROM archive";
			$result = $sqlite->query($sql);
			while ($row = $result->fetchArray()) {
				var_dump($row);
			}
			// if (! $result) {
			// 	echo "An error occurred.\n" . $sqlite->lastErrorMsg();
			// 	exit;
			// }
			// $rows = pg_fetch_all($result);
			// if (empty($rows)) {
			// 	echo "0 results.\n";
			// 	exit;
			// }
			// foreach ($rows as $row) {
			// 	$imageRelPath = $row["image_rel_path"];
			// 	$thumbnailRelPath = $row["thumbnail_rel_path"];
			// 	echo "<a href=\"${imageRelPath}\" target=\"_blank\"> <image src=\"${thumbnailRelPath}\"></a>" . "<br>";
			// }
			$sqlite->close();
		?>
	</div>

	<div id = "imageDiv">
	</div>

	<div id = "loadMoreDiv">
	</div>
</body>
</html>
