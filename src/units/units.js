import {Damage} from '../battle_system/Damage.js'
import {ParamsDict} from "./ParamsDict";
import {DamageType} from "../battle_system/Damage";
import {createAudio} from "../utils/Utils"
import {lightning, magicMissile, burningHand} from "../battle_system/abilities/dealDmg/circleOne"

var heroParams = new ParamsDict("Helene",30,15,
								new Damage(6,DamageType.SLASH), 
								[1,2,1],[lightning, burningHand, magicMissile]);
								
var ghostParams = new ParamsDict("Ghost",5,0,
								new Damage(4,DamageType.MAGIC), 
								[3,3,0]);
								
var pirateParams = new ParamsDict("Pirate", 12,0,
								new Damage(5,DamageType.PIERCE), 
								[0,0,0]);


const createSoundDict = function (path) {

    return {
        attack: createAudio(require("../res/sound/" + path +"/attack.mp3")),
        move: createAudio(require("../res/sound/" +path +"/move.mp3")),
        pain: createAudio(require("../res/sound/" +path +"/pain.mp3")),
        death: createAudio(require("../res/sound/" +path +"/death.mp3"))
    };

};



export {heroParams,ghostParams,pirateParams, createSoundDict};
