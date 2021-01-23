<!DOCTYPE html>
<html>
<head>
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
			/*
			$possibledirectory = array("artbook","colours","edits","pics","fanart","misc","screencaps"); //making this array to check that the querystring is not some malicious attempt at SQL code insertion
			
			$directory = $_GET['directory']; //will hopefully pull the querystring
			
			foreach ($possibledirectory as $potential) {
				
				if ($directory == "$potential") {
						$isvalid = 1;
				}
				
			}
			
			if ($isvalid != 1) {
					echo "very naughty";
					exit;
			}
			*/
			//$directory="artbook";
			$sql = "SELECT CONCAT('https://holedigging.club/archive/',uniquepath) as 'absDir' from archive WHERE origin = 'artbook' AND filetype != 'webm' AND filetype != 'mp4';" 
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
