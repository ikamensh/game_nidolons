import slashIcon from "../res/icons/armor/slash.png"
import pierceIcon from "../res/icons/armor/pierce.png"
import magicIcon from "../res/icons/armor/magic.png"

class Armor {
    constructor(/*Int*/ slash, /*Int*/ pierce, /*Int*/ magic) {
        this.SLASH = slash;
        this.PIERCE = pierce;
        this.MAGIC = magic;
    }

    static icons= {
        SLASH: slashIcon,
        PIERCE: pierceIcon,
        MAGIC: magicIcon
    }
}

export {Armor};