<!DOCTYPE html>
<html>
<head>
<title>screencaps main page</title>
	<style>
		* {
			max-height: 300px;
		}
	</style>
</head>
<body>
	<div>
		<?php 
			$conn = new mysqli("monawasensei56192.domaincommysql.com", "tuber", "Test123!@#","potato_database"); 
			if ($conn->connect_error) { 
				die('Could not connect: ' . $conn->connect_error); 
			} 
		//$sql = "SELECT CONCAT(absolutepath,CASE WHEN relativepath IS NULL THEN \'\' ELSE relativepath END,filename) from screencaps";
		$sql = "SELECT filename as 'absDir' FROM screencaps where image_id < 21";
		$result = $conn->query($sql);
		
		if ($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
				$filename = $row["absDir"];
				echo $filename;
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
