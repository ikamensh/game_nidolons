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
}

export {DamageType};
export {Damage};