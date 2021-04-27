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

                function getArticles() {
                    $directoryName = "/writings/";
                    if (is_dir($directoryName)) {
                        if ($directory = opendir($directoryName)) {
                            while ($file = readdir($directory) !== false) {
                                echo $file . "<br>";
                            }
                        }
                    }
                    closedir($directory);
                }

                getArticles();

            ?>
		</div>
	</body>
</html> 
