"use strict";
function l(arg) {
	console.log(arg);
}

function $(el) {
	return document.querySelector(el);
}

function t(el, cl) {
	return el.classList.toggle(cl);
}
function a(el, cl) {
	return el.classList.add(cl);
}
function r(el, cl) {
	return el.classList.remove(cl);
}
function c(el, cl) {
	return el.classList.contains(cl);
}

//--------------------------------------------------------------------------------

const wrapper = $('.wrapper'),
	//cellsHtml = [],
	title = $('.message'),
	menu = $('.menu'),
	counter = $('.counter'),
	field = $('.field'),
	w = window.innerWidth,
	h = window.innerHeight;
let sizeX = 10,
	sizeY = 12,
	count = 0,
	randomValue = 4,
	positionArray = [],
	previosPosition = '';
//-------------------------------------------------------------------

//-----------------------------------------------------------------class CELL
/*
class Cell {
	constructor(sizeX, sizeY, element, className, array) {
		this.sizeX = sizeX;
		this.sizeY = sizeY;
		this.element = element;
		this.className = className;
		this.array = array;
	}
	createCell() {
		let y = 0;
		while (y < this.sizeY) {
			this.array[y] = [];
			let x = 0;
			while (x < this.sizeX) {
				let cell = document.createElement(this.element);
				cell.classList.add(this.className);
				cell.style.flex = `1 1 ${100 / this.sizeX}%`;
				cell.setAttribute("id", `x${y}y${x}`);
				this.array[y].push(cell);
				field.append(cell);
				x++;
			}
			y++;
		}
	}
}
*/

class Cell {
	constructor(sizeX, sizeY) {
		this.sizeX = sizeX;
		this.sizeY = sizeY;
		this.number = sizeX * sizeY;
		//this.className = className;
		//this.array = array;
	}
	createCell() {
		let y = 0;
		while (y < this.sizeY) {
			let x = 0;
			while (x < this.sizeX) {
				let cell = document.createElement('div');
				cell.classList.add('cell');
				cell.style.flex = `1 1 ${100 / this.sizeX}%`;
				cell.setAttribute("id", `x${y}y${x}`);
				field.append(cell);
				x++;
			}
			y++;
		}
	}
}
//----------------------------------------------------------------
window.onload = rerenderAll(sizeX, sizeY);

//window.onresize = rerenderSize(sizeX, sizeY);

setTimeout(() => {
	title.classList.remove('show-message')
}, 1000);

//-------------------------------------------------------------------
function rerenderAll(sizeX, sizeY) {
	correctSize();
	setFieldSize(sizeX, sizeY);
	new Cell(sizeX, sizeY).createCell();
	wrapper.classList.add('.visible');
	/*new Cell(sizeX, sizeY, 'div', 'cell', cellsHtml).createCell();
	wrapper.classList.add('.visible');
	*/
}

/*
function rerenderSize(sizeX, sizeY) {
	correctSize();
	setFieldSize(sizeX, sizeY);
}
---------------------------------------need to redo cell.style.flex generation*/

function correctSize() {
	if (w > h && sizeX < sizeY) [sizeX, sizeY] = [sizeY, sizeX];
	if (w < h && sizeX > sizeY) [sizeX, sizeY] = [sizeY, sizeX];
}

//-------------------------------------------------------------------

function setFieldSize(sizeX, sizeY) {
	if (w / h > sizeX / sizeY) {
		field.style.height = h * 0.8 + 'px';
		field.style.width = parseFloat(field.style.height) / sizeY * sizeX + 'px';
	} else {
		field.style.width = w * 0.8 + 'px';
		field.style.height = parseFloat(field.style.width) / sizeX * sizeY + 'px';
	}
}

//---------------------------------------------------------------

field.addEventListener('click', (e) => {
	if (e.target.closest('.cell') && field.classList.contains('stop')) {
		e.target.classList.toggle('live');
	}
});

//---------------------------------------------------------------MENU BUTTONS LISTENER


