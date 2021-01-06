<!DOCTYPE html>
<html>
<head>
<title>pics main page</title>
</head>
<body>
	<div id = "phpTesting">
		<?php 
			$link = mysql_connect('monawasensei56192.domaincommysql.com', 'tuber', '*password*'); 
			if (!$link) { 
				die('Could not connect: ' . mysql_error()); 
			} 
		echo 'Connected successfully'; 
		mysql_select_db(potato_database);
		
		$sql = "SELECT CONCAT(\"https://holedigging.club/archive/artbook/artbook/\",filename) as \'absDir\'\n"

	    . "FROM archive_artbook";
		echo $sql;
		?>
		<p>this text should show up on the page, though it's not in the PHP block..</p>
	</div>
	
	<div id = "imageDiv">
	</div>
	
	<div id = "loadMoreDiv">
	</div>
	
	
	
	
	
<script>
	
var fileName	

//var absoluteCount = ((pageValue*100)+1);
//var absoluteCountBeginningBound = absoluteCount;
//var absoluteCountEndBound = (100*pageValue)+100;
	
//Here is the for-now-functional display loops
var folderName
for (folderName = 1; folderName <= 2; folderName++){
	for (fileName = 1; fileName <=950; fileName++){
		createImageAndLink(folderName,fileName);
	}
}
	
	
//this block is the WIP display loop, commented out so we can have a semi-functional archive in the meantime
	//this block will eventually use PHP and SQL theories btw :^)
/*var pageValue = getPageValue();
	//document.getElementById("debug").innerHTML = pageValue; //debugging text flag	
var folderName = getFolderName(absoluteCount);
	//document.getElementById("debug2").innerHTML = folderName; //debugging text flag
for (fileName = setFileName(absoluteCountBeginningBound); fileName <= (absoluteCountEndBound); fileName = fileNameIncrement(fileName)) { 
	createImageAndLink(folderName,fileName);
	absoluteCount++;
	//folderName = getFolderName(absoluteCount);
}*/
	
function createImageAndLink(folderName,fileName) {
	var anchor = document.createElement("A");
	var img = document.createElement("IMG");
	
	anchor.setAttribute("id","anchor_"+folderName+"_"+fileName);
	anchor.setAttribute("href","https://holedigging.club/archive/pics/images"+folderName+"/"+fileName+".jpg");
	anchor.setAttribute("target","_blank");
	document.getElementById("imageDiv").appendChild(anchor);
	
	img.src = "images"+folderName+"/"+fileName+".jpg";
	img.setAttribute("loading","lazy");
	img.style.margin = "2px";
	img.style.maxHeight = "300px";
	document.getElementById("anchor_"+folderName+"_"+fileName).appendChild(img);
}

/*function getPageValue() {
	var pageString = location.search;
	var pageValue = pageString.substr(queryStringPos(pageString,"page="),2);
	pageValue = pageValue-1;
	return pageValue;
}
	
function queryStringPos(string,searchString) {
	var start = string.search(searchString);
	var searchStringLength = searchString.length;
	var endPosition = start + searchStringLength;
	return endPosition;
}
	
function getFolderName(absoluteCount) {
	var folderName =1;
	while (absoluteCount > 950*folderName){
		folderName++;
	}
	return folderName;
}
	
function fileNameIncrement(fileName) {
	fileName++;
	if (fileName > 950) {
		fileName = 1;
	}
	return fileName;
}
	
function setFileName(absoluteName) {
	var fileName = absoluteName;
	while (fileName > 950) {
		fileName = fileName - 950;
	}
	return fileName;
}*/
	
	
	
</script>
</body>
</html>
