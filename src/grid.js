import {DisplacementAnimation, DynamicValue} from './Character.js'
import {DisappearingText} from './DisappearingText.js'


var HT = HT || {};
/**
 * A Grid is the model of the playfield containing hexes
 * @constructor
 */
HT.Grid = function(/*double*/ width, /*double*/ height) {
	
	this.Hexes = [];
	//setup a dictionary for use later for assigning the x or y CoOrd (depending on Orientation)
	let HexagonsByxOryCoOrd = {}; //Dictionary<int, List<Hexagon>>
    let selectedHex = null;
    let row = 0;
    let y = 20.0;
	while (y + HT.Hexagon.Static.HEIGHT <= height-20)
	{
        let col = 0;

        let offset = 0.0;
		if (row % 2 === 1)
		{
			offset = (HT.Hexagon.Static.WIDTH - HT.Hexagon.Static.SIDE)/2 + HT.Hexagon.Static.SIDE;
			col = 1;
		}

        let x = offset+50;
		while (x + HT.Hexagon.Static.WIDTH <= width-20)
		{
            let hexId = this.GetHexId(row, col);
            let h = new HT.Hexagon(hexId, x, y, row, col);

            let pathCoOrd = col;
			h.PathCoOrdx = col;//the column is the x coordinate of the hex, for the y coordinate we need to get more fancy
			
			this.Hexes.push(h);
			
			if (!HexagonsByxOryCoOrd[pathCoOrd])
				HexagonsByxOryCoOrd[pathCoOrd] = [];
			HexagonsByxOryCoOrd[pathCoOrd].push(h);

			col+=2;
			x += HT.Hexagon.Static.WIDTH + HT.Hexagon.Static.SIDE;

		}
		row++;
		y += HT.Hexagon.Static.HEIGHT / 2;
	}

	//finally go through our list of hexagons by their x co-ordinate to assign the y co-ordinate
	for (let coOrd1 in HexagonsByxOryCoOrd)
	{
        let hexagonsByxOry = HexagonsByxOryCoOrd[coOrd1];
        let coOrd2 = Math.floor(coOrd1 / 2) + (coOrd1 % 2);
		for (let i in hexagonsByxOry)
		{
            let h = hexagonsByxOry[i];//Hexagon
			h.PathCoOrdy = coOrd2++;
		}
	}
};

HT.Grid.Static = {Letters:'ABCDEFGHIJKLMNOPQRSTUVWxyZ'};

HT.Grid.prototype.GetHexId = function(row, col) {
	
	return "("+row+","+col+")";
};

/**
 * Returns a hex at a given point
 * @this {HT.Grid}
 * @return {HT.Hexagon}
 */
HT.Grid.prototype.GetHexAt = function(x, y) {
	//find the hex that contains this point
	for (let h in this.Hexes)
	{
		if (this.Hexes[h].isInBounds(x,y))
		{
			return this.Hexes[h];
		}
	}

	return null;
};

HT.Grid.prototype.markGivenMovable = function(/*Array<Hexagon> */ movable){
	for(let hex of this.Hexes){
			
			if(movable && movable.indexOf(hex) !== -1)
			{	
				hex.movable=true;				
			} else {
				hex.movable=false;
			}
		}
}

/**
 * Finds a hex at a given point, and places given Unit there.
 * @this {HT.Grid}
 * @return {HT.Hexagon}
 */
HT.Grid.prototype.placeUnit = function(/*Hexagon*/ hex, /*Character*/ unit) {

	hex.content = unit;
	unit.hex = hex;
	
};

/* returns: boolean, true if managed to do action */
HT.Grid.prototype.goTo = function(/*Hexagon*/ hex, /*Character*/ unit) {

	if(hex)
	{
		if(hex.content)
		{
			unit.playSound('attack', Math.min(1, unit.meleeDamage.amount/hex.content.HP.value));
			this.game.processAttack(unit,hex.content);			
			unit.animation = new DisplacementAnimation( new HT.Point( (hex.x-unit.hex.x)/4, (hex.y-unit.hex.y)/4), 12, false);
			this.game.animationPause=11;
			
		} else {
			
			this.game.animationPause=14;
			unit.hex.content=null;			
			unit.animation = new DisplacementAnimation( new HT.Point( -(hex.x-unit.hex.x), -(hex.y-unit.hex.y)), 15, false);
			this.placeUnit(hex, unit);
			unit.playSound('step',1.);
		}
		return true;
	}
	
	return false;
	
};

