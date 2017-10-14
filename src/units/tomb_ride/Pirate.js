import {Damage} from '../../battle_system/Damage.js'
import {ParamsDict} from "../ParamsDict";
import {DamageType} from "../../battle_system/Damage";

import pic from "../../res/img/Pirate.png"

import attack from "../../res/sound/Pirate/attack.mp3"
import move from "../../res/sound/Pirate/move.mp3"
import pain from "../../res/sound/Pirate/pain.mp3"
import death from "../../res/sound/Pirate/death.mp3"
import {createSoundDict} from "../../utils/Utils"


let soundDict = createSoundDict(attack, move, pain, death);


var pirateParams = new ParamsDict(pic, soundDict, "Pirate", 12,0,
    new Damage(5,DamageType.PIERCE),
    [1,0,0]);


export {pirateParams};
