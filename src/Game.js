import {DisplacementAnimation, DynamicValue} from './Character.js'
import {DisappearingText} from './DisappearingText.js'


class Game { 
	
	constructor( grid ) {		
		this.hostileUnits=[];
		this.effects=[];
		
		if(grid)
		{
			this.grid = grid;
			this.grid.game = this;
		}
		
		this.animationPause=0;
		this.heroActive=true;

	  }  
	  
	  
	  
	  setHero(/*Unit*/ hero){
		  this.hero=hero;
	  }
	  
	  addHostile(/*Unit*/ unit){
		  this.hostileUnits.push(unit);
	  }
	  
	  addDT(/*Disappearing Text*/ txt){
		  this.effects.push(txt);
	  }
	  
	animateEffects(ctx){
		  
		for( let eff of this.effects){
			  
			  if(eff.draw(ctx))
			  {
				  let index = this.effects.indexOf(eff);
				  this.effects.splice(index, 1);
			  }			  
		}	  
	}
	  
	scheduleHostilesTurn(){
		  
		for( let unit of this.hostileUnits){
			  
			  unit.madeHisTurn=false;
			  
		}		  
		  
	}
	
	//return: boolean: all done?
	executeHostilesTurn(){
		  
		for( let unit of this.hostileUnits){
			  if(!unit.madeHisTurn)
			  {
				  this.pursueAndFight(unit);
				  unit.madeHisTurn=true;
				  return false;
			  }
			  
		}
		return true;		
		  
	}
	
	wonderingFightBack(/*Unit*/ unit){
		
		/*Hex[]*/ let possibleMoves = this.grid.getMovableHexes(unit);			  
			  
			  if(possibleMoves.length)	{	

			  //If hero is near, most likely attack!
				for( let hex of possibleMoves){
					  if(hex.content === this.hero){
						  if(Math.random() > 0.36){
							  this.grid.goTo(hex, unit);
							  return;
						  }
					  }				  
				  }
				  
				  //maybe do nothing?
				 if(Math.random() >0.50){ 
				 return;
				 } 
			  
			  //else lets get rolling
				let randomMove = possibleMoves[Math.floor(Math.random()*possibleMoves.length)];
				if(randomMove.content && this.hostileUnits.indexOf(randomMove.content)!=-1){
							 //maybe do nothing?
						 if(Math.random() >0.50){ 
							return;
						 }
						 //lets give him a chance, or else!
							randomMove = possibleMoves[Math.floor(Math.random()*possibleMoves.length)];
							
				}
				this.grid.goTo(randomMove, unit);			  
			}		
	}
	
	pursueAndFight(/*Unit*/ unit){
		/*Hex[]*/ let possibleMoves = this.grid.getMovableHexes(unit);			  
			  
			  if(possibleMoves.length)	{
					let closestToTarget = possibleMoves[0];
					let distToTarget = 	this.grid.GetHexDistance(closestToTarget,this.hero.hex)	;		  
					for( let hex of possibleMoves){
						  if(this.grid.GetHexDistance(hex,this.hero.hex)< distToTarget) {
							  
							  distToTarget = this.grid.GetHexDistance(hex,this.hero.hex);
							  closestToTarget = hex;							  
						  }				  
					}
					
					this.grid.goTo(closestToTarget, unit);			  
				  
			  }		
	}
		 
	
	processAttack(/*Unit */ attacker, /*Unit */ recipient){
		
		let dmg = recipient.recieveDamage(attacker.meleeDamage);
		
		let color = {R:255, G:120, B:120};
		let anim = new DisplacementAnimation( {x: recipient.hex.x-attacker.hex.x, y: recipient.hex.y-attacker.hex.y}, 105, true);
		this.addDT(
			new DisappearingText(dmg,
									recipient.hex.MidPoint.x+32, 
									recipient.hex.MidPoint.y-32, 
									60, new DynamicValue(45), 
									12, anim, color));
		
		if(recipient.HP.value<=0)
		{
			recipient.playSound('death', (0.5+0.5*dmg/recipient.HP.maxValue));
			recipient.hex.content=null;
			recipient.hex=null;

			if(recipient===this.hero){
				alert("you're dead. Try again.");
				window.location.reload(false);
			} else {
				let index = this.hostileUnits.indexOf(recipient);
				if (index > -1) {
					this.hostileUnits.splice(index, 1);
				}
			}			
		}	else {
			recipient.playSound('pain', (0.1+0.9*dmg/recipient.HP.maxValue));
		}	
	}
	
	refreshMovable(){
		this.grid.markGivenMovable(this.grid.getMovableHexes(this.hero));		
	}
	
	issueOrderGo(/*Hex */ hex){
		if(hex.movable){
			return this.grid.goTo(hex,this.hero);
		}
		return false;
	}
	
	timestep(ctx){
		
		this.animateEffects(ctx);
		if(this.animationPause>0){
			this.animationPause--;
			return;
		}
		
		if(!this.heroActive){
			if(this.executeHostilesTurn()){
				this.heroActive=true;
				this.refreshMovable(this.hero);
			}
		}		
				
	}	
}


export {Game};
