function get_string(string) {
	//gets the string from the apporpriate element on the page
	change_font(string)
}

function change_font(string){
		characterArray = string.split()
		characterArray.forEach(change_char_font())
}

function change_char_font(value,index,array) {
	//wait some split second amount of time so the font changes and scans across the passed word
	//change the font of each character
}