<!DOCTYPE html>
<html>
<head>
<title>artbook main page</title>
	<style>
	#phpImageBlock {
		margin: 5px;
		max-height: 60px;
		}
	</style>
</head>
<body>
	<div id = "phpImageBlock">
		<?php 
			$conn = new mysqli("monawasensei56192.domaincommysql.com", "tuber", "Test123!@#","potato_database"); 
			if ($conn->connect_error) { 
				die('Could not connect: ' . $conn->connect_error); 
			} 
		echo "Connected successfully";
		$sql = "SELECT CONCAT(\"https://holedigging.club/archive/artbook/artbook/\",filename) AS 'absDir' FROM archive_artbook";
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
