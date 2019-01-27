var button = document.getElementById("addBtn"),
    input = document.getElementById("userInput"),
    ul = document.querySelector("ul");

// input verification
function inputLength() {
	return input.value.length;
}

// create delete button for items
function createDeleteBtn(listItem){
	var delBtn = document.createElement('span');
    delBtn.appendChild(document.createTextNode("x"));
    delBtn.classList.add("close");
	delBtn.addEventListener("click", removeItem);
	listItem.appendChild(delBtn);
}

// remove item
function removeItem(event){
    var li = event.target.parentNode;
    li.removeEventListener('click', toggleCssClass);
	ul.removeChild(li);
}

// create list entry element
function createListElement() {
    var span = document.createElement("span");
    span.appendChild(document.createTextNode(input.value));

    var li = document.createElement("li");
    li.appendChild(span);
    
    li.addEventListener('click', toggleCssClass);
    
    createDeleteBtn(li);

	ul.appendChild(li);
	input.value = "";
}


// add item to list
function addListAfterClick() {
	if (inputLength() > 0) {
		createListElement();
	}
}
function addListAfterKeypress(event) {
	if (inputLength() > 0 && event.keyCode === 13) {
		createListElement();
	}
}

// toggle done class
function toggleCssClass(event) {
	if (event.target.nodeName === 'LI') {
		event.target.classList.toggle('done');
	} else {
		event.target.parentNode.classList.toggle('done');
	}
	
}

// add event listeners to button/input
button.addEventListener("click", addListAfterClick);
input.addEventListener("keypress", addListAfterKeypress);