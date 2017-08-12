import {Character} from './Character.js'

class Hero extends Character {
	
	constructor( /*Image*/ avatarImage)
	{
		super(avatarImage);
		this.HP = new DynamicValue(100);
		this.meleeDamage = new Damage(15, DamageType.SLASH);
		this.armor = new Armor(3,5,0);
		
	}
	
	recieveDamage(/*Damage*/ dmg) {
		
		if( this.armor[dmg.type] > dmg.amount){
			this.HP.value-=1;
		} else {
			this.HP.value -= (dmg.amount - this.armor[dmg.type]);
		}	
	}	
}

this.module.exports.Hero = Hero;

class Armor {
	constructor(/*Int*/ slash, /*Int*/ pierce, /*Int*/ magic){
		this.SLASH = slash;
		this.PIERCE = pierce;
		this.MAGIC = magic;
		
	}
}


class DynamicValue {
	
	constructor(/*int */ maxValue){		
		
		this.maxValue=maxValue;
		this.value=maxValue;
		
	}
	
}

var DamageType = Object.freeze({
	
	SLASH : { name: "Slashing" },
	PIERCE: { name: "Piercing" },
	MAGIC: 	{ name: "Magical"  }	
	
});

class Damage{
	constructor(/*Int*/ amount, /*DamageType*/ type){
		this.type = type;
		this.amount=amount;		
	}	
}

