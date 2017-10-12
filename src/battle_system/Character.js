import {soundsEngine} from '../utils/SoundEngine';
import {createCanvas} from "../utils/Utils"
import {Armor} from "./Armor";
import {Damage} from "./Damage";
import {DynamicValue} from "./DynamicValue";
import {DisplacementAnimation} from "../GUI/DisplacementAnimation"

class MapObject { 
	
	constructor(/*Image*/ avatarImage, /* txt_id -> Sound */ soundsDict) {
		
		this.x=0
		this.y=0
		this.avatar = avatarImage;
		this.hex = "not_placed_yet";
		this.soundsDict = soundsDict;
		this.canvas = createCanvas(128,128);
		this.ctx=this.canvas.getContext('2d');
        this.needsRedraw=true;
		
		
	}
	
	playSound(/*String */ id, /*Double*/ volume){
		let sound = this.soundsDict[id];
		if(sound){
			soundsEngine.playSound(sound, volume);
		}
		
	}

    draw(/* Canvas2D */ctx){
	    if(this.needsRedraw){
	        this.redraw();
	        this.needsRedraw=false;
        }

        ctx.save();

        if(this.animation){
            let animationDisplacement = this.animation.calculateAnimDisplacement();
            if(/*Point */ animationDisplacement){
                ctx.translate(animationDisplacement.x,animationDisplacement.y);
            }
        }

        ctx.drawImage(this.canvas, this.hex.x, this.hex.y);
        ctx.restore();
    };

	redraw(){

        this.ctx.save();
        this.ctx.translate(-this.hex.x,-this.hex.y);
        this.ctx.globalCompositeOperation = 'destination-over';
		this.hex.drawBlank(this.ctx, 'black', 0, 'black');
        this.ctx.globalCompositeOperation = 'source-atop';
		this.ctx.drawImage(this.avatar, this.hex.x, this.hex.y);

		if(this.HP){
			
				let bar = this.hex.getLineAtHeight(5);
				let colorHP = 'rgba(249, 69, 86, 0.4)';
				let colorMissing = 'rgba(20, 20, 20, 0.4)';
				bar.drawBar(this.ctx, colorHP, colorMissing, 5, this.HP.getPercentageFull());
				
			}

        this.ctx.restore();

	};

}


class Unit extends MapObject {
	
	constructor( /*Image*/ avatarImage, /* txt_id -> Sound */ soundsDict, /*ParamsDict*/ params)
	{
		super(avatarImage, soundsDict);
		this.name = params.name;
		this.HP = new DynamicValue(params.HP);
		this.meleeDamage = new Damage(params.dmg.amount, params.dmg.type); 
		this.armor = new Armor(params.armor[0],params.armor[1],params.armor[2]) ;
		
	}
	
	dealDamage(){

        return this.meleeDamage;
	}
	
	recieveDamage(/*Damage*/ dmg) {
		
		let dmgDealt = this.armor[dmg.type] > dmg.amount ? 1 : (dmg.amount - this.armor[dmg.type]);
		
		this.HP.value -= dmgDealt;
		this.needsRedraw=true;
		if(this.HP.value>0){
			this.playSound('pain', (dmgDealt/(dmgDealt + this.HP.maxValue)) );
		} else {
			this.playSound('death', (dmgDealt/(dmgDealt + this.HP.maxValue)));
			this.game.processDeath(this);
		}



		return dmgDealt;		
	}	
}




export {Unit};
