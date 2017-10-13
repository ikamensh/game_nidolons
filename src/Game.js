import {DynamicValue} from './battle_system/DynamicValue.js'
import {DisappearingText} from './GUI/DisappearingText.js'
import {AI} from "./battle_system/AI"
import {DisplacementAnimation, DelayedDisplacementAnimation} from "./GUI/DisplacementAnimation";

/*
Game is the highest level abstraction of the battlefield and everything happening on it - graphics, sounds and combat logic.
Before special graphics and sound classes are created, those belong here.

 */
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
		this.abilityBeingTargeted=null;

	  }

	  setAbilityBeingTargeted(/*Ability*/ ability){
          this.abilityBeingTargeted=ability;
	  }


	  handleLeftClick(mousePos){
          if (this.heroActive) {


              this.grid.selectHex(mousePos.x, mousePos.y);
              if(this.abilityBeingTargeted){
              	 if(this.grid.selectedHex.content){
					 this.issueOrderUseTargetUnitAbility(this.hero, this.abilityBeingTargeted, this.grid.selectedHex.content);
                     this.endTurn();
              	 }
              	 this.abilityBeingTargeted=null;
			  } else {
                  this.issueOrderGo(this.grid.selectedHex);
              }

              return false;
          }
	  }

	  endTurn(){
          this.heroActive=false;
          this.scheduleHostilesTurn();
          this.refreshMovable(null);
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
	
	//return: boolean: all hostiles made their turn
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
        let attackerHex = attacker.hex;

        attacker.animation = new DisplacementAnimation( /*Point*/ { x:(recipientHex.x-attackerHex.x)/4, y: (recipientHex.y-attackerHex.y)/4}, 12, false);
		let dmgDealt = this.processDamage(attacker.dealDamage(), attackerHex, recipient);
        attacker.playSound('attack', Math.min(1, dmgDealt/recipient.HP.maxValue));
	
	}

	processDamage(/*Damage */ dmg, /*hex*/ comingFrom, /*Unit*/ target) {

        let recipientHex = target.hex;
        let dmgDealt = target.recieveDamage(dmg);
        if (dmgDealt / target.HP.maxValue>0.4) {
			target.playSound('pain', Math.min(1, dmgDealt/target.HP.maxValue))
			target.animation = new DelayedDisplacementAnimation(/*Point*/ {
				x: (recipientHex.x - comingFrom.x) / 6,
				y: (recipientHex.y - comingFrom.y) / 6
			}, 14, false, 10);
    	}

        let color = {R:255, G:120, B:120};
        let anim = new DisplacementAnimation( {x: recipientHex.x-comingFrom.x, y: recipientHex.y-comingFrom.y}, 105, true);
        this.addEffect(
            new DisappearingText(dmgDealt,
                recipientHex.MidPoint.x+32,
                recipientHex.MidPoint.y-32,
                60, new DynamicValue(45),
                12, anim, color));

        return dmgDealt;

	}

	checkTargetedAbility(/* AbilityDealDmg*/ ability, /*Unit*/ source, /*Unit*/ target){
		if(source.mana < ability.manacost){
			return false;
		} else if(this.grid.getHexDistance(source.hex, target.hex) > ability.range) {
			return false;
		}
		return true;
	}

	processTargetDamageAbility(/* AbilityDealDmg*/ ability, /*Unit*/ source, /*Unit*/ target){
		source.mana -= ability.manacost;
		this.processDamage(ability.dmg, source.hex, target);

	}

	issueOrderUseTargetUnitAbility(/*Unit*/ user, /*Ability*/ ability, /*Unit*/ target){
		if(this.checkTargetedAbility(ability, user, target)){
			this.processTargetDamageAbility(ability, user, target);
		}
	}



	refreshMovable(/*Array <Hex>*/ movable){
		this.grid.makeMovable(movable);
		this.battleView.drawGrid(this.grid);
	}

	refreshMovableForUnit(/*Unit */ unit){
        this.refreshMovable(this.grid.getMovableHexes(unit));
	}
	
	issueOrderGo(/*Hex */ hex){
		if(hex.movable){
			if(this.grid.goTo(hex,this.hero)){
                this.endTurn();
			}
		}
	}
	
	timestep(){


        //TODO this.battleView.drawGrid(this.grid); - stops grid flickering! - but is unnecessary and costly!
        //this.battleView.drawGrid(this.grid); //remnants of the war of the days past
        this.effects = this.battleView.drawEffects(this.effects);


        if(this.reactComponent)
        {
            this.reactComponent.update(this.hero, this.selectedUnit);
        }

		if(this.animationPause>=0){

            this.battleView.drawUnits(this.allObjects);
			this.animationPause--;

		} else if(!this.heroActive){
			if(this.executeHostilesTurn()){
				this.heroActive=true;
				this.refreshMovableForUnit((this.hero));
			}
		}		
				
	}	
}


export {Game};
