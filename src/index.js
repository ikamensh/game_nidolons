import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {HT} from './grid.js'
import {Hero} from './Character.js'
import {Game} from './Game.js'
import {BottomPanel} from './BottomPanel.js'
import {SoundEngine} from './SoundEngine.js'
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


let canvas = document.getElementById('unitsLayer');
let ctx = canvas.getContext('2d');

let canvasGrid = document.getElementById('grid');
let ctxGrid = canvasGrid.getContext('2d');

let debugInfo = document.getElementById('debugInfo');

let theGrid = new HT.Grid(960, 500);

let game = new Game(theGrid);


let theHero = new Hero(img, heroSoundDict, heroParams);
game.grid.placeUnit(game.grid.GetHexById("(2,4)"), theHero);
game.setHero(theHero);

let enemy = new Hero(img1, ghostSoundDict, ghostParams);
game.addHostile(enemy);
game.grid.placeUnit(game.grid.GetHexById("(5,5)"), enemy);

enemy = new Hero(img1, ghostSoundDict, ghostParams);
game.addHostile(enemy);
game.grid.placeUnit(game.grid.GetHexById("(5,3)"), enemy);

function init() {
  window.requestAnimationFrame(draw);
  game.refreshMovable(theHero);
}

function draw() {  

	ctx.globalCompositeOperation = 'destination-over';
	ctx.clearRect(0, 0, 960, 600);
	ctxGrid.globalCompositeOperation = 'destination-over';
	ctxGrid.clearRect(0, 0, 960, 600);
  
  //draw hex field
    for(let hex of game.grid.Hexes) { 
	  
		hex.draw(ctx);
		ctxGrid.drawImage(canvas,0,0);
		ctx.clearRect(0, 0, 960, 600);   
  }
  
  //draw units
  for(let obj of game.allObjects)
  {	  
		obj.draw(ctx);
		ctxGrid.drawImage(canvas,0,0);
		ctx.clearRect(0, 0, 960, 600);  
  }
  
	//also renders effects
  game.timestep(ctx);  
  ctxGrid.globalCompositeOperation = 'source-over';
  ctxGrid.drawImage(canvas,0,0);
  ctx.clearRect(0, 0, 960, 600);
  if(game.reactComponent)
  {
	  game.reactComponent.update(game.hero, game.selectedUnit);
  }
  
  window.requestAnimationFrame(draw);
  debugInfo.innerHTML= theHero.x+" "+theHero.y
}

init();

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
			game.grid.markGivenMovable(null);
		}
	}
	
};


function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  
  canvasGrid.addEventListener('mousemove', function(evt) {
    let mousePos = getMousePos(canvasGrid, evt);
	let aUnit = game.grid.selectHex(mousePos.x+15, mousePos.y+15);
	if(aUnit && aUnit !== game.hero)
	{game.selectedUnit = aUnit;}
    console.log('Found at' + mousePos.x + ',' + mousePos.y +':' +game.selectedUnit);
  }, false);
  
  canvasGrid.addEventListener('click', function(evt) {
	  if(game.heroActive){
		let mousePos = getMousePos(canvasGrid, evt);
		game.grid.selectHex(mousePos.x+15, mousePos.y+15);
		
		if(game.issueOrderGo(game.grid.selectedHex)){
			game.heroActive=false;
			game.scheduleHostilesTurn();
			game.grid.markGivenMovable(null);
		}
		
		  return false;
	  }

  }, false);

// ======================================





// ========================================

game.reactComponent = ReactDOM.render(
  <BottomPanel unit={game.hero} selectedUnit={game.hero}/>,
  document.getElementById('bottom-panel')
);



