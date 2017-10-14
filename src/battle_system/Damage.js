import slashIcon from "../res/icons/damage/slash.jpg"
import pierceIcon from "../res/icons/damage/pierce.jpg"
import magicIcon from "../res/icons/damage/magic.png"


const DamageType = Object.freeze({

    SLASH: "SLASH",
    PIERCE: "PIERCE",
    MAGIC: "MAGIC"

});

class Damage {
    constructor(/*Int*/ amount, /*DamageType*/ type) {
        this.type = type;
        this.amount = amount;
    }

    static icons= {
        SLASH: slashIcon,
        PIERCE: pierceIcon,
        MAGIC: magicIcon
    }
}

export {DamageType};
export {Damage};