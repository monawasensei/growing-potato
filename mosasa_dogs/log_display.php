<! DOCTYPE html>
<head>
<title>Potatofields playlist log</title>
<meta charset="utf-8">
<link rel="stylesheet" href="https://holedigging.club/potatofieldsData/potatofields.css"><style>
  a {
    color:yellow;
  }

  a:hover {
    color:darkorange;
  }

  a:visited {
    color:teal;
  }

  a:visited:hover {
    color:indigo;
  }
</style>
</head>
<body>
<?php
$log = fopen("potatofields_html_style_log.txt","r") or die("couldn't open log");
while(!feof($log)) {
	echo fgets($log) . "<br>";
}
fclose($log);
?>
</body>
</html>
