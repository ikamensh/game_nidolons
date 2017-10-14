import {Damage} from '../../battle_system/Damage.js'
import {ParamsDict} from "../ParamsDict";
import {DamageType} from "../../battle_system/Damage";

import pic from "../../res/img/Helene.jpg"

import {lightning, magicMissile, burningHand} from "../../battle_system/abilities/dealDmg/circleOne"

import attack from "../../res/sound/Helene/attack.mp3"
import move from "../../res/sound/Helene/move.mp3"
import pain from "../../res/sound/Helene/pain.mp3"
import death from "../../res/sound/Helene/death.mp3"
import {createSoundDict} from "../../utils/Utils"


let soundDict = createSoundDict(attack, move, pain, death);

var heroParams = new ParamsDict(pic, soundDict, "Helene",30,15,
								new Damage(6,DamageType.SLASH), 
								[1,2,1],[lightning, burningHand, magicMissile]);

export {heroParams};
