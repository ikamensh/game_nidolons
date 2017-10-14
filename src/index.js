import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {getMousePos} from "./utils/Utils"
import {Grid} from './battle_system/Grid.js'
import {Unit} from './battle_system/Character.js'
import {Game} from './Game.js'
import {BottomPanel} from './GUI/BottomPanel.js'
import {soundEngine} from './utils/SoundEngine.js'
import {BattleView} from './GUI/BattleView.js'
import {heroParams} from "./units/tomb_ride/Helene"
import {ghostParams} from "./units/tomb_ride/Ghost"
import {pirateParams} from "./units/tomb_ride/Pirate"
import $ from 'jquery';
import {createSoundDict} from "./utils/Utils"

// export for others scripts to use
window.$ = $;


let canvasDraw = document.getElementById('drawing');
let canvasEffects = document.getElementById('effectsLayer');
let canvasUnits = document.getElementById('unitsLayer');
let canvasGrid = document.getElementById('gridLayer');

let debugInfo = document.getElementById('debugInfo');

let theGrid = new Grid(960, 500);
let game = new Game(theGrid);
game.animationPause=5; //let time for images to load
game.battleView = new BattleView(canvasDraw, canvasGrid, canvasUnits, canvasEffects);


let theHero = new Unit(heroParams);
game.grid.placeUnit(game.grid.getHexById("(2,4)"), theHero);
game.setHero(theHero);

let enemy = new Unit(ghostParams);
game.addHostile(enemy);
game.grid.placeUnit(game.grid.getHexById("(5,5)"), enemy);

enemy = new Unit(ghostParams);
game.addHostile(enemy);
game.grid.placeUnit(game.grid.getHexById("(5,3)"), enemy);

enemy = new Unit(pirateParams);
game.addHostile(enemy);
game.grid.placeUnit(game.grid.getHexById("(1,1)"), enemy);

game.reactComponent = ReactDOM.render(
    <BottomPanel unit={game.hero} selectedUnit={game.hero} setActiveAbility={abil => game.setAbilityBeingTargeted(abil)}/>,
    document.getElementById('bottom-panel')
);


function init() {
    window.requestAnimationFrame(draw);
    game.refreshMovableForUnit(theHero, 1);
}

function draw() {

    game.timestep();
    window.requestAnimationFrame(draw);
    debugInfo.innerHTML = canvasGrid.getContext('2d').strokeStyle;
    debugInfo.innerHTML += '\n';
    debugInfo.innerHTML += canvasGrid.getContext('2d').lineWidth;

}

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

        let hex = null;

        //q
        if (evt.keyCode === 81) {
            hex = game.grid.moveUnitNW(theHero);
        }

        //w
        if (evt.keyCode === 87) {
            hex = game.grid.moveUnitN(theHero);
        }

        //e
        if (evt.keyCode === 69) {
            hex = game.grid.moveUnitNE(theHero);
        }

        //a
        if (evt.keyCode === 65) {
            hex = game.grid.moveUnitSW(theHero);
        }

        //s
        if (evt.keyCode === 83) {
            hex = game.grid.moveUnitS(theHero);
        }

        //d
        if (evt.keyCode === 68) {
            hex = game.grid.moveUnitSE(theHero);
        }

        if (game.grid.goTo(hex, theHero)) {
            game.heroActive = false;
            game.scheduleHostilesTurn();
            game.grid.makeMovable(null);
        }
    }

};



