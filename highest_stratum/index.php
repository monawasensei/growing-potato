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

                function parseParagraphs($fileString) {
                    $fileString = "<h1 style=\"text-align:center\">" . $fileString;
                    $count = substr_count($fileString, "\t");
                    for ($i = 0; $i <= $count; $i++) {
                        if ($i == 0) {
                            $fileString = str_replace("\t", "<br></h1><p class=\"essay-text\">", $fileString);
                        } else {
                            $fileString = str_replace("\t", "<br></p><p class=\"essay-text\">", $fileString);
                        }
                    }
                    $fileString = $fileString . "</p>";
                    return $fileString;
                }
                
                function parseFile($file,$filepath) {
                    $fileString = fread($file, filesize($filepath));
                    $fileString = parseParagraphs($fileString);
                    echo $fileString;
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
