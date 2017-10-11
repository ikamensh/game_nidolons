import {DisplacementAnimation, DynamicValue} from './Character.js'
import {DisappearingText} from './DisappearingText.js'
import {AI} from "./AI"


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
				  let hex = AI.pursueAndFight(unit, this.grid, this.hero);
                  if(hex){
                      this.grid.goTo(hex, unit);
                  }
				  unit.madeHisTurn=true;
				  return false;
			  }
			  
		}
		return true;		
		  
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
	
	timestep(){



        this.battleView.drawUnits(this.allObjects);
        this.effects = this.battleView.drawEffects(this.effects);

        if(this.reactComponent)
        {
            this.reactComponent.update(this.hero, this.selectedUnit);
        }

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
