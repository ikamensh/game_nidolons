class BattleView{
    constructor(canvasDraw, canvasGrid, canvasUnits, canvasEffects ){

        this.canvasDraw=canvasDraw;
        this.ctxDraw = canvasDraw.getContext('2d');

        this.ctxEffects = canvasEffects.getContext('2d');
        this.ctxUnits = canvasUnits.getContext('2d');
        this.ctxGrid = canvasGrid.getContext('2d');

        this.ctxDraw.globalCompositeOperation = 'destination-over';
        this.ctxGrid.globalCompositeOperation = 'destination-over';
        this.ctxUnits.globalCompositeOperation = 'destination-over';
        this.ctxEffects.globalCompositeOperation = 'source-over';

    }

    drawGrid(/*Grid*/ grid){

        //draw hex field

        this.ctxGrid.clearRect(0, 0, 960, 600);
        for(let hex of grid.hexes) {
            this.ctxDraw.clearRect(0, 0, 960, 600);
            hex.draw(this.ctxDraw);
            this.ctxGrid.drawImage(this.canvasDraw,0,0);

        }

    }


    drawUnits(allObjects){

        //draw units

        this.ctxUnits.clearRect(0, 0, 960, 600);
        for(let obj of allObjects)
        {
            this.ctxDraw.clearRect(0, 0, 960, 600);
            obj.draw(this.ctxDraw);
            this.ctxUnits.drawImage(this.canvasDraw,0,0);
        }

    }

    drawEffects(effects){
        //also renders effects
        this.ctxDraw.clearRect(0, 0, 960, 600);
        let newEffects = this.animateEffects(effects, this.ctxDraw);
        this.ctxEffects.clearRect(0, 0, 960, 600);
        this.ctxEffects.drawImage(this.canvasDraw,0,0);
        return newEffects;
    }


    animateEffects(effects, ctx){
        for( let /*Effect*/eff of effects){
            if(eff.draw(ctx)) //true when effect is over
            {
                let index = effects.indexOf(eff);
                effects.splice(index, 1);
            }
        }
        return effects;
    }


}

export {BattleView};