menu.addEventListener('click', (e) => {
	if (e.target.closest('.start')) {
		field.classList.remove('stop');
		while (checkPosition()) makeStep();
		field.classList.add('stop');
		showCount(count);


	}

	else if (e.target.closest('.step')) {
		if (checkPosition()) {
			makeStep();
			field.classList.remove('stop');
		}
		showCount(count);
	}

	else if (e.target.closest('.random__btn')) {
		clear();
		addRandomCells();
	}

	else if (e.target.closest('.clear')) {
		clear();

	}

});




//---------------------------------------------------------------random position

//let startPosition = '';
let cellsArr = document.querySelectorAll('.cell');

function getRandom(max) {
	return Math.floor(Math.random() * max);
}
/*
function addRandomCells() {
	startPosition = ''
	cellsHtml.forEach((row) => {

		row.forEach((element) => {
			element.classList.remove('live');
			let x = getRandom(2);
			x && element.classList.add('live');
			startPosition += x;
		});
	});
	l(startPosition);
}
*/
function addRandomCells() {
	let value = $('.random__proportion').value;
	if (value < 2 || value > 10) {
		showMessage('random value from 2 to 10', 'maroon');
	} else {
		randomValue = value;

		cellsArr.forEach((element) => {
			let x = getRandom(randomValue);  //  random proportion (from 2, bigger number - less cells generated)
			x === 1 && element.classList.add('live');
		});
	}
}

function clear() {
	cellsArr.forEach((element) => {
		element.classList.remove('live');
	});
	field.classList.add('stop');
	positionArray.length = 0;
	previosPosition = '';
	count = 0;
	showCount(count);
}
//----------------------------------------------------------previos Position


function checkPosition() {
	previosPosition = '';
	cellsArr.forEach((element) => {
		if (element.classList.contains('live')) {
			previosPosition += 1;
		} else previosPosition += 0;
	});

	if (+previosPosition === 0) {
		showMessage('No more cells', 'darkred');
		return false;
	}
	else if (positionArray.indexOf(previosPosition) >= 0) {
		showMessage(`this step is same as ${positionArray.indexOf(previosPosition)}`, 'darkred');

		return false;
	} else {
		positionArray.push(previosPosition);
		l(previosPosition);
		return true;
	}
}


function showMessage(message, color) {
	title.innerHTML = message;
	title.classList.add('show-message');
	title.style.color = color;
	setTimeout(() => {
		title.classList.remove('show-message');
		setTimeout(() => {
			title.style.color = 'white';
			title.innerHTML = "CONWAY'S GAME OF LIFE";
		}, 2000);

	}, 1000)
}

function showCount(count) {
	counter.textContent = (count);
}
//-----------------------------------------------------------


