import re
import os
FILENAME = "random_adventure" #Without extension

def split_paragraphs(fileString):
    return fileString.split("\t")

def parse_title(splitFile):
    splitFile[0] = "<h1 style=\"text-align: center\">" + splitFile[0]
    splitFile[0] = re.sub("\n\n", "</h1>", splitFile[0])
    return splitFile

def parse_supp(paragraph, style = "text"):
    patternDict = {
        "text": {
            "highlight" : "\(\(",
            "supplement" : "\)",
            "end" : "\)",
            "whole" : "\(\(.*\).*\)"
            },
        "image": {
            "highlight" : "\[\(",
            "supplement" : "\)",
            "end" : "\]",
            "whole" : "\[\(.*\).*\]"
            }
    }
    replacementDict = {
        "text": {
            "highlight" : "<span class=\"essay-supplement-a\">",
            "supplement" : "<span class=\"essay-supplement\">",
            "end" : "</span></span>"
            },
        "image": {
            "highlight" : "<span class=\"essay-supplement-a\">",
            "supplement" : "<img class=\"essay-supplement\" src=\"",
            "end" : "\"></span>"
            }
    }

    pattern = patternDict[style]
    replacementText = replacementDict[style]
    allMatches = re.findall(pattern["whole"], paragraph)

    for match in allMatches:
        match = re.sub(pattern["highlight"], replacementText["highlight"], match)
        match = re.sub(pattern["supplement"], replacementText["supplement"], match, 1)
        match = re.sub(pattern["end"], replacementText["end"], match, 1)
        paragraph = re.sub(pattern["whole"], match, paragraph, 1)
    return paragraph

def parse_quote(paragraph): #a quote should automatically make a new paragraph below it
    pattern = "\"\".*\"\""
    allMatches = re.findall(pattern, paragraph, re.S)
    print(allMatches)
    for match in allMatches:
        match = re.sub("\"\"", "</p><div class=\"essay-quote\">\'", match, 1, re.S)
        match = re.sub("\"\"", "\'</div><p class=\"essay-text\">", match, 1, re.S)
        match = re.sub("\n", "<br>", match, int(), re.S)
        paragraph = re.sub(pattern, match, paragraph, 1, re.S)
    return paragraph

def parse_paragraphs(splitFile):
    for i in range(1, len(splitFile)):
        paragraph = splitFile[i]
        paragraph = parse_supp(paragraph)
        paragraph = parse_supp(paragraph, "image")
        paragraph = parse_quote(paragraph)
        paragraph = "<span class=\"tab\"></span><p class=\"essay-text\">" + paragraph + "<br></p>\n"
        splitFile[i] = paragraph
    return splitFile

def construct_HTML(writeString):
    writeString = "<!DOCTYPE html>\n<html>\n<head>\n<meta name=\"viewport\" content=\"width=device-width, intitial-scale=1.0\" charset=\"utf-8\">\n<link rel=\"stylesheet\" href=\"https://cool.holedigging.club/highest_stratum/stylesheet.css\">\n</head>\n<body>\n<div class=\"essay\">\n<div class=\"essay-text\">\n" + writeString
    return writeString

def finish_HTML(writeString):
    writeString = writeString + "</div>\n</div>\n</body>\n</html>"
    return writeString

def remove_patterns(documentString, patterns = ["<p class=\"essay-text\">\n<br></p>"]):
    for pattern in patterns:
        allMatches = re.findall(pattern, documentString, re.S)
        documentString = re.sub(pattern, "", documentString, int(), re.S)
    return documentString

def main():
    writeString = str()
    writeString = construct_HTML(writeString)
    readFile = open("G:\\growing-potato\\highest_stratum\\" + FILENAME + ".txt", "r")
    writeFile = open("G:\\growing-potato\\highest_stratum\\"+ "writings/" + FILENAME + ".html", "w")
    fileString = readFile.read()
    splitFile = split_paragraphs(fileString)
    splitFile = parse_title(splitFile)
    spliteFile = parse_paragraphs(splitFile)
    for para in splitFile:
        writeString = writeString + para
    writeString = finish_HTML(writeString)
    writeString = remove_patterns(writeString)
    print(writeString)
    writeFile.write(writeString)
    readFile.close()
    writeFile.close()

main()

