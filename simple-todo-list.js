'use strict';

var addButton = document.getElementById('addBtn'),
	clearButton = document.getElementById('clearBtn'),
    input = document.getElementById('userInput'),
	ul = document.querySelector('ul');


/* INIT */

function init() {
	let data = getStorageData('listElements');
	removeList();
	drawListElementsFromLocalStore(data);
	window.removeEventListener('focus', init);
}


/*HELPERS */

// input verification
function inputLength() {
	return input.value.length;
}


/* LOCAL STORAGE HANDLING */

function getStorageData(storageItemName) {
	let data = JSON.parse(localStorage.getItem(storageItemName));
	return data;
}

function setData(storageItemName, data) {
	localStorage.setItem(storageItemName, JSON.stringify(data));
}


function removeAllStorageData(storageItemName) {
	localStorage.removeItem(storageItemName);
}

// append list element to local storage
function appendToLocalStorage(storageItemName, newData) {
	let data = getStorageData(storageItemName) || [];
	data.push(newData);
	setData(storageItemName, data);
}

// update local storage item
function updateLocalStorageElement(storageItemName, entryId) {
	let data = getStorageData(storageItemName),
		newData = data.map(function (entry) {
			if (entry.id === entryId) {
				entry.state = !entry.state;
			}
			return entry;
		});
	setData(storageItemName, newData);
}

// remove list element from local storage
function removeLocalStorageElement(storageItemName, entryId) {
	let data = getStorageData(storageItemName),
		newData = data.filter(function (value) {
			return value.id !== entryId;
		});
	setData(storageItemName, newData);
}


/* RENDERING OF ELEMENTS */

// create list entry element
function createListElement(newEntry) {
    let span = document.createElement('span');
	span.appendChild(document.createTextNode(newEntry.name));
	
    let li = document.createElement('li');
	li.appendChild(span);
	li.setAttribute('id', newEntry.id);

	if (newEntry.state === false) {
		li.classList.add('done');
	}

	li.addEventListener('click', toggleCssClass);	
	return li;
}

// create and add delete button for list items
function createDeleteBtnForListItem(){
	var delBtn = document.createElement('span');
    delBtn.appendChild(document.createTextNode('x'));
    delBtn.classList.add('close');
	delBtn.addEventListener('click', removeItem);
	return delBtn;
}

// render list item
function renderListItem(newEntry) {
	var li = createListElement(newEntry),
   		delBtn = createDeleteBtnForListItem(li);
   
   li.appendChild(delBtn);
   ul.appendChild(li);

   input.value = '';
   clearButton.classList.remove('hide');
}

// remove list item
function removeItem(event){
	var li = event.target.parentNode,
		entryId = parseInt(li.getAttribute('id'),10);
    li.removeEventListener('click', toggleCssClass);
	ul.removeChild(li);
	if (ul.children.length < 1) {
		clearButton.classList.add('hide');
	}
	removeLocalStorageElement('listElements', entryId);
}

// remove list
function removeList() {
	ul.innerHTML = '';
}

// read all values available in local storage and create list entries
function drawListElementsFromLocalStore(data) {
	if (data !== null && data.length !== 0) {
		// create li entries 
		data.forEach(entry => {
			renderListItem(entry);
		});
		clearButton.classList.remove('hide');
	} else {
		clearButton.classList.add('hide');
	}
}

// remove list
function clearLocalStorageElement(storageItemName) {
	if (confirm('Remove all entries?')) {
		removeList();
		removeAllStorageData(storageItemName);
		clearButton.classList.add('hide');
	}
}


/* EVENT HANDLING */

// add item to list
function addListAfterClick() {
	if (inputLength() > 0) {
		var newEntry = {
			id: new Date().getTime(),
			name: input.value,
			state: true
		};
		renderListItem(newEntry);
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
		renderListItem(newEntry);
		appendToLocalStorage('listElements', newEntry);
	}
}

// toggle done class
function toggleCssClass(event) {
	let elementId;
	if (event.target.nodeName === 'LI') {
		event.target.classList.toggle('done');
		elementId = parseInt(event.target.getAttribute('id'),10);
	} else {
		event.target.parentNode.classList.toggle('done');
		elementId = parseInt(event.target.parentNode.getAttribute('id'),10);
	}
	updateLocalStorageElement('listElements', elementId);
}

// reload list from local storage on page changes
window.addEventListener('blur', function () {
	window.addEventListener('focus', init);
});

// add event listeners to buttons + input
addButton.addEventListener('click', addListAfterClick);
clearButton.addEventListener('click', clearLocalStorageElement.bind(this,'listElements'));
input.addEventListener('keypress', addListAfterKeypress);

// initial call 
init();