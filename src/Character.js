class Character { 
	
	constructor(/*Image*/ avatarImage) {
		
		this.x=0
		this.y=0
		this.avatar = avatarImage;
		this.hex = "not_placed_yet";
		
	}
	
	draw = function(/* Canvas */ctx){
			
	  //ctx.drawImage(this.avatar, this.x, this.y, this.x + this.avatar.width, this.y + this.avatar.height, this.x, this.y, this.x + HT.Hexagon.Static.WIDTH, this.y + HT.Hexagon.Static.HEIGHT);  
	  ctx.drawImage(this.avatar, this.x, this.y);  
	  
	};  
}

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

module.exports.Hero = Hero;