import {DynamicValue} from './battle_system/DynamicValue.js'
import {DisappearingText} from './GUI/DisappearingText.js'
import {AI} from "./battle_system/AI"
import {DisplacementAnimation, DelayedDisplacementAnimation} from "./GUI/DisplacementAnimation";
import deadIcon from "./res/icons/dead.png"
import {createImage} from "./utils/Utils"
import {AtbController} from "./gameControllers/AtbController";

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

	  init(){
	    this.atbController=new AtbController(this.allObjects);
	    this.heroActive=false;
      }

	  setAbilityBeingTargeted(/*Ability*/ ability){

		if(ability){
            if(this.hero.mana.value < ability.manacost){
                this.abilityBeingTargeted=null;
                return;
            }
            this.abilityBeingTargeted=ability;
            this.refreshMovableForUnit((this.hero), ability.range);
		} else {
			this.abilityBeingTargeted=null;
            this.refreshMovableForUnit((this.hero), 1);
		}

	  }


	  handleLeftClick(mousePos){
          if (this.heroActive) {


              let hex = this.grid.selectHex(mousePos.x, mousePos.y);
              if(!hex){
                  return false;
              }
              if(this.abilityBeingTargeted){
              	 if(hex.content){
					 if(this.issueOrderUseTargetUnitAbility(this.hero, this.abilityBeingTargeted, hex.content)){
                         this.heroActive=false;
					 }
              	 }
                  this.setAbilityBeingTargeted(null)
			  } else {
                  if(this.issueOrderGo(hex, this.hero)){
                      this.heroActive=false;
                  }
              }
          }
	  }

	  
	processDeath(/*Unit*/ unit){
	  
		unit.hex.content=null;
		unit.picsrc=deadIcon;
        unit.avatar=createImage(deadIcon);

        this.atbController.removeUnit(unit);
		  
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


	executeHostileTurn(/*Unit*/ unit){
        let hex = AI.pursueAndFight(unit, this.grid, this.hero);
        if(hex){
            return this.issueOrderGo(hex, unit);
        }
        return false;
    }
	

		 
	
	processAttack(/*Unit */ attacker, /*Unit */ recipient){

        let recipientHex = recipient.hex;
        let attackerHex = attacker.hex;

        attacker.animation = new DisplacementAnimation( /*Point*/ { x:(recipientHex.x-attackerHex.x)/4, y: (recipientHex.y-attackerHex.y)/4}, 12, false);
		let dmgDealt = this.processDamage(attacker.dealDamage(), attackerHex, recipient);
        attacker.playSound('attack', Math.min(1, dmgDealt/recipient.HP.maxValue));
        this.animationPause=15;
	
	}

	processDamage(/*Damage */ dmg, /*hex*/ comingFrom, /*Unit*/ target) {

        let recipientHex = target.hex;
        let dmgDealt = target.recieveDamage(dmg);
        if (dmgDealt / target.HP.maxValue>0.4) {
			target.playSound('pain', Math.min(1, dmgDealt/target.HP.maxValue))
			target.animation = new DelayedDisplacementAnimation(/*Point*/ {
				x: (recipientHex.x - comingFrom.x) / 3,
				y: (recipientHex.y - comingFrom.y) / 3
			}, 5, false, 10);
    	}

        let color = {R:255, G:120, B:120};
        let anim = new DisplacementAnimation( {x: recipientHex.x-comingFrom.x, y: recipientHex.y-comingFrom.y}, 105, true);
        this.addEffect(
            new DisappearingText(dmgDealt,
                recipientHex.MidPoint.x+32,
                recipientHex.MidPoint.y-32,
                60, new DynamicValue(45),
                12, anim, color));

        this.animationPause=12;

        return dmgDealt;

	}

	checkTargetedAbility(/* AbilityDealDmg*/ ability, /*Unit*/ source, /*Unit*/ target){
		return this.grid.getHexDistance(source.hex, target.hex) <= ability.range;
	}

	processTargetDamageAbility(/* AbilityDealDmg*/ ability, /*Unit*/ source, /*Unit*/ target){
		source.mana.value -= ability.manacost;
		source.needsRedraw=true;
		this.processDamage(ability.dmg, source.hex, target);

		source.atbReadiness-=1;
        this.atbController.processAtbRelevantEvent();

	}

	issueOrderUseTargetUnitAbility(/*Unit*/ user, /*Ability*/ ability, /*Unit*/ target){
		if(this.checkTargetedAbility(ability, user, target)){
			this.processTargetDamageAbility(ability, user, target);
			return true;
		}
		return false;
	}



	refreshMovable(/*Array <Hex>*/ movable){
		this.grid.makeMovable(movable);
		this.battleView.drawGrid(this.grid);
	}

	refreshMovableForUnit(/*Unit */ unit, /*int*/ distance){
        this.refreshMovable(this.grid.getMovableHexes(unit, distance));
	}
	
	issueOrderGo(/*Hex */ hex, /*Unit*/ unit){
		if(hex && this.grid.getHexDistance(hex,unit.hex)<=1){
			if( this.grid.goTo(hex, unit)){
			    unit.atbReadiness-=1;
                this.atbController.processAtbRelevantEvent();
			    return true;
            }
		}
	}
	
	timestep(){




        //this.battleView.drawGrid(this.grid); //remnants of the war of the days past
        this.effects = this.battleView.drawEffects(this.effects);


        if(this.reactComponent)
        {
            this.reactComponent.update(this.hero, this.selectedUnit, this.atbController);
        }

		if(this.animationPause>=0){

            this.battleView.drawUnits(this.allObjects);
			this.animationPause--;

		} else if(this.atbController && !this.heroActive){
		    let nextUnit = this.atbController.step();
		    if(nextUnit===this.hero){
		        this.heroActive=true;
		        this.refreshMovableForUnit(nextUnit,1);
            } else {
		        this.executeHostileTurn(nextUnit);
            }
        }

				
	}


}


export {Game};