//----------------------------------------------------------------make step function
/*
function makeStep() {
				let x = 0, y = 0;

	cellsArr.forEach(el => {
		if (el.id == `x0y${y}`) {

			if (el.id == `x0y0`) {

				let status = 0;
			if (c($(`#x${sizeX - 1}y${sizeY - 1}`), 'live')) status++;
			if (c($(`#x${x}y${sizeY - 1}`), 'live')) status++;
			if (c($(`#x${x + 1}y${sizeY - 1}`), 'live')) status++;
			if (c($(`#x${sizeX - 1}y${y}`), 'live')) status++;
			if (c($(`#x${x + 1}y${y}`), 'live')) status++;
			if (c($(`#x${sizeX - 1}y${y + 1}`), 'live')) status++;
			if (c($(`#x${x}y${y + 1}`), 'live')) status++;
			if (c($(`#x${x + 1}y${y + 1}`), 'live')) status++;
			checkStatus(status, x, y);

			}
			else if (el.id == `x0y${sizeY - 1}`) {


				let status = 0;
			if (c($(`#x${sizeX - 1}y${y - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x}y${y - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x + 1}y${y - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${sizeX - 1}y${y}`), 'live')) {
				status++;
				}
			if (c($(`#x${x + 1}y${y}`), 'live')) {
				status++;
				}
			if (c($(`#x${sizeX - 1}y0`), 'live')) {
				status++;
				}
			if (c($(`#x${x}y0`), 'live')) {
				status++;
				}
			if (c($(`#x${x + 1}y0`), 'live')) {
				status++;
				}
			//l(status);

			checkStatus(status, x, y);

			}
			else {

				let status = 0;
			if (c($(`#x${sizeX - 1}y${y - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x}y${y - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x + 1}y${y - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${sizeX - 1}y${y}`), 'live')) {
				status++;
				}
			if (c($(`#x${x + 1}y${y}`), 'live')) {
				status++;
				}
			if (c($(`#x${sizeX - 1}y${y + 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x}y${y + 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x + 1}y${y + 1}`), 'live')) {
				status++;
				}
			//l(status);

			checkStatus(status, x, y);
			}
			y++;
		}
			else if (el.id == `x${sizeX - 1}y${y}`) {

			if (el.id == `x${sizeX - 1}y0`) {

				let status = 0;

			if (c($(`#x${x - 1}y${sizeY - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x}y${sizeY - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x0y${sizeY - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x - 1}y${y}`), 'live')) {
				status++;
				}
			if (c($(`#x0y${y}`), 'live')) {
				status++;
				}
			if (c($(`#x${x - 1}y${y + 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x}y${y + 1}`), 'live')) {
				status++;
				}
			if (c($(`#x0y${y + 1}`), 'live')) {
				status++;
				}
			//l(status);

			checkStatus(status, x, y);

			}
			else if (el.id == `x${sizeX - 1}y${sizeY - 1}`) {
				let status = 0;

			if (c($(`#x${x - 1}y${y - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x}y${y - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x0y${y - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x - 1}y${y}`), 'live')) {
				status++;
				}
			if (c($(`#x0y${y}`), 'live')) {
				status++;
				}
			if (c($(`#x${x - 1}y0`), 'live')) {
				status++;
				}
			if (c($(`#x${x}y0`), 'live')) {
				status++;
				}
			if (c($(`#x0y0`), 'live')) {
				status++;
				}
			//l(status);

			checkStatus(status, x, y);

			}
			else {
				let status = 0;

			if (c($(`#x${x - 1}y${y - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x}y${y - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x0y${y - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x - 1}y${y}`), 'live')) {
				status++;
				}
			if (c($(`#x0y${y}`), 'live')) {
				status++;
				}
			if (c($(`#x${x - 1}y${y + 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x}y${y + 1}`), 'live')) {
				status++;
				}
			if (c($(`#x0y${y + 1}`), 'live')) {
				status++;
				}
			//l(status);

			checkStatus(status, x, y);

			}
			y++;
		} else {

			if (el.id == `x${x}y0`) {

				let status = 0;
			if (c($(`#x${x - 1}y${sizeY - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x}y${sizeY - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x + 1}y${sizeY - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x - 1}y${y}`), 'live')) {
				status++;
				}
			if (c($(`#x${x + 1}y${y}`), 'live')) {
				status++;
				}
			if (c($(`#x${x - 1}y${y + 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x}y${y + 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x + 1}y${y + 1}`), 'live')) {
				status++;
				}
			//l(status);

			checkStatus(status, x, y);

			}
			else if (el.id == `x${x}y${sizeY - 1}`) {

				let status = 0;
			if (c($(`#x${x - 1}y${y - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x}y${y - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x + 1}y${y - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x - 1}y${y}`), 'live')) {
				status++;
				}
			if (c($(`#x${x + 1}y${y}`), 'live')) {
				status++;
				}
			if (c($(`#x${x - 1}y0`), 'live')) {
				status++;
				}
			if (c($(`#x${x}y0`), 'live')) {
				status++;
				}
			if (c($(`#x${x + 1}y0`), 'live')) {
				status++;
				}
			//l(status);

			checkStatus(status, x, y);

			}
			else {

				let status = 0;
			if (c($(`#x${x - 1}y${y - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x}y${y - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x + 1}y${y - 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x - 1}y${y}`), 'live')) {
				status++;
				}
			if (c($(`#x${x + 1}y${y}`), 'live')) {
				status++;
				}
			if (c($(`#x${x - 1}y${y + 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x}y${y + 1}`), 'live')) {
				status++;
				}
			if (c($(`#x${x + 1}y${y + 1}`), 'live')) {
				status++;
				}


			checkStatus(status, x, y);
			}
			y++;
		}


			if (y == sizeY) {
				x++;
			y = 0;
		}
	});

			function isL(selector) {
		if (document.querySelector(selector).classList.contains('live')) status++;
			l('WOOOOW');
	}



			changeStatus();
}

			*/

