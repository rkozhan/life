"use strict";

const state = {
    play: false,
    sizeX: 100,
    sizeY: 100,
    preset: 'random',
    density: 10,
    gameSpeed: 150,
};

let generation = 0;
const field = document.querySelector('.field');
const fieldCollection = [];
let previousState = [];

window.onload = init();
async function init() {
    await fillField();
    mapField();
    checkForm();
    checkMenu();
}

function updatePreviousState (currentState = []) {
    previousState = [];
    if (currentState.length === 0) {        
        for (let y = 0; y < state.sizeY; y++) {
            previousState.push([]);
            for (let x = 0; x < state.sizeX; x++) {
                previousState[y].push(false);
            }
        }
    } else {        
        currentState.map(row => {
            const newRow = [];
            row.map(el => newRow.push(el));
            previousState.push(newRow);
        })
    }
}

 function fillField () {
    field.innerHTML = '';
    field.style.aspectRatio = `${state.sizeX} / ${state.sizeY}`;

    for (let y = 0; y < state.sizeY; y++) {
        const rowCollection =[];
        for (let x = 0; x < state.sizeX; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.width =  `calc(100% / ${state.sizeX})`
            rowCollection.push(cell);
            field.appendChild(cell);
        }
        fieldCollection.push(rowCollection);
    }
    updatePreviousState();
}

async function mapField(preset = []) {
    for (let y = 0; y < fieldCollection.length; y++) {
        for (let x = 0; x < fieldCollection[0].length; x++) {
            let alive = false;
            if (preset.length > 0) {
                alive = (y < preset.length && x < preset[y].length) ?
                    preset[y][x] : false;
            } else {
                alive = getRandom(state.density) === 0;
            }
            previousState[y][x] = alive;

            if (alive) fieldCollection[y][x].classList.add('alive');
            else fieldCollection[y][x].classList.remove('alive');
        }
    }
};

async function checkForm () {
    const form = document.querySelector('form');
    const selectorY = form.querySelector('#sizeY'),
        selectorX = form.querySelector('#sizeX'),
        preset = form.querySelector('#preset');
        

    form.addEventListener('submit', e => {
        e.preventDefault();
        state.play = false;
        generation = 0;
        state.preset = preset.value;

        if (selectorY.value != state.sizeY && selectorX.value != state.sizeX) {
            state.sizeY = selectorY.value;
            state.sizeX = selectorX.value;
            fillField ();
        }

        if (state.preset === 'glider') {
            mapField(presets.glider);
            updatePreviousState(currentState);
        }
        else mapField();
    });
}

function checkMenu () {
    const next = document.querySelector('#nextGen');
    next.addEventListener('click',  changeGeneration);

    const start = document.querySelector('#start');
    start.addEventListener('click', () => {
        state.play = !state.play;

        start.textContent = state.play ? "Pause" : "Start";
        autoChangeGeneration();
    });
}

function updateCounts(gen) {
    document.querySelector('#counter').textContent = gen;
}

function getRandom(max) {
	return Math.floor(Math.random() * max);
}

function autoChangeGeneration () {

    if (state.play) {
        changeGeneration();
        setTimeout(autoChangeGeneration, state.gameSpeed);
    }
}

function changeGeneration () {
    let currentState =[], anyChanges = false;

    for (let y = 0; y < previousState.length; y++) {
        currentState.push([]);
        for (let x = 0; x < previousState[0].length; x++) {
            let hoods = 0;

            const minY = y === 0 ?  previousState.length-1 : y -1,
            maxY = y === previousState.length-1 ? 0 : y + 1,
            minX = x === 0 ? previousState[0].length-1 : x -1,
            maxX = x === previousState[0].length-1 ? 0 : x + 1;
            if (previousState[minY][minX]) hoods++;
            if (previousState[y][minX]) hoods++;
            if (previousState[maxY][minX]) hoods++;
            if (previousState[minY][x]) hoods++;
            if (previousState[maxY][x]) hoods++;
            if (previousState[minY][maxX]) hoods++;
            if (previousState[y][maxX]) hoods++;
            if (previousState[maxY][maxX]) hoods++;

            currentState[y].push(hoods === 3 || (hoods === 2 && previousState[y][x]));
            
            if (currentState[y][x] != previousState[y][x]) anyChanges = true;
        }
    }

    if(!anyChanges) state.play = false;

    mapField(currentState);
    updatePreviousState(currentState);
    updateCounts(++generation);
} 

const presets = {
    glider: [[false,false,true],[true,false,true],[false,true,true]],
}