class Game { 
	
	constructor( grid , soundEngine ) {		
		this.hostileUnits=[];
		if(grid)
		{
			this.grid = grid;
			this.grid.game = this;
		}
		
		if(soundEngine)
		{
			this.soundEngine = soundEngine;
			this.soundEngine.game = this;
		}
	
	  }  
	  
	  setHero(/*Unit*/ hero){
		  this.hero=hero;
	  }
	  
	  addHostile(/*Unit*/ unit){
		  this.hostileUnits.push(unit);
	  }
	  
	executeHostilesTurn(){
		  
		for( let unit of this.hostileUnits){
			  
			  this.pursueAndFight(unit);
			  
		}		  
		  
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
	
	  
	  playSound(/* String */id){
		
		this.soundEngine.playSound(id);
			
		
	}
	
	processAttack(/*Unit */ attacker, /*Unit */ recipient){
		
		recipient.recieveDamage(attacker.meleeDamage);
		if(recipient.HP.value<=0)
		{
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
	

	
}


module.exports.Game = Game;