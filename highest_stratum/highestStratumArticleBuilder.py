import re

def split_paragraphs(fileString):
    return fileString.split("\t")

def parse_title(splitFile):
    splitFile[0] = "<h1 style=\"text-align: center\">" + splitFile[0]
    splitFile[0] = re.sub("\n\n", "<br></h1>", splitFile[0])
    return splitFile

def parse_supp(paragraph, style = "text"):
    pattern = {"text": ("\(\(","\)","\)","\(\(.*\).*\)"), 
        "image": ("\[\(","\)","\]","\[\(.*\).*\]")}[style]
    replacementText = {"text": ("<div class=\"essay-supplement-a\">","<span class=\"essay-supplement\">","</span></div>"), 
        "image": ("<div class=\"essay-supplement-a\">","<img class=\"essay-supplement\" src=\"","\"></div>")}[style]
    allMatches = re.findall(pattern[3], paragraph)
    for match in allMatches:
        match = re.sub(pattern[0], replacementText[0], match)
        match = re.sub(pattern[1], replacementText[1], match, 1)
        match = re.sub(pattern[2], replacementText[2], match, 1)
        paragraph = re.sub(pattern[3], match, paragraph, 1)
    return paragraph

def parse_quote(paragraph):
    pattern = "\"\".*"
    allMatches = re.findall(pattern, paragraph, re.S)
    for match in allMatches:
        match = re.sub("\"\"", "<div class=\"essay-quote\"><pre>\'", match, 1, re.S)
        match = re.sub("\"\"", "\'</pre></div>", match, 1, re.S)
        paragraph = re.sub(pattern, match, paragraph, 1, re.S)
    return paragraph

def parse_paragraphs(splitFile):
    index = 0
    for paragraph in splitFile: #this will also run through the title at index = 0, but that shouldn't matter.
        paragraph = parse_supp(paragraph)
        paragraph = parse_supp(paragraph, "image")
        paragraph = parse_quote(paragraph)
        paragraph = "<p class=\"essay-text\">" + paragraph + "<br></p>"
        splitFile[index] = paragraph
        index += 1
    return splitFile

def construct_HTML(writeString):
    writeString = "<!DOCTYPE html>\n<html>\n<head>\n<meta name=\"viewport\" content=\"width=device-width, intitial-scale=1.0\" charset=\"utf-8\">\n<link rel=\"stylesheet\" href=\"https://cool.holedigging.club/highest_stratum/stylesheet.css\">\n</head>\n<body>\n<div class=\"essay\">\n<div class=\"essay-text\">\n" + writeString
    return writeString

def finish_HTML(writeString):
    writeString = writeString + "</div>\n</div>\n</body>\n</html>"
    return writeString

def main():
    writeString = str()
    writeString = construct_HTML(writeString)
    readFile = open("highestStratumExample.txt", "r")
    writeFile = open("highestStratumExample.html", "w")
    fileString = readFile.read()
    splitFile = split_paragraphs(fileString)
    splitFile = parse_title(splitFile)
    spliteFile = parse_paragraphs(splitFile)
    for para in splitFile:
        writeString = writeString + para
    writeString = finish_HTML(writeString)
    writeFile.write(writeString)
    readFile.close()
    writeFile.close()

main()

