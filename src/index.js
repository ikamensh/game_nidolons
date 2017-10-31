import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {getMousePos} from "./utils/Utils"
import {Grid} from './battle_system/Grid.js'
import {Unit} from './battle_system/Character.js'
import {Game} from './Game.js'
import {BottomPanel} from './GUI/BottomPanel.js'
import {BattleView} from './GUI/BattleView.js'
import {heroParams} from "./units/tomb_ride/Helene"
import {ghostParams} from "./units/tomb_ride/Ghost"
import {pirateParams} from "./units/tomb_ride/Pirate"


function addUnit(params, column, row){
    let unit = new Unit(params);
    game.grid.placeUnit(game.grid.getHex(column, row), unit);
    return unit;
}

function init() {
    window.requestAnimationFrame(draw);
    game.animationPause=5; //let time for images to load
    game.battleView = new BattleView(canvasDraw, canvasGrid, canvasUnits, canvasEffects);

    game.setHero(addUnit(heroParams,2,2));
    game.addHostile(addUnit(ghostParams,4,4));
    game.addHostile(addUnit(ghostParams,5,3));
    game.addHostile(addUnit(pirateParams,0,0));

    game.init();

}

function draw() {

    game.timestep();
    window.requestAnimationFrame(draw);
    debugInfo.innerHTML = canvasGrid.getContext('2d').strokeStyle;
    debugInfo.innerHTML += '\n';
    debugInfo.innerHTML += canvasGrid.getContext('2d').lineWidth;

}


let canvasDraw = document.getElementById('drawing');
let canvasEffects = document.getElementById('effectsLayer');
let canvasUnits = document.getElementById('unitsLayer');
let canvasGrid = document.getElementById('gridLayer');

let debugInfo = document.getElementById('debugInfo');

let theGrid = new Grid(960, 500);
let game = new Game(theGrid);

game.reactComponent = ReactDOM.render(
    <BottomPanel unit={game.hero} selectedUnit={game.hero} setActiveAbility={abil => game.setAbilityBeingTargeted(abil)}/>,
    document.getElementById('bottom-panel')
);

init();

//selecting hexes and units to view
canvasDraw.addEventListener('mousemove', function (evt) {

    let mousePos = getMousePos(canvasDraw, evt);

    let oldHex = game.grid.selectedHex;
    let hex = game.grid.selectHex(mousePos.x, mousePos.y);
    if (hex !== oldHex) {
        game.battleView.drawGrid(game.grid);
    }

    let aUnit = hex ? hex.content : null;
    if (aUnit && aUnit !== game.hero) {
        game.selectedUnit = aUnit;
    }

}, false);

//left mouse click: move, attack
canvasDraw.addEventListener('click', function (evt) {

    let mousePos = getMousePos(canvasDraw, evt);
    game.handleLeftClick(mousePos);


}, false);


//key bindings to movement
document.onkeydown = function (evt) {
    if (game.heroActive) {
        evt = evt || window.event;
        if(game.issueOrderGo(mapKeycodeToDirection(evt.keyCode,game.hero.hex), game.hero)){
            game.heroActive=false;
        }
    }

};

function mapKeycodeToDirection(keyCode, hex){

    let newHex = null;

    //q
    if (keyCode === 81) {
        newHex = game.grid.moveNW(hex);
    }

    //w
    if (keyCode === 87) {
        newHex = game.grid.moveN(hex);
    }

    //e
    if (keyCode === 69) {
        newHex = game.grid.moveNE(hex);
    }

    //a
    if (keyCode === 65) {
        newHex = game.grid.moveSW(hex);
    }

    //s
    if (keyCode === 83) {
        newHex = game.grid.moveS(hex);
    }

    //d
    if (keyCode === 68) {
        newHex = game.grid.moveSE(hex);
    }
    return newHex;
}



