import {DisplacementAnimation} from '../GUI/DisplacementAnimation.js'


/**
 * A Grid is the model of the playfield containing hexes
 */
class Grid {

    constructor(/*double*/ width, /*double*/ height) {

        this.hexes = [];
        //setup a dictionary for use later for assigning the x or y CoOrd (depending on Orientation)
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

                hex.xCoord = col;//the column is the x coordinate of the hex, for the y coordinate we need to get more fancy

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
                hexagon.yCoord = yCoord;
                yCoord++;
            }
        }
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
            return this.columns[column][row-Math.floor(column / 2) + (column % 2)];
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
            if(hex.content)
            {

                this.game.processAttack(unit,hex.content);
                this.game.animationPause=15;

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
        return this.getHex(hex.xCoord, hex.yCoord-1);
    };

    moveNE(/*Hex*/ hex) {
        return this.getHex(hex.xCoord+1, hex.yCoord);
    };

    moveNW(/*Hex*/ hex) {
        return this.getHex(hex.xCoord-1, hex.yCoord-1);
    };

    moveS(/*Hex*/ hex) {
        return this.getHex(hex.xCoord, hex.yCoord+1);
    };

    moveSE(/*Hex*/ hex) {
        return this.getHex(hex.xCoord+1, hex.yCoord+1);
    };

    moveSW(/*Hex*/ hex) {
        return this.getHex(hex.xCoord-1, hex.yCoord);
    };

    /**
     * Returns a distance between two hexes
     * @return {number}
     */
	getHexDistance(/*Hexagon*/ h1, /*Hexagon*/ h2) {
        //a good explanation of this calc can be found here:
        //http://playtechs.blogspot.com/2007/04/hex-grids.html
        let deltax = h1.xCoord - h2.xCoord;
        let deltay = h1.yCoord - h2.yCoord;
        return ((Math.abs(deltax) + Math.abs(deltay) + Math.abs(deltax - deltay)) / 2);
    };


    getHexById(id) {
        for(let i in this.hexes)
        {
            if(this.hexes[i].Id === id)
            {
                return this.hexes[i];
            }
        }
        return null;
    };
}

class Point{
	constructor(x,y){
        this.x = x;
        this.y = y;
	};
}


/*class Rectangle{
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.Width = width;
        this.Height = height;
    };
}*/


class Line{
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;


    };

    static draw(ctx, p1, p2, color, thickness) {

        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

    };


    drawBar = function(ctx, color1, color2, thickness, percentage) {

        let pointMid = new Point(this.p1.x + percentage * (this.p2.x-this.p1.x),
            this.p1.y + percentage * (this.p2.y-this.p1.y));

        Line.draw(ctx, this.p1, pointMid, color1, thickness);
        Line.draw(ctx, pointMid, this.p2, color2, thickness);

    };
}

class Hexagon{

constructor(x, y) {

    //visual coordinates on the canvas
    this.x = x;
    this.y = y;

    this.points = [];//Polygon Base
    let x1 = (Hexagon.WIDTH - Hexagon.SIDE)/2;
    let y1 = (Hexagon.HEIGHT / 2);

    this.points.push(new Point(x1 + x, y));
    this.points.push(new Point(x1 + Hexagon.SIDE + x, y));
    this.points.push(new Point(Hexagon.WIDTH + x, y1 + y));
    this.points.push(new Point(x1 + Hexagon.SIDE + x, Hexagon.HEIGHT + y));
    this.points.push(new Point(x1 + x, Hexagon.HEIGHT + y));
    this.points.push(new Point(x, y1 + y));

    this.TopLeftPoint = new Point(this.x, this.y);
    this.BottomRightPoint = new Point(this.x + Hexagon.WIDTH, this.y + Hexagon.HEIGHT);
    this.MidPoint = new Point(this.x + (Hexagon.WIDTH / 2), this.y + (Hexagon.HEIGHT / 2));

    this.P1 = new Point(x + x1, y + y1);

    this.selected = false;
    this.content = null;
    this.movable = false;
    this.xCoord =null;
    this.yCoord =null;


};