function makeStep() {
	let x = 0, y = 0;

	cellsArr.forEach(el => {
		if (el.id == `x0y${y}`) {

			if (el.id == `x0y0`) {
				let status = 0;
				if (c($(`#x${sizeX - 1}y${sizeY - 1}`), 'live')) status++;
				if (c($(`#x${x}y${sizeY - 1}`), 'live')) status++;
				if (c($(`#x${x + 1}y${sizeY - 1}`), 'live')) status++;
				if (c($(`#x${sizeX - 1}y${y}`), 'live')) status++;
				if (c($(`#x${x + 1}y${y}`), 'live')) status++;
				if (c($(`#x${sizeX - 1}y${y + 1}`), 'live')) status++;
				if (c($(`#x${x}y${y + 1}`), 'live')) status++;
				if (c($(`#x${x + 1}y${y + 1}`), 'live')) status++;
				checkStatus(status, x, y);
			}
			else if (el.id == `x0y${sizeY - 1}`) {
				let status = 0;
				if (c($(`#x${sizeX - 1}y${y - 1}`), 'live')) status++;
				if (c($(`#x${x}y${y - 1}`), 'live')) status++;
				if (c($(`#x${x + 1}y${y - 1}`), 'live')) status++;
				if (c($(`#x${sizeX - 1}y${y}`), 'live')) status++;
				if (c($(`#x${x + 1}y${y}`), 'live')) status++;
				if (c($(`#x${sizeX - 1}y0`), 'live')) status++;
				if (c($(`#x${x}y0`), 'live')) status++;
				if (c($(`#x${x + 1}y0`), 'live')) status++;
				checkStatus(status, x, y);
			}
			else {
				let status = 0;
				if (c($(`#x${sizeX - 1}y${y - 1}`), 'live')) status++;
				if (c($(`#x${x}y${y - 1}`), 'live')) status++;
				if (c($(`#x${x + 1}y${y - 1}`), 'live')) status++;
				if (c($(`#x${sizeX - 1}y${y}`), 'live')) status++;
				if (c($(`#x${x + 1}y${y}`), 'live')) status++;
				if (c($(`#x${sizeX - 1}y${y + 1}`), 'live')) status++;
				if (c($(`#x${x}y${y + 1}`), 'live')) status++;
				if (c($(`#x${x + 1}y${y + 1}`), 'live')) status++;
				checkStatus(status, x, y);
			}
			y++;
		}
		else if (el.id == `x${sizeX - 1}y${y}`) {

			if (el.id == `x${sizeX - 1}y0`) {
				let status = 0;
				if (c($(`#x${x - 1}y${sizeY - 1}`), 'live')) status++;
				if (c($(`#x${x}y${sizeY - 1}`), 'live')) status++;
				if (c($(`#x0y${sizeY - 1}`), 'live')) status++;
				if (c($(`#x${x - 1}y${y}`), 'live')) status++;
				if (c($(`#x0y${y}`), 'live')) status++;
				if (c($(`#x${x - 1}y${y + 1}`), 'live')) status++;
				if (c($(`#x${x}y${y + 1}`), 'live')) status++;
				if (c($(`#x0y${y + 1}`), 'live')) status++;
				checkStatus(status, x, y);
			}
			else if (el.id == `x${sizeX - 1}y${sizeY - 1}`) {
				let status = 0;
				if (c($(`#x${x - 1}y${y - 1}`), 'live')) status++;
				if (c($(`#x${x}y${y - 1}`), 'live')) status++;
				if (c($(`#x0y${y - 1}`), 'live')) status++;
				if (c($(`#x${x - 1}y${y}`), 'live')) status++;
				if (c($(`#x0y${y}`), 'live')) status++;
				if (c($(`#x${x - 1}y0`), 'live')) status++;
				if (c($(`#x${x}y0`), 'live')) status++;
				if (c($(`#x0y0`), 'live')) status++;
				checkStatus(status, x, y);
			}
			else {
				let status = 0;
				if (c($(`#x${x - 1}y${y - 1}`), 'live')) status++;
				if (c($(`#x${x}y${y - 1}`), 'live')) status++;
				if (c($(`#x0y${y - 1}`), 'live')) status++;
				if (c($(`#x${x - 1}y${y}`), 'live')) status++;
				if (c($(`#x0y${y}`), 'live')) status++;
				if (c($(`#x${x - 1}y${y + 1}`), 'live')) status++;
				if (c($(`#x${x}y${y + 1}`), 'live')) status++;
				if (c($(`#x0y${y + 1}`), 'live')) status++;
				checkStatus(status, x, y);
			}
			y++;
		} else {

			if (el.id == `x${x}y0`) {
				let status = 0;
				if (c($(`#x${x - 1}y${sizeY - 1}`), 'live')) status++;
				if (c($(`#x${x}y${sizeY - 1}`), 'live')) status++;
				if (c($(`#x${x + 1}y${sizeY - 1}`), 'live')) status++;
				if (c($(`#x${x - 1}y${y}`), 'live')) status++;
				if (c($(`#x${x + 1}y${y}`), 'live')) status++;
				if (c($(`#x${x - 1}y${y + 1}`), 'live')) status++;
				if (c($(`#x${x}y${y + 1}`), 'live')) status++;
				if (c($(`#x${x + 1}y${y + 1}`), 'live')) status++;
				checkStatus(status, x, y);
			}
			else if (el.id == `x${x}y${sizeY - 1}`) {
				let status = 0;
				if (c($(`#x${x - 1}y${y - 1}`), 'live')) status++;
				if (c($(`#x${x}y${y - 1}`), 'live')) status++;
				if (c($(`#x${x + 1}y${y - 1}`), 'live')) status++;
				if (c($(`#x${x - 1}y${y}`), 'live')) status++;
				if (c($(`#x${x + 1}y${y}`), 'live')) status++;
				if (c($(`#x${x - 1}y0`), 'live')) status++;
				if (c($(`#x${x}y0`), 'live')) status++;
				if (c($(`#x${x + 1}y0`), 'live')) status++;
				checkStatus(status, x, y);
			}
			else {
				let status = 0;
				if (c($(`#x${x - 1}y${y - 1}`), 'live')) status++;
				if (c($(`#x${x}y${y - 1}`), 'live')) status++;
				if (c($(`#x${x + 1}y${y - 1}`), 'live')) status++;
				if (c($(`#x${x - 1}y${y}`), 'live')) status++;
				if (c($(`#x${x + 1}y${y}`), 'live')) status++;
				if (c($(`#x${x - 1}y${y + 1}`), 'live')) status++;
				if (c($(`#x${x}y${y + 1}`), 'live')) status++;
				if (c($(`#x${x + 1}y${y + 1}`), 'live')) status++;
				checkStatus(status, x, y);
			}
			y++;
		}

		if (y == sizeY) {
			x++;
			y = 0;
		}
	});

	changeStatus();
	count++;
}

