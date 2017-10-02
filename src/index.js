import React from 'react';
import ReactDOM from 'react-dom';
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

var dmgIcon = document.getElementById("dmg_img");
var armorIcon1 = document.getElementById("A1");
var armorIcon2 = document.getElementById("A2");
var armorIcon3 = document.getElementById("A3");

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

var theGrid = new HT.Grid(960, 500);

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



class AttributeDisplay extends React.Component {
	constructor(props) {
			  super(props);
			  this.state = {
				img : props.img,
				num : props.num				
			  };
		}
	
	
		render() {
		return (<div className="board-row">
				  <img className="square" src={this.state.img} />
				  <div className="square"> {this.state.num} </div>
			</div>);
  }
}

class ArmorDisplay extends React.Component {
	constructor(props) {
				  super(props);
				  this.state = {
					armor : props.armor
				  };
			}
			
	render(){
		return(
		<div className="armor">
			<AttributeDisplay img={armorIcon1.source} num={this.state.armor.SLASH} />
			<AttributeDisplay img={armorIcon2.source} num={this.state.armor.PIERCE} />
			<AttributeDisplay img={armorIcon3.source} num={this.state.armor.MAGIC} />			
        </div>
		);
	}
}

class DamageDisplay extends React.Component {	
	constructor(props) {
			  super(props);
			  this.state = {
				damage : props.damage
			  };
		}

	
	render(){
		return(
		<div className="damage">
			<AttributeDisplay img={dmgIcon.source} 
			//<AttributeDisplay img={dmgImgs[this.state.damage.type]} 
								num={this.state.damage.amount} />					
        </div>
		);
	}
}

class UnitFace extends React.Component {	

	constructor(props) {
		  super(props);
		  this.state = {
			img : props.img,
			name : props.name ,
			HP : props.HP
		  };
	}
	
	render(){
		return(
		<div className="unit-face">
			<img
				src={this.state.img.source}
			/>
			<label> {this.state.name} </label>
			<progress value={this.state.HP.value} 
						max={this.state.HP.maxValue}> 
						</progress>
        </div>
		);
	}
}

class UnitStats extends React.Component {
	constructor(props) {
			  super(props);
			  this.state = {
				unit : props.unit
			  };
		}
	
	render(){
		if(this.state.unit){
		return(
		<div className="unit-stats">
				<UnitFace img = {this.state.unit.avatar} 
				name = "Helene"
				HP = {this.state.unit.HP}/>
				<DamageDisplay damage={this.state.unit.meleeDamage}/>
				<ArmorDisplay armor={this.state.unit.armor}/>
        </div>
		);
		}
		else{
			return (
			<div>
					UnitStats: no unit found	
			</div>);} 
	}
}


class BottomPanel extends React.Component {
	
	constructor(props) {
			  super(props);
			  this.state = {
				unit : props.unit
			  };
		}
	
  render() {	

	if (this.state.unit){
  
		return (
		  <div className="HeroView">
			<UnitStats unit={this.state.unit}/>
			//<UnitStats unit={game.selectedUnit}/>
		  </div>
	  );
  }
	else {
		return (
		<div className="HeroView">
			no unit found
		  </div>);
	}
  
  }
}

// ========================================

ReactDOM.render(
  <BottomPanel unit={game.hero}/>,
  document.getElementById('bottom-panel')
);