    drawBlank(ctx, stroke, thickness, fill) {
        //black line for hexes
        ctx.lineWidth = thickness;
        ctx.fillStyle=fill;
        ctx.strokeStyle = stroke;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for(let p of this.points)
        {
            ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }


    draw(ctx) {

        ctx.save();

        this.drawBlank(ctx, 'black', 2, 'rgba(0, 0, 0, 0)');

        //ctx.globalCompositeOperation = 'source-atop';

        //ctx.scale(0.97, 0.97);

        let lineWidth=1;

        let R=200, G=200, B=60, A=0.4;
        let RF=128, GF=128, BF=128, AF=0;

        if(this.movable)
        {
            if(this.content)
            {
                R+=25;
                G-=100;
                B-=40;
                A+=0.2;
                lineWidth+=2;

            }else {
                AF=0.15;
                RF+=60;
                GF+=60;
                BF+=60;}
        }

        if(this.selected)
        {
            AF=0.15;
            RF+=60;
            GF+=40;
            BF-=60;
            lineWidth+=2;
        }


        let colorStroke = 'rgba('+R +',' +G+',' +B+',' +A +')';
        let colorFill = 'rgba('+RF+',' +GF+',' +BF+',' +AF +')';

        this.drawBlank(ctx, colorStroke, lineWidth, colorFill);


        /*if(this.Id)
	{
		//draw text for debugging
		ctx.fillStyle = "white"
		ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = 'middle';
		//var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
		ctx.fillText(this.Id, this.MidPoint.x, this.MidPoint.y);
	}*/

	if(this.xCoord !== null && this.yCoord !== null)
	{
		//draw co-ordinates for debugging
		ctx.fillStyle = "white";
		ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = 'middle';
		//var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
		ctx.fillText("("+this.xCoord+","+this.yCoord+")", this.MidPoint.x, this.MidPoint.y + 10);
        let sameHex = //TODO something wrong with Grid.getHex.. debug it visually?
		ctx.fillText("("+this.xCoord+","+this.yCoord+")", this.MidPoint.x, this.MidPoint.y + 10);

    }


        ctx.stroke();
        ctx.restore();


    };

    /**
     * Returns true if the x,y coordinates are inside this hexagon
     * @return {boolean}
     */
    isInBounds(x, y) {
        return this.Contains(new Point(x, y));
    };

    /**
    * Returns true if the point is inside this hexagon, it is a quick contains
	* @param {Point} p the test point
	* @return {boolean}
	*/
	isInHexBounds = function(/*Point*/ p) {
		if(this.TopLeftPoint.x < p.x && this.TopLeftPoint.y < p.y &&
			p.x < this.BottomRightPoint.x && p.y < this.BottomRightPoint.y)
			return true;
		return false;
	};

//grabbed from:
//http://www.developingfor.net/c-20/testing-to-see-if-a-point-is-within-a-polygon.html
//and
//http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html#The%20C%20Code
    /**
     * Returns true if the point is inside this hexagon, it first uses the quick isInHexBounds contains, then check the boundaries
     * @param {Point} p the test point
     * @return {boolean}
     */
    Contains(/*Point*/ p) {
        let isIn = false;
        if (this.isInHexBounds(p))
        {
            //turn our absolute point into a relative point for comparing with the polygon's points
            //var pRel = new Point(p.x - this.x, p.y - this.y);
            let i, j = 0;
            for (i = 0, j = this.points.length - 1; i < this.points.length; j = i++)
            {
                let iP = this.points[i];
                let jP = this.points[j];
                if (
                    (
                        ((iP.y <= p.y) && (p.y < jP.y)) ||
                        ((jP.y <= p.y) && (p.y < iP.y))
                        //((iP.y > p.y) != (jP.y > p.y))
                    ) &&
                    (p.x < (jP.x - iP.x) * (p.y - iP.y) / (jP.y - iP.y) + iP.x)
                )
                {
                    isIn = !isIn;
                }
            }
        }
        return isIn;
    };

    getLineAtHeight= function(/*float */ z) {
        let pointLeft = new Point(this.x, this.y+Hexagon.HEIGHT-z);
        let pointRight = new Point(this.x+Hexagon.WIDTH, this.y+Hexagon.HEIGHT-z);

        let lineLarge = new Line(pointLeft,pointRight);
        let lineLeft = new Line(this.points[5] ,this.points[4]);
        let lineRight = new Line(this.points[3],this.points[2]);

        let p1 = Intersector.getIntersection(lineLarge,lineLeft);
        let p2 = Intersector.getIntersection(lineLarge,lineRight);

        return new Line(p1,p2);
    };

    static HEIGHT=128;
    static WIDTH=128;
    static SIDE=80;

}


class Intersector {

	static slope(p1, p2) {
		if (p1.x === p2.x) return false;
		return (p1.y - p2.y) / (p1.x - p2.x);
	};

	static getyInt(p1, p2) {
		if (p1.x === p2.x) return p1.y === 0 ? 0 : false;
		if (p1.y === p2.y) return p1.y;
		return p1.y - this.slope(p1, p2) * p1.x ;
	};

	static getxInt(p1, p2) {
		let slope;
		if (p1.y === p2.y) return p1.x === 0 ? 0 : false;
		if (p1.x === p2.x) return p1.x;
		return (-1 * ((slope = this.slope(p1, p2)) * p1.x - p1.y)) / slope;
	};

    static getIntersection(line1, line2) {
            let slope1, slope2, yint1, yint2, intx;
            if (line1.p1 === line2.p1 || line1.p1 === line2.p2) return line1.p1;
            if (line1.p2 === line2.p1 || line1.p2 === line2.p2) return line1.p2;

            slope1 = this.slope(line1.p1, line1.p2);
            slope2 = this.slope(line2.p1, line2.p2);
            if (slope1 === slope2) return false;

            yint1 = this.getyInt(line1.p1, line1.p2);
            yint2 = this.getyInt(line2.p1, line2.p2);
            if (yint1 === yint2) return yint1 === false ? false : [0, yint1];

            if (slope1 === false) return new Point(line2.p1.y, slope2 * line2.p1.y + yint2);
            if (slope2 === false) return new Point(line1.p1.y, slope1 * line1.p1.y + yint1);
            intx = (slope1 * line1.p1.x + yint1 - yint2)/ slope2;
			
            return new Point(intx, slope1 * intx + yint1);
        };
    }

export {Grid};
