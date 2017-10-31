import {DisplacementAnimation} from '../GUI/DisplacementAnimation.js'
import {Point} from "./Geometry"
import {Hexagon} from "./Hex"

/**
 * A Grid is the model of the playfield containing hexes
 */
class Grid {

    constructor(/*double*/ width, /*double*/ height) {

        this.hexes = [];
        this.fill_hexes(height, width);

        this.walls = []

    };



    static Letters='ABCDEFGHIJKLMNOPQRSTUVWxyZ';

    /**
     * Returns a hex at a given point
     * @return {Hexagon}
     */
    getHexAt(x, y) {
        //find the hex that contains this point
        for (let h in this.hexes)
        {
            if (this.hexes[h].isInBounds(x,y))
            {
                return this.hexes[h];
            }
        }

        return null;
    };

    getHex(/*int*/ column, /*int*/ row){
        if(this.columns[column]){
            return this.columns[column][row-Math.floor(column / 2) - (column % 2)];
        }
    }

    makeMovable(/*Array<Hexagon> */ movable){
        for(let hex of this.hexes){
                hex.movable=movable && movable.indexOf(hex) !== -1;
        }
    };

    /**
     * Finds a hex at a given point, and places given Unit there.
     * @return {Hexagon}
     */
    placeUnit(/*Hexagon*/ hex, /*Unit*/ unit) {

        hex.content = unit;
        unit.hex = hex;

    };

    /* returns: boolean, true if managed to do action */
    goTo(/*Hexagon*/ hex, /*Character*/ unit) {

        if(hex)
        {
            for(let wall of this.walls){
                if(wall.checkBlocked(hex, unit.hex)){
                    return false;
                }
            }

            if(hex.content)
            {
                this.game.processAttack(unit,hex.content);
            } else {
                this.game.animationPause=15;
                unit.hex.content=null;
                unit.animation = new DisplacementAnimation( new Point( -(hex.x-unit.hex.x), -(hex.y-unit.hex.y)), 15, false);
                this.placeUnit(hex, unit);
                unit.playSound('step',1.);
            }
            return true;
        }

        return false;

    };

    //TODO mind the walls
    getMovableHexes(/*Character*/ unit, /*int*/ distance) {

        let movable_hexes=[];

        if(unit.hex)
        {
            for(let hex of this.hexes){
                if(this.getHexDistance(hex, unit.hex) <= distance)
                {
                    movable_hexes.push(hex);
                }
            }
        }

        return movable_hexes;
    };

    selectHex(/*float*/ x,  /*float*/ y){
        let hex = this.getHexAt(x ,y );

        if(this.selectedHex)
        {
            this.selectedHex.selected=false;
        }

        this.selectedHex = hex;

        if(hex)
        {
            hex.selected=true;
            return hex;
        }

    };

    moveN(/*Hex*/ hex) {
        return this.getHex(hex.column, hex.row-1);
    };

    moveNE(/*Hex*/ hex) {
        return this.getHex(hex.column+1, hex.row);
    };

    moveNW(/*Hex*/ hex) {
        return this.getHex(hex.column-1, hex.row-1);
    };

    moveS(/*Hex*/ hex) {
        return this.getHex(hex.column, hex.row+1);
    };

    moveSE(/*Hex*/ hex) {
        return this.getHex(hex.column+1, hex.row+1);
    };

    moveSW(/*Hex*/ hex) {
        return this.getHex(hex.column-1, hex.row);
    };

    /**
     * Returns a distance between two hexes
     * @return {number}
     */
	getHexDistance(/*Hexagon*/ h1, /*Hexagon*/ h2) {
        //a good explanation of this calc can be found here:
        //http://playtechs.blogspot.com/2007/04/hex-grids.html
        let deltax = h1.column - h2.column;
        let deltay = h1.row - h2.row;
        return ((Math.abs(deltax) + Math.abs(deltay) + Math.abs(deltax - deltay)) / 2);
    };

    fill_hexes(height, width) {
        let columns = {}; //Dictionary<int, List<Hexagon>>

        this.selectedHex = null;
        let row = 0;
        let y = 20.0;
        while (y + Hexagon.HEIGHT <= height - 20) {
            let col = 0;

            let offset = 0.0;
            if (row % 2 === 1) {
                offset = (Hexagon.WIDTH - Hexagon.SIDE) / 2 + Hexagon.SIDE;
                col = 1;
            }

            let x = offset + 50;
            while (x + Hexagon.WIDTH <= width - 20) {
                let hex = new Hexagon(x, y);

                hex.column = col;//the column is the x coordinate of the hex, for the y coordinate we need to get more fancy

                this.hexes.push(hex);

                if (!columns[col])
                    columns[col] = [];
                columns[col].push(hex);

                col += 2;
                x += Hexagon.WIDTH + Hexagon.SIDE;

            }
            row++;
            y += Hexagon.HEIGHT / 2;
        }

        this.columns = columns;

        //finally go through our list of hexagons by their x co-ordinate to assign the y co-ordinate
        for (let coOrd1 in columns) {
            let column = columns[coOrd1];
            let yCoord = Math.floor(coOrd1 / 2) + (coOrd1 % 2);
            for (let /*Hexagon*/hexInColumn in column) {
                let hexagon = column[hexInColumn];
                hexagon.row = yCoord;
                yCoord++;
            }
        }
    }

}


export {Grid};
