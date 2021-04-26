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
                echo "desding sum bhb :DDD";

                function getArticles() {
                    $currentDir = dir(getcwd());
                    echo "currentDir" . $currentDir->handle . "<br>" . $currentDir->path . "<br>";
                    $currentDirContents = scandir($currentDir);
                    print_r($currentDirContents);
                    foreach ($currentDirContents as $item) {
                        echo $item . "<br>";
                    }
                }

                getArticles();
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
