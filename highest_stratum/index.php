<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Highest Stratum</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0"> 
		<meta charset="utf-8"> <!-- need to pay more attention to syntax and learn how meta tags work -->
		<link rel="stylesheet" href="stylesheet.css">
	</head>
	<body>
		<div class="essay">
            <?php
                function getFile() {
                    $filename = $_GET['post'];
                    $filepath = "writings/" . $filename;
                    $file = fopen($filepath, "r") or die("could not open file");
                    echo fread($file, $filepath);
                }

                getFile();
            ?>
		</div>
        <a href="?post=highestStratumExample.html">test</a>
	</body>
</html> 
