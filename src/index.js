import './index.css';
import {HT} from './grid.js'
import {Hero} from './Character.js'
import {Game} from './Game.js'
import {SoundEngine} from './SoundEngine.js'

var img = document.getElementById('theHeroImg');
var img1 = document.getElementById('enemy1');

var soundClash = document.getElementById("clash");
var soundStep = document.getElementById("step");

var dx = 110.8512517;
var dy = 128;



var canvas = document.getElementById('unitsLayer');
var ctx = canvas.getContext('2d');

var canvasGrid = document.getElementById('grid');
var ctxGrid = canvasGrid.getContext('2d');

var debugInfo = document.getElementById('debugInfo');

var gridMaybe = new HT.Grid(960, 600);

var soundsAssets = {};
soundsAssets['clash']=soundClash;
soundsAssets['step']=soundStep;
var soundEngine = new SoundEngine( soundsAssets );

var game = new Game(gridMaybe, soundEngine);


var theHero = new Hero(img);
gridMaybe.placeUnit(gridMaybe.GetHexById("(2,4)"), theHero);
game.setHero(theHero);

var enemy1 = new Hero(img1);
game.addHostile(enemy1);
gridMaybe.placeUnit(gridMaybe.GetHexById("(5,5)"), enemy1);

enemy1 = new Hero(img1);
game.addHostile(enemy1);
gridMaybe.placeUnit(gridMaybe.GetHexById("(5,3)"), enemy1);

function init() {
  window.requestAnimationFrame(draw);
  game.refreshMovable(theHero);
}

function draw() {  

	ctx.globalCompositeOperation = 'destination-over';
	ctx.clearRect(0, 0, 960, 600);
	ctxGrid.globalCompositeOperation = 'destination-over';
	ctxGrid.clearRect(0, 0, 960, 600);
  
  
  for(let hex of gridMaybe.Hexes)
  {
	  if(hex.content)
	  {
		hex.draw(ctx);
		ctxGrid.drawImage(canvas,0,0);
		ctx.clearRect(0, 0, 960, 600);
	  } else {
		hex.draw(ctxGrid);
	  }
  }

  window.requestAnimationFrame(draw);
  debugInfo.innerHTML= theHero.x+" "+theHero.y
}

init();

function myFunction(){
	alert("wow");
}

function myHeroWasClicked(){
	alert("got_clicked!");
}


document.onkeydown = function(evt) {
    evt = evt || window.event;
    
	let hex = null;
	//q
	if (evt.keyCode == 81) {
		hex = gridMaybe.moveUnitNW(theHero);		
    }
	
	//w
	if (evt.keyCode == 87) {
		hex = gridMaybe.moveUnitN(theHero);
    }
	
	//e
	if (evt.keyCode == 69) {
		hex = gridMaybe.moveUnitNE(theHero);	
    }
	
	//a
	if (evt.keyCode == 65) {
		hex = gridMaybe.moveUnitSW(theHero);
    }
	
	//s
	if (evt.keyCode == 83) {
		hex = gridMaybe.moveUnitS(theHero);
    }
	
	//d
	if (evt.keyCode == 68) {
		hex = gridMaybe.moveUnitSE(theHero);
    }
	if(gridMaybe.goTo(hex, theHero)){
		game.executeHostilesTurn();
	}
	
	game.refreshMovable(theHero);
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
	gridMaybe.selectHex(mousePos.x+15, mousePos.y+15);
    console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
  }, false);
  
  canvasGrid.addEventListener('click', function(evt) {
    var mousePos = getMousePos(canvasGrid, evt);
	gridMaybe.selectHex(mousePos.x+15, mousePos.y+15);
	if(game.issueOrderGo(gridMaybe.selectedHex)){
		game.executeHostilesTurn();
	}
	
	game.refreshMovable(theHero);

  }, false);

// ======================================
