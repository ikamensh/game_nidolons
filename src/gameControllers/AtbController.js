class AtbController{

    constructor(/* Array<Unit> */ unitsInAtb){

        this.unitsInAtb = [];
        for( let unit of unitsInAtb){
            this.addUnit(unit);
        }
        this.updateTimeTillTurn();


    }

    updateTimeTillTurn(){
        for( let unit of this.unitsInAtb){
            if(unit.initiative && unit.atbReadiness)
            {
                unit.timeTillTurn = (1-unit.atbReadiness)/unit.initiative;

                //should never happen, but ye know..
                if(unit.atbReadiness>1.1){
                    alert("dafuck going on in atbCOntroller?! "+unit.name);
                }
            }

        }
    }

    removeUnit(/*Unit*/ unit){
        let index = this.unitsInAtb.indexOf(unit);
        if (index > -1) {
            this.unitsInAtb.splice(index, 1);
        }
        this.processAtbRelevantEvent();
    }

    addUnit(/*Unit*/ unit){
        if(unit.initiative)
        {
            unit.atbReadiness = Math.random()*0.25;
            this.unitsInAtb.push(unit);
        }
    }





    updateTurnOrder(){
        this.unitsInAtb.sort(AtbController.CompareForSort);
    }

    processTimeElapsed(/*Float*/ time){
        for(let unit of this.unitsInAtb){
            unit.atbReadiness+=time*unit.initiative;
        }
    }

    step(){

        let timeElapsed=this.unitsInAtb[0].timeTillTurn;
        this.processTimeElapsed(timeElapsed+0.0001);
        this.updateTimeTillTurn();
        this.updateTurnOrder();
        if(this.unitsInAtb[0].atbReadiness>=1){
            return this.unitsInAtb[0];
        } else {
            return false; //this.step();
        }

    }



    processAtbRelevantEvent(){
        this.updateTimeTillTurn();
        this.updateTurnOrder();
    }



    static CompareForSort(first, second)
    {
        if (first.timeTillTurn === second.timeTillTurn)
            return 0;
        if (first.timeTillTurn < second.timeTillTurn)
            return -1;
        else
            return 1;
    }

}

export {AtbController}

