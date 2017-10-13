

import {AbilityDealDmg} from "../AbilityDealDmg"
import {Damage, DamageType} from "../../Damage"
import lightningImage from "../../../res/lightning.png"


function createImage(/*Require*/ source){
    let image = document.createElement('img');
    image.src = source;
    return image;
}


var magicMissile = new AbilityDealDmg(new Damage(5, DamageType.PIERCE), 6, 4 , require("../../../res/time.png"));
var burningHand = new AbilityDealDmg(new Damage(8, DamageType.MAGIC), 3, 1 , require("../../../res/fire.png"));
var lightning = new AbilityDealDmg(new Damage(6, DamageType.MAGIC), 6, 2 , lightningImage);

export {magicMissile, burningHand, lightning}