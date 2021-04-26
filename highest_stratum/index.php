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

                function parseTitle($fileString) {
                    $regexPattern = "/n/n$";
                    $fileString = "<h1 style=\"text-align: center\">" . $fileString;
                    $fileString = preg_replace($regexPattern, "<br></h1>");
                    return $fileString;
                }
                
                function parseParagraphs($fileString) {
                    $regexPattern = "\t";
                    //$fileString = "<h1 style=\"text-align:center\">" . $fileString;
                    $count = preg_match_all($regexPattern, $fileString);
                    for ($i = 0; $i <= $count; $i++) {
                        if ($i == 0) {
                            $fileString = preg_replace("\t", "<p class=\"essay-text\">", $fileString);
                        } else {
                            $fileString = preg_replace("\t", "<br></p><p class=\"essay-text\">", $fileString);
                        }
                    }
                    $fileString = $fileString . "</p>";
                    return $fileString;
                }
/*
                function parseQuotes($fileString) { //will need to use regex for this probably //will not work if there are non-quote quotation marks elsewhere in the document
                    $count = substr_count($fileString, "\"");
                    for ($i = 0; $i <= $count; $i++) {
                        if ($i == 0) {
                            $fileString = str_replace("\'", "<div class=\"")
                        } else {

                        }
                    }
                    $fileString = $fileString . "</div>";
                }
 */               
                function parseFile($file,$filepath) {
                    $fileString = fread($file, filesize($filepath));
                    $fileString = parseTitle($fileString);
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