HT.Grid.prototype.getMovableHexes = function(/*Character*/ unit) {

	let movable_hexes=[];

	if(unit.hex)
	{
		for(let hex of this.Hexes){
			console.log(this.GetHexDistance(hex, unit.hex)+" for hexes "+hex.Id+" & "+ unit.hex.Id);
			if(this.GetHexDistance(hex, unit.hex)===1)
			{	
				movable_hexes.push(hex);				
			}
		}
	}
	
	return movable_hexes;	
};

HT.Grid.prototype.selectHex = function(/*float*/ x,  /*float*/ y){
	let hex = this.GetHexAt(x ,y );
	
	if(this.selectedHex)
		{
			this.selectedHex.selected=false;
		}
		
	this.selectedHex = hex;
		
	if(hex)
	{		
		hex.selected=true;
		return hex.content;
	}

};

HT.Grid.prototype.moveUnitN = function(/*Character*/ unit) {	
	let hex = unit.hex;
	return this.GetHexById( this.GetHexId(hex.row-2, hex.col));
	
};

HT.Grid.prototype.moveUnitNE = function(/*Character*/ unit) {	
	let hex = unit.hex;
	return this.GetHexById( this.GetHexId(hex.row-1, hex.col+1));
};

HT.Grid.prototype.moveUnitNW = function(/*Character*/ unit) {	
	let hex = unit.hex;
	return this.GetHexById( this.GetHexId(hex.row-1, hex.col-1));
};

HT.Grid.prototype.moveUnitS = function(/*Character*/ unit) {	
	let hex = unit.hex;
	return this.GetHexById( this.GetHexId(hex.row+2, hex.col));
};

HT.Grid.prototype.moveUnitSE = function(/*Character*/ unit) {	
	let hex = unit.hex;
	return this.GetHexById( this.GetHexId(hex.row+1, hex.col+1));	
};

HT.Grid.prototype.moveUnitSW = function(/*Character*/ unit) {	
	let hex = unit.hex;
	return this.GetHexById( this.GetHexId(hex.row+1, hex.col-1));	
};

/**
 * Returns a distance between two hexes
 * @this {HT.Grid}
 * @return {number}
 */
HT.Grid.prototype.GetHexDistance = function(/*Hexagon*/ h1, /*Hexagon*/ h2) {
	//a good explanation of this calc can be found here:
	//http://playtechs.blogspot.com/2007/04/hex-grids.html
	var deltax = h1.PathCoOrdx - h2.PathCoOrdx;
	var deltay = h1.PathCoOrdy - h2.PathCoOrdy;
	return ((Math.abs(deltax) + Math.abs(deltay) + Math.abs(deltax - deltay)) / 2);
};

/**
 * Returns a distance between two hexes
 * @this {HT.Grid}
 * @return {HT.Hexagon}
 */
HT.Grid.prototype.GetHexById = function(id) {
	for(var i in this.Hexes)
	{
		if(this.Hexes[i].Id === id)
		{
			return this.Hexes[i];
		}
	}
	return null;
};

HT.Point = function(x, y) {
	this.x = x;
	this.y = y;
};

/**
 * A Rectangle is x and y origin and width and height
 * @constructor
 */
HT.Rectangle = function(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.Width = width;
	this.Height = height;
};

/**
 * A Line is x and y start and x and y end
 * @constructor
 */
HT.Line = function(p1, p2) {
	this.p1 = p1;
	this.p2 = p2;
};

HT.Line.prototype.drawBar = function(ctx, color1, color2, thickness, percentage) {
	
	let pointMid = new HT.Point(this.p1.x + percentage * (this.p2.x-this.p1.x),
								this.p1.y + percentage * (this.p2.y-this.p1.y));
	
	HT.Line.STATIC.draw(ctx, this.p1, pointMid, color1, thickness);
	
	HT.Line.STATIC.draw(ctx, pointMid, this.p2, color2, thickness);
	
};
HT.Line.STATIC = {};
HT.Line.STATIC.draw = function(ctx, p1, p2, color, thickness) {
	
	ctx.strokeStyle = color;
	ctx.lineWidth = thickness;	
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);		
	ctx.lineTo(p2.x, p2.y);	
	ctx.stroke();	
	
};

