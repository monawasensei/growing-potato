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
                $filepath = "writings/testParse.txt";
                $file = fopen($filepath, "r") or die("could not open file");

                function parseFile($file,$filepath) {
                    echo fread($file, filesize($filepath));
                }

                parseFile($file, $filepath);

            ?>
			<div class="essay-quote">
				<p> 
				If only we didn't have to eat to live,<br>	
				I would hardly... call that living<br>
				- Titus and Julius (1,5,3)<br><br>
				</p>
			</div>
			<div class="link-to-essay">
				<a href="writings/BeowulfAndGrendel.html">Go to the sample essay</a>
			</div>
		</div>
	</body>
</html> 
