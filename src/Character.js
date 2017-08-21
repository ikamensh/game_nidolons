import {soundsEngine} from './SoundEngine';
import $ from 'jquery';

class MapObject { 
	
	constructor(/*Image*/ avatarImage, /* txt_id -> Sound */ soundsDict) {
		
		this.x=0
		this.y=0
		this.avatar = avatarImage;
		this.hex = "not_placed_yet";
		this.soundsDict = soundsDict;
		
	}
	
	playSound(/*String */ id, /*Double*/ volume){
		let sound = this.soundsDict[id];
		if(sound){
			soundsEngine.playSound(sound, volume);
		}
		
	}
	
	draw(/* Canvas */ctx){
		ctx.save();
	  //ctx.drawImage(this.avatar, this.x, this.y, this.x + this.avatar.width, this.y + this.avatar.height, this.x, this.y, this.x + HT.Hexagon.Static.WIDTH, this.y + HT.Hexagon.Static.HEIGHT);  
	  
		

		

		if(this.animation){
			var animationDisplacement = this.animation.calculateAnimDisplacement();
			if(/*Point */ animationDisplacement){
				ctx.translate(animationDisplacement.x,animationDisplacement.y);
			}
		}
		
		this.hex.drawBlank(ctx, 'black', 0, 'black');
		ctx.globalCompositeOperation = 'source-atop';
		ctx.drawImage(this.avatar, this.hex.x, this.hex.y);
		
		
		if(this.HP){
			
				let bar = this.hex.getLineAtHeight(5);
				let colorHP = 'rgba(249, 69, 86, 0.4)';
				let colorMissing = 'rgba(20, 20, 20, 0.4)';
				
				bar.drawBar(ctx, colorHP, colorMissing, 5, this.HP.getPercentageFull());
				
			}
			
			
			
			
		ctx.restore();	  
	  
	};

}


class Hero extends MapObject {
	
	constructor( /*Image*/ avatarImage, /* txt_id -> Sound */ soundsDict, /*ParamsDict*/ params)
	{
		super(avatarImage, soundsDict);
		
		this.HP = new DynamicValue(params.HP);
		this.meleeDamage = new Damage(params.dmg.amount, params.dmg.type); 
		this.armor = new Armor(params.armor[0],params.armor[1],params.armor[2]) ;
		
	}
	
	recieveDamage(/*Damage*/ dmg) {
		
		if( this.armor[dmg.type] > dmg.amount){
			this.HP.value-=1;
			return 1;
		} else {
			this.HP.value -= (dmg.amount - this.armor[dmg.type]);
			return (dmg.amount - this.armor[dmg.type]);
		}	
	}	
}


class Armor {
	constructor(/*Int*/ slash, /*Int*/ pierce, /*Int*/ magic){
		this.SLASH = slash;
		this.PIERCE = pierce;
		this.MAGIC = magic;
		
	}
}

class ParamsDict {
	constructor(HP, dmg, armor){
		this.HP = HP;
		this.dmg = dmg;
		this.armor = armor;
	}	
}

class DynamicValue {
	
	constructor(/*int */ maxValue){		
		
		this.maxValue=maxValue;
		this.value=maxValue;
		
	}
	
	getPercentageFull() {
		return this.value/this.maxValue;
	}
	
}

var DamageType = Object.freeze({
	
	SLASH : "SLASH",
	PIERCE: "PIERCE",
	MAGIC: 	"MAGIC"	
	
});

class Damage{
	constructor(/*Int*/ amount, /*DamageType*/ type){
		this.type = type;
		this.amount=amount;		
	}	
}

class DisplacementAnimation{
	constructor( /* displacement point*/ dP, /*int*/ duration, /*boolean*/ inverted){		
		this.dP = dP;
		this.inverted=inverted;
		this.duration = duration;
		this.durationInitial = duration;			
	}

	calculateAnimDisplacement(){
		if(this.duration>0){
			if(this.inverted){
				this.duration-=1;
				return {
					x: this.dP.x*(1-this.duration/this.durationInitial),
					y: this.dP.y*(1-this.duration/this.durationInitial)
				};
			} else {
				this.duration-=1;
				return {
					x: this.dP.x*(this.duration/this.durationInitial),
					y: this.dP.y*(this.duration/this.durationInitial)
				};
			}
		}	
	}
}



export {Hero, DynamicValue, DisplacementAnimation, Damage, DamageType, Armor, ParamsDict};
