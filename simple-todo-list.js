'use strict';

var button = document.getElementById("addBtn"),
    input = document.getElementById("userInput"),
	ul = document.querySelector("ul");


	var data = JSON.stringify([{
					id: 123,
					name: 'Monday is gym day',
					state: true
				},
				{
					id: 124,
					name: 'Thuesday as well',
					state: true
				}
			]);


	    // set default test data 
		(function setDefaultUsers(){
			localStorage.setItem("listElements", data);
		})();

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
	var li = event.target.parentNode,
		itemId = parseInt(li.getAttribute('id'),10);
	removeLocalStorageElement('listElements', itemId);
    li.removeEventListener('click', toggleCssClass);
	ul.removeChild(li);
}

// create list entry element
function createListElement(newEntry) {

    var span = document.createElement("span");
	span.appendChild(document.createTextNode(newEntry.name));
	
    var li = document.createElement("li");
	li.appendChild(span);
	li.setAttribute('id', newEntry.id);
    
    li.addEventListener('click', toggleCssClass);
    
    createDeleteBtn(li);

	ul.appendChild(li);
	input.value = "";
}

// append list element to local storage
function appendToLocalStorage(key, newData) {
	var data = JSON.parse(localStorage.getItem(key));
	data.push(newData);
	localStorage.setItem(key, JSON.stringify(data));
}

// remove list element from local storage
function removeLocalStorageElement(key, itemId) {
	var data = JSON.parse(localStorage.getItem(key)),
		newData = data.filter(function (value) {
			return value.id !== itemId;
		});
	localStorage.setItem(key, JSON.stringify(newData));
}

// update item
// ...................

// add item to list
function addListAfterClick() {
	if (inputLength() > 0) {
		var newEntry = {
			id: new Date().getTime(),
			name: input.value,
			state: true
		};
		createListElement(newEntry);
		appendToLocalStorage('listElements', newEntry);
	}
}
function addListAfterKeypress(event) {
	if (inputLength() > 0 && event.keyCode === 13) {
		var newEntry = {
			id: new Date().getTime(),
			name: input.value,
			state: true
		};
		createListElement(newEntry);
		appendToLocalStorage('listElements', newEntry);
	}
}

// toggle done class
function toggleCssClass(event) {

	// update item
	// ................... .add("mystyle"); // remove()

	if (event.target.nodeName === 'LI') {
		event.target.classList.toggle('done');
	} else {
		event.target.parentNode.classList.toggle('done');
	}	
}

// read all values available in local storage and create list entries
function drawListElementsLocalStore() {
	var data = JSON.parse(localStorage.getItem('listElements'));
	if (data !== null) {
		// create li entries 
		data.forEach(entry => {
			createListElement(entry);
		});
	}
}

drawListElementsLocalStore();

// add event listeners to button/input
button.addEventListener("click", addListAfterClick);
input.addEventListener("keypress", addListAfterKeypress);