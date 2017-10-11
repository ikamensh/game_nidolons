import {DisplacementAnimation, DynamicValue} from './Character.js'
import {DisappearingText} from './DisappearingText.js'


class Game { 
	
	constructor( grid ) {		
		this.hostileUnits=[];
		this.allObjects=[];
		this.effects=[];
		
		if(grid)
		{
			this.grid = grid;
			this.grid.game = this;
		}
		
		this.animationPause=0;
		this.heroActive=true;

	  }  
	  
	processDeath(/*Unit*/ unit){
	  
		unit.hex.content=null;
		unit.hex=null;
		unit.game=null;
		
		  
		let index = this.allObjects.indexOf(unit);
				if (index > -1) {
					this.allObjects.splice(index, 1);
				}
				
		if(unit===this.hero){
				alert("you're dead. Try again.");
				window.location.reload(false);
			}
				
		index = this.hostileUnits.indexOf(unit);
				if (index > -1) {
					this.hostileUnits.splice(index, 1);
				}
	  
	}	  
	  
	  
	  setHero(/*Unit*/ hero){
			this.hero=hero;
			this.allObjects.push(hero);
			hero.game= this;		  
	  }
	  
	  addHostile(/*Unit*/ unit){
		  this.hostileUnits.push(unit);
		  this.allObjects.push(unit);
		  unit.game= this;	
	  }
	  
	  addEffect(/*Disappearing Text*/ effect){
		  this.effects.push(effect);
	  }
	  
	animateEffects(ctx){
		for( let /*Effect*/eff of this.effects){
			  if(eff.draw(ctx)) //true when effect is over
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
				if(randomMove.content && this.hostileUnits.indexOf(randomMove.content)!==-1){
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
		
		let recipientHex = recipient.hex;
		let dmg = recipient.recieveDamage(attacker.dealDamage());
		
		let color = {R:255, G:120, B:120};
		let anim = new DisplacementAnimation( {x: recipientHex.x-attacker.hex.x, y: recipientHex.y-attacker.hex.y}, 105, true);
		this.addEffect(
			new DisappearingText(dmg,
									recipientHex.MidPoint.x+32, 
									recipientHex.MidPoint.y-32, 
									60, new DynamicValue(45), 
									12, anim, color));						
	
	}

	refreshMovable(/*Array <Hex>*/ movable){
		this.grid.makeMovable(movable);
		this.battleView.drawGrid(this.grid);
	}

	refreshMovableForUnit(/*Hero */ unit){
        this.refreshMovable(this.grid.getMovableHexes(unit));
	}
	
	issueOrderGo(/*Hex */ hex){
		if(hex.movable){
			if(this.grid.goTo(hex,this.hero)){
                this.heroActive=false;
                this.scheduleHostilesTurn();
                this.refreshMovable(null);
			}
		}
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
				this.refreshMovable(this.grid.getMovableHexes(this.hero));
			}
		}		
				
	}	
}


export {Game};
