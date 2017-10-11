class DisplacementAnimation {
    constructor(/* displacement point*/ dP, /*int*/ duration, /*boolean*/ inverted) {
        this.dP = dP;
        //inverted animation will go from current position to the given point(relative);
        //non-inverted will go from the given point to current position.
        this.inverted = inverted;
        this.duration = duration;
        this.durationInitial = duration;
    }

    //returns x,y vector according to current displacement
    calculateAnimDisplacement() {
        if (this.duration > 0) {
            if (this.inverted) {
                this.duration -= 1;
                return {
                    x: this.dP.x * (1 - this.duration / this.durationInitial),
                    y: this.dP.y * (1 - this.duration / this.durationInitial)
                };
            } else {
                this.duration -= 1;
                return {
                    x: this.dP.x * (this.duration / this.durationInitial),
                    y: this.dP.y * (this.duration / this.durationInitial)
                };
            }
        }
    }
}

export {DisplacementAnimation};