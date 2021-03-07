<! DOCTYPE html>
<head>
<title>Potatofields playlist log</title>
<meta charset="utf-8">
</head>
<body>
<?php
$log = fopen("potatofields_playlist_log.txt","r") or die("couldn't open log");
while(!feof($log)) {
	echo fgets($log) . "<br>";
}
fclose($log);
?>
</body>
</html>
