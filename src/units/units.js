import {ParamsDict, DamageType, Damage} from '../Character.js'

var heroParams = new ParamsDict("Helene",30, 
								new Damage(6,DamageType.SLASH), 
								[1,2,1]);
								
var ghostParams = new ParamsDict("Ghost",5, 
								new Damage(4,DamageType.MAGIC), 
								[3,3,0]);
								
var pirateParams = new ParamsDict("Pirate", 
								new Damage(5,DamageType.PIERCE), 
								[0,0,0]);

export {heroParams,ghostParams,pirateParams};