/**
 * A Hexagon is a 6 sided polygon, our hexes don't have to be symmetrical, i.e. ratio of width to height could be 4 to 3
 * @constructor
 */
HT.Hexagon = function(id, x, y, row, col) {
	this.points = [];//Polygon Base
	let x1 = null;
	let y1 = null;
	this.row = row;
	this.col = col;
	
	

	x1 = (HT.Hexagon.Static.WIDTH - HT.Hexagon.Static.SIDE)/2;
	y1 = (HT.Hexagon.Static.HEIGHT / 2);
	this.points.push(new HT.Point(x1 + x, y));
	this.points.push(new HT.Point(x1 + HT.Hexagon.Static.SIDE + x, y));
	this.points.push(new HT.Point(HT.Hexagon.Static.WIDTH + x, y1 + y));
	this.points.push(new HT.Point(x1 + HT.Hexagon.Static.SIDE + x, HT.Hexagon.Static.HEIGHT + y));
	this.points.push(new HT.Point(x1 + x, HT.Hexagon.Static.HEIGHT + y));
	this.points.push(new HT.Point(x, y1 + y));
	
	
	this.Id = id;
	
	this.x = x;
	this.y = y;
	this.x1 = x1;
	this.y1 = y1;
	
	this.TopLeftPoint = new HT.Point(this.x, this.y);
	this.BottomRightPoint = new HT.Point(this.x + HT.Hexagon.Static.WIDTH, this.y + HT.Hexagon.Static.HEIGHT);
	this.MidPoint = new HT.Point(this.x + (HT.Hexagon.Static.WIDTH / 2), this.y + (HT.Hexagon.Static.HEIGHT / 2));
	
	this.P1 = new HT.Point(x + x1, y + y1);
	
	this.selected = false;
	this.content = null;
	this.movable=false;
};
	
