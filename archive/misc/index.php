<!DOCTYPE html>
<html>
<head>
<title>artbook main page</title>
<link rel="stylesheet" href="https://holedigging.club/archive/archiveStyle.CSS">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
	<div>
		<?php 
			$conn = new mysqli("monawasensei56192.domaincommysql.com", "tuber", "Test123!@#","potato_database"); 
			if ($conn->connect_error) { 
				die('Could not connect: ' . $conn->connect_error); 
			} 
		$sql = "SELECT CONCAT(absolutepath,CASE WHEN relativepath IS NULL THEN '' ELSE relativepath END, filename) as 'absDir' from misc WHERE filetype != 'webm' AND filetype != 'mp4'";
		$result = $conn->query($sql);
		
		if ($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
				$filename = $row["absDir"];
				echo "<a href=\"${filename}\" target=\"_blank\"> <image src=\"${filename}\"></a>";
			"<br>";
			}
		} 
		else {
			echo "\n0 results";
		}
		?>
	</div>
	
	<div id = "imageDiv">
	</div>
	
	<div id = "loadMoreDiv">
	</div>
</body>
</html>
