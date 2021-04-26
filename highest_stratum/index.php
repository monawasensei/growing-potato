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
                
                function parseFile($file,$filepath) {
                    echo fread($file, filesize($filepath));
                }

                function getFile() {
                    $filename = $_GET['post'];
                    $filepath = "writings/" . $filename;
                    $file = fopen($filepath, "r") or die("could not open file");
                    parseFile($file, $filepath);
                }

                getFile();
            ?>
		</div>
        <a href="?post=testParse.txt">test</a>
	</body>
</html> 