HT.Hexagon.prototype.drawBlank = function(ctx, stroke, thickness, fill) {
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
	
/**
 * draws this Hexagon to the canvas
 * @this {HT.Hexagon}
 */
HT.Hexagon.prototype.draw = function(ctx) {

	ctx.save();
	
	this.drawBlank(ctx, 'black', 2, 'rgba(0, 0, 0, 0)');
	
	//ctx.globalCompositeOperation = 'source-atop';
	
	//ctx.scale(0.97, 0.97);
	
	let fillStyle, strokeStyle, lineWidth=1;
	
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
	
	ctx.stroke();	
	ctx.restore();
	
	/*if(this.Id)
	{
		//draw text for debugging
		ctx.fillStyle = "white"
		ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = 'middle';
		//var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
		ctx.fillText(this.Id, this.MidPoint.x, this.MidPoint.y);
	}
	
	if(this.PathCoOrdx !== null && this.PathCoOrdy !== null && typeof(this.PathCoOrdx) != "undefined" && typeof(this.PathCoOrdy) != "undefined")
	{
		//draw co-ordinates for debugging
		ctx.fillStyle = "white"
		ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = 'middle';
		//var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
		ctx.fillText("("+this.PathCoOrdx+","+this.PathCoOrdy+")", this.MidPoint.x, this.MidPoint.y + 10);
	}
	
	if(HT.Hexagon.Static.DRAWSTATS)
	{
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		//draw our x1, y1, and z
		ctx.beginPath();
		ctx.moveTo(this.P1.x, this.y);
		ctx.lineTo(this.P1.x, this.P1.y);
		ctx.lineTo(this.x, this.P1.y);
		ctx.closePath();
		ctx.stroke();
		
		ctx.fillStyle = "black"
		ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		ctx.textAlign = "left";
		ctx.textBaseline = 'middle';
		//var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
		ctx.fillText("z", this.x + this.x1/2 - 8, this.y + this.y1/2);
		ctx.fillText("x", this.x + this.x1/2, this.P1.y + 10);
		ctx.fillText("y", this.P1.x + 2, this.y + this.y1/2);
		ctx.fillText("z = " + HT.Hexagon.Static.SIDE, this.P1.x, this.P1.y + this.y1 + 10);
		ctx.fillText("(" + this.x1.toFixed(2) + "," + this.y1.toFixed(2) + ")", this.P1.x, this.P1.y + 10);
	}*/

	
};

/**
 * Returns true if the x,y coordinates are inside this hexagon
 * @this {HT.Hexagon}
 * @return {boolean}
 */
HT.Hexagon.prototype.isInBounds = function(x, y) {
	return this.Contains(new HT.Point(x, y));
};
	
/**
 * Returns true if the point is inside this hexagon, it is a quick contains
 * @this {HT.Hexagon}
 * @param {HT.Point} p the test point
 * @return {boolean}
 */
HT.Hexagon.prototype.isInHexBounds = function(/*Point*/ p) {
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
 * @this {HT.Hexagon}
 * @param {HT.Point} p the test point
 * @return {boolean}
 */
HT.Hexagon.prototype.Contains = function(/*Point*/ p) {
	var isIn = false;
	if (this.isInHexBounds(p))
	{
		//turn our absolute point into a relative point for comparing with the polygon's points
		//var pRel = new HT.Point(p.x - this.x, p.y - this.y);
		var i, j = 0;
		for (i = 0, j = this.points.length - 1; i < this.points.length; j = i++)
		{
			var iP = this.points[i];
			var jP = this.points[j];
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


HT.Intersector = {
        slope: function (p1, p2) {
            if (p1.x === p2.x) return false;
            return (p1.y - p2.y) / (p1.x - p2.x);
        },
        getyInt: function (p1, p2) {
            if (p1.x === p2.x) return p1.y === 0 ? 0 : false;
            if (p1.y === p2.y) return p1.y;
            return p1.y - this.slope(p1, p2) * p1.x ;
        },
        getxInt: function (p1, p2) {
            var slope;
            if (p1.y === p2.y) return p1.x === 0 ? 0 : false;
            if (p1.x === p2.x) return p1.x;
            return (-1 * ((slope = this.slope(p1, p2)) * p1.x - p1.y)) / slope;
        },
        getIntersection: function (line1, line2) {
            var slope1, slope2, yint1, yint2, intx, inty;
            if (line1.p1 === line2.p1 || line1.p1 === line2.p2) return line1.p1;
            if (line1.p2 === line2.p1 || line1.p2 === line2.p2) return line1.p2;

            slope1 = this.slope(line1.p1, line1.p2);
            slope2 = this.slope(line2.p1, line2.p2);
            if (slope1 === slope2) return false;

            yint1 = this.getyInt(line1.p1, line1.p2);
            yint2 = this.getyInt(line2.p1, line2.p2);
            if (yint1 === yint2) return yint1 === false ? false : [0, yint1];

            if (slope1 === false) return new HT.Point(line2.p1.y, slope2 * line2.p1.y + yint2);
            if (slope2 === false) return new HT.Point(line1.p1.y, slope1 * line1.p1.y + yint1);
            intx = (slope1 * line1.p1.x + yint1 - yint2)/ slope2;
			
            return new HT.Point(intx, slope1 * intx + yint1);
        }
    };

HT.Hexagon.prototype.getLineAtHeight= function(/*float */ z) {
	let pointLeft = new HT.Point(this.x, this.y+HT.Hexagon.Static.HEIGHT-z);
	let pointRight = new HT.Point(this.x+HT.Hexagon.Static.WIDTH, this.y+HT.Hexagon.Static.HEIGHT-z);
	
	let lineLarge = new HT.Line(pointLeft,pointRight);
	let lineLeft = new HT.Line(this.points[5] ,this.points[4]);
	let lineRight = new HT.Line(this.points[3],this.points[2]);
	
	let p1 = HT.Intersector.getIntersection(lineLarge,lineLeft);
	let p2 = HT.Intersector.getIntersection(lineLarge,lineRight);
	
	return new HT.Line(p1,p2);
}
	
HT.Hexagon.Static = {HEIGHT:128
					, WIDTH:128
					, SIDE:80
					, DRAWSTATS: false};


export {HT};