//---------------------------------------------


function checkStatus(status, x, y) {
	switch (status) {
		case 3:
			a($(`#x${x}y${y}`), 'tolive');
			break;
		case 2:
			break;
		default:
			a($(`#x${x}y${y}`), 'todead');
		//l('d');
	}
}

function changeStatus() {
	cellsArr.forEach(cell => {
		if (cell.classList.contains('tolive')) {
			a(cell, 'live');
			r(cell, 'tolive');
		};
		if (cell.classList.contains('todead')) {
			r(cell, 'live');
			r(cell, 'todead');
		};
	});
}



//a($('#x0y0'), 'live');
//l(c($('#x0y0'), 'live'));
//l(c($('#x0y1'), 'live'));




//----------------------------------------------------------------------
//----------------------------------------------------------------------
//----------------------------------------------------------------------
/*
let xxx = 9,
	yyy = 9;

let start = [];

for (let y = 0; y < yyy; y++) {
	let row = [];
	for (let x = 0; x < xxx; x++) {
		row.push(0);
	}
	start.push(row);
}




l(start);
l(start.length);



function changeArray(array, argument) {
	let x = 0, y = 0;
	while (y < yyy) {
		while (x < xxx) {
			array[x][y] = argument;
			x++;
		}
		x = 0;
		y++;
	}
}
changeArray(start, 1);
l(start);



*/