import {Damage} from '../../battle_system/Damage.js'
import {ParamsDict} from "../ParamsDict";
import {DamageType} from "../../battle_system/Damage";

import pic from "../../res/img/Ghost.jpg"
import attack from "../../res/sound/Ghost/attack.mp3"
import move from "../../res/sound/Ghost/move.mp3"
import pain from "../../res/sound/Ghost/pain.mp3"
import death from "../../res/sound/Ghost/death.mp3"
import {createSoundDict} from "../../utils/Utils"


let soundDict = createSoundDict(attack, move, pain, death);

let ghostParams = new ParamsDict(pic, soundDict, "Ghost",5,0,
    new Damage(4,DamageType.MAGIC),
    [3,3,0]);

export {ghostParams};
