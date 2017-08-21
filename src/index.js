import './index.css';
import {HT} from './grid.js'
import {Hero} from './Character.js'
import {Game} from './Game.js'
import {SoundEngine} from './SoundEngine.js'
import {heroParams, ghostParams} from './units/units.js'
import $ from 'jquery';


// export for others scripts to use
window.$ = $;

var img = document.getElementById('theHeroImg');
var img1 = document.getElementById('enemy');

var hero_move = document.getElementById("hero_move");
var hero_attack = document.getElementById("hero_attack");
var hero_pain = document.getElementById("hero_pain");
var hero_death = document.getElementById("hero_death");

var ghost_move = document.getElementById("ghost_move");
var ghost_attack = document.getElementById("ghost_attack");
var ghost_pain = document.getElementById("ghost_pain");
var ghost_death = document.getElementById("ghost_death");

var soundStep = document.getElementById("step");

var heroSoundDict = {
	attack: hero_attack,
	move: hero_move,
	pain: hero_pain,
	death: hero_death
}

var ghostSoundDict = {
	attack: ghost_attack,
	move: ghost_move,
	pain: ghost_pain,
	death: ghost_death
}

var dx = 110.8512517;
var dy = 128;

var canvas = document.getElementById('unitsLayer');
var ctx = canvas.getContext('2d');  

var canvasGrid = document.getElementById('grid');
var ctxGrid = canvasGrid.getContext('2d');

var debugInfo = document.getElementById('debugInfo');

var theGrid = new HT.Grid(960, 600);

var game = new Game(theGrid);


var theHero = new Hero(img, heroSoundDict, heroParams);
game.grid.placeUnit(game.grid.GetHexById("(2,4)"), theHero);
game.setHero(theHero);

var enemy = new Hero(img1, ghostSoundDict, ghostParams);
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
  
  
    for(let hex of game.grid.Hexes)
  {
	  
	  
		hex.draw(ctx);
		ctxGrid.drawImage(canvas,0,0);
		ctx.clearRect(0, 0, 960, 600);  
	  
  }
  
  for(let hex of game.grid.Hexes)
  {	  
	  if(hex.content)
	  {
		hex.content.draw(ctx);
		ctxGrid.drawImage(canvas,0,0);
		ctx.clearRect(0, 0, 960, 600);
	  } 	
	  
  }
  

  game.timestep(ctx);
  ctxGrid.globalCompositeOperation = 'source-over';
  ctxGrid.drawImage(canvas,0,0);
  ctx.clearRect(0, 0, 960, 600);
  
  window.requestAnimationFrame(draw);
  debugInfo.innerHTML= theHero.x+" "+theHero.y
}

init();

document.onkeydown = function(evt) {
	if(game.heroActive){
		evt = evt || window.event;
		
		let hex = null;
		//q
		if (evt.keyCode == 81) {
			hex = game.grid.moveUnitNW(theHero);		
		}
		
		//w
		if (evt.keyCode == 87) {
			hex = game.grid.moveUnitN(theHero);
		}
		
		//e
		if (evt.keyCode == 69) {
			hex = game.grid.moveUnitNE(theHero);	
		}
		
		//a
		if (evt.keyCode == 65) {
			hex = game.grid.moveUnitSW(theHero);
		}
		
		//s
		if (evt.keyCode == 83) {
			hex = game.grid.moveUnitS(theHero);
		}
		
		//d
		if (evt.keyCode == 68) {
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
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  
  canvasGrid.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvasGrid, evt);
	game.grid.selectHex(mousePos.x+15, mousePos.y+15);
    console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
  }, false);
  
  canvasGrid.addEventListener('click', function(evt) {
	  if(game.heroActive){
		var mousePos = getMousePos(canvasGrid, evt);
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
