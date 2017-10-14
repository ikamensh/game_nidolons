import {createImage} from "../utils/Utils"

class ParamsDict {
    constructor(picture, soundsDictionary, name, HP, mana, dmg, armor, abilities) {
        this.picture = createImage(picture);
        this.picsrc = picture;
        this.soundsDictionary = soundsDictionary;
        this.name = name;
        this.HP = HP;
        this.mana = mana;
        this.dmg = dmg;
        this.armor = armor;
        this.abilities = abilities;
    }
}

export {ParamsDict};