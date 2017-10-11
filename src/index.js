import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {getMousePos} from "./Utils"
import {Grid} from './Grid.js'
import {Hero} from './Character.js'
import {Game} from './Game.js'
import {BottomPanel} from './BottomPanel.js'
import {soundEngine} from './SoundEngine.js'
import {BattleView} from './BattleView.js'
import {heroParams, ghostParams} from './units/units.js'
import $ from 'jquery';


// export for others scripts to use
window.$ = $;

let img = document.getElementById('theHeroImg');
let img1 = document.getElementById('enemy');


let hero_move = document.getElementById("hero_move");
let hero_attack = document.getElementById("hero_attack");
let hero_pain = document.getElementById("hero_pain");
let hero_death = document.getElementById("hero_death");

let ghost_move = document.getElementById("ghost_move");
let ghost_attack = document.getElementById("ghost_attack");
let ghost_pain = document.getElementById("ghost_pain");
let ghost_death = document.getElementById("ghost_death");

let soundStep = document.getElementById("step");

let heroSoundDict = {
	attack: hero_attack,
	move: hero_move,
	pain: hero_pain,
	death: hero_death
};

let ghostSoundDict = {
	attack: ghost_attack,
	move: ghost_move,
	pain: ghost_pain,
	death: ghost_death
};


let canvasDraw = document.getElementById('drawing');
let canvasEffects = document.getElementById('effectsLayer');
let canvasUnits = document.getElementById('unitsLayer');
let canvasGrid = document.getElementById('gridLayer');

let debugInfo = document.getElementById('debugInfo');

let theGrid = new Grid(960, 500);
let game = new Game(theGrid);
game.battleView = new BattleView(canvasDraw, canvasGrid, canvasUnits, canvasEffects);


let theHero = new Hero(img, heroSoundDict, heroParams);
game.grid.placeUnit(game.grid.GetHexById("(2,4)"), theHero);
game.setHero(theHero);

let enemy = new Hero(img1, ghostSoundDict, ghostParams);
game.addHostile(enemy);
game.grid.placeUnit(game.grid.GetHexById("(5,5)"), enemy);

enemy = new Hero(img1, ghostSoundDict, ghostParams);
game.addHostile(enemy);
game.grid.placeUnit(game.grid.GetHexById("(5,3)"), enemy);

game.reactComponent = ReactDOM.render(
	<BottomPanel unit={game.hero} selectedUnit={game.hero}/>,
    document.getElementById('bottom-panel')
);


function init() {
  window.requestAnimationFrame(draw);
  game.refreshMovableForUnit(theHero);
}

function draw() {

    game.timestep();
  	window.requestAnimationFrame(draw);

}

init();

//selecting hexes and units to view
canvasDraw.addEventListener('mousemove', function(evt) {

    let mousePos = getMousePos(canvasDraw, evt);
    let oldHex = game.grid.selectedHex;
	let hex = game.grid.selectHex(mousePos.x, mousePos.y);
	if(hex!==oldHex){
		game.battleView.drawGrid(game.grid);
	}

	let aUnit = hex ? hex.content : null;
	if(aUnit && aUnit !== game.hero)
	{game.selectedUnit = aUnit;}

  }, false);

//left mouse click: move, attack
canvasDraw.addEventListener('click', function(evt) {
	  if(game.heroActive){

		let mousePos = getMousePos(canvasDraw, evt);
		game.grid.selectHex(mousePos.x, mousePos.y);
		game.issueOrderGo(game.grid.selectedHex);

		return false;
	  }

  }, false);


//key bindings to movement
document.onkeydown = function(evt) {
    if(game.heroActive){
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

        if(game.grid.goTo(hex, theHero)){
            game.heroActive=false;
            game.scheduleHostilesTurn();
            game.grid.makeMovable(null);
        }
    }

};



