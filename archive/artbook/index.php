<!DOCTYPE html>
<html>
<head>
<title>artbook main page</title>
</head>
<body>
	<div id = "phpTesting">
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
				$filename = $row["absDir"].
				echo "\n"$filename
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
