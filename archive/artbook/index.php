<!DOCTYPE html>
<html>
<head>
<title>artbook main page</title>
</head>
<body>
	<div id = "phpTesting">
		<?php 
			$conn = new mysqli("monawasensei56192.domaincommysql.com", "tuber", "Test123!@#"); 
			if ($conn->connect_error) { 
				die('Could not connect: ' . $conn->connect_error); 
			} 
		echo "Connected successfully"; 
		echo "Hello does this work?";
		?>
	</div>
	
	<div id = "imageDiv">
	</div>
	
	<div id = "loadMoreDiv">
	</div>
</body>
</html>
