
var HT = HT || {};
/**
 * A Grid is the model of the playfield containing hexes
 * @constructor
 */
HT.Grid = function(/*double*/ width, /*double*/ height) {
	
	this.Hexes = [];
	//setup a dictionary for use later for assigning the X or Y CoOrd (depending on Orientation)
	var HexagonsByXOrYCoOrd = {}; //Dictionary<int, List<Hexagon>>
	var selectedHex = null;
	var row = 0;
	var y = 0.0;
	while (y + HT.Hexagon.Static.HEIGHT <= height)
	{
		var col = 0;

		var offset = 0.0;
		if (row % 2 == 1)
		{
			offset = (HT.Hexagon.Static.WIDTH - HT.Hexagon.Static.SIDE)/2 + HT.Hexagon.Static.SIDE;
			col = 1;
		}
		
		var x = offset;
		while (x + HT.Hexagon.Static.WIDTH <= width)
		{
		    var hexId = this.GetHexId(row, col);
			var h = new HT.Hexagon(hexId, x, y, row, col);
			
			var pathCoOrd = col;
			h.PathCoOrdX = col;//the column is the x coordinate of the hex, for the y coordinate we need to get more fancy
			
			this.Hexes.push(h);
			
			if (!HexagonsByXOrYCoOrd[pathCoOrd])
				HexagonsByXOrYCoOrd[pathCoOrd] = [];
			HexagonsByXOrYCoOrd[pathCoOrd].push(h);

			col+=2;
			x += HT.Hexagon.Static.WIDTH + HT.Hexagon.Static.SIDE;

		}
		row++;
		y += HT.Hexagon.Static.HEIGHT / 2;
	}

	//finally go through our list of hexagons by their x co-ordinate to assign the y co-ordinate
	for (var coOrd1 in HexagonsByXOrYCoOrd)
	{
		var hexagonsByXOrY = HexagonsByXOrYCoOrd[coOrd1];
		var coOrd2 = Math.floor(coOrd1 / 2) + (coOrd1 % 2);
		for (var i in hexagonsByXOrY)
		{
			var h = hexagonsByXOrY[i];//Hexagon			
			h.PathCoOrdY = coOrd2++;
		}
	}
};

HT.Grid.Static = {Letters:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'};

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
	for (var h in this.Hexes)
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
			console.log("index of hex "+hex.Id+" = " +movable.indexOf(hex));
			if(movable.indexOf(hex)!=-1)
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
			this.game.playSound('clash');
			this.game.processAttack(unit,hex.content);
			
		} else {
			unit.hex.content=null;
			this.placeUnit(hex, unit);
			this.game.playSound('step');
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
			if(this.GetHexDistance(hex, unit.hex)==1)
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
	}
	
	
}

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
	var deltaX = h1.PathCoOrdX - h2.PathCoOrdX;
	var deltaY = h1.PathCoOrdY - h2.PathCoOrdY;
	return ((Math.abs(deltaX) + Math.abs(deltaY) + Math.abs(deltaX - deltaY)) / 2);
};

/**
 * Returns a distance between two hexes
 * @this {HT.Grid}
 * @return {HT.Hexagon}
 */
HT.Grid.prototype.GetHexById = function(id) {
	for(var i in this.Hexes)
	{
		if(this.Hexes[i].Id == id)
		{
			return this.Hexes[i];
		}
	}
	return null;
};

HT.Point = function(x, y) {
	this.X = x;
	this.Y = y;
};

/**
 * A Rectangle is x and y origin and width and height
 * @constructor
 */
HT.Rectangle = function(x, y, width, height) {
	this.X = x;
	this.Y = y;
	this.Width = width;
	this.Height = height;
};

/**
 * A Line is x and y start and x and y end
 * @constructor
 */
HT.Line = function(x1, y1, x2, y2) {
	this.X1 = x1;
	this.Y1 = y1;
	this.X2 = x2;
	this.Y2 = y2;
};

/**
 * A Hexagon is a 6 sided polygon, our hexes don't have to be symmetrical, i.e. ratio of width to height could be 4 to 3
 * @constructor
 */
HT.Hexagon = function(id, x, y, row, col) {
	this.Points = [];//Polygon Base
	var x1 = null;
	var y1 = null;
	this.row = row;
	this.col = col;
	this.movable=false;
	

	x1 = (HT.Hexagon.Static.WIDTH - HT.Hexagon.Static.SIDE)/2;
	y1 = (HT.Hexagon.Static.HEIGHT / 2);
	this.Points.push(new HT.Point(x1 + x, y));
	this.Points.push(new HT.Point(x1 + HT.Hexagon.Static.SIDE + x, y));
	this.Points.push(new HT.Point(HT.Hexagon.Static.WIDTH + x, y1 + y));
	this.Points.push(new HT.Point(x1 + HT.Hexagon.Static.SIDE + x, HT.Hexagon.Static.HEIGHT + y));
	this.Points.push(new HT.Point(x1 + x, HT.Hexagon.Static.HEIGHT + y));
	this.Points.push(new HT.Point(x, y1 + y));
	
	
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
};
	
/**
 * draws this Hexagon to the canvas
 * @this {HT.Hexagon}
 */
HT.Hexagon.prototype.draw = function(ctx) {

	ctx.save();
	ctx.fillStyle='rgba(255, 255, 255, 0)';
	if(this.content)
	{ctx.fillStyle='rgba(255, 255, 255, 1)';}
	else if (this.selected && this.movable)
	{ctx.fillStyle='rgba(205, 155, 30, 0.30)';}
	else if(this.movable)
	{ctx.fillStyle='rgba(125, 225, 125, 0.11)';}
	else if(this.selected)
	{ctx.fillStyle='rgba(225, 50, 0, 0.20)';}
	
	ctx.strokeStyle = 'rgba(128, 128, 128, 0.4)';
	ctx.lineWidth = 2.5;
	if(this.movable && this.selected && this.content){
		ctx.strokeStyle = "rgb(255, 155, 140)";
	ctx.lineWidth = 9;}
	else if(this.selected && this.content){
		ctx.strokeStyle = "rgb(155, 125, 40)";
	ctx.lineWidth = 6;}
	else if(this.movable && this.content)
	{ctx.strokeStyle = "rgb(205, 125, 130)";
	ctx.lineWidth = 7;}
	else
	{ctx.strokeStyle = "black";}
	
	
	ctx.beginPath();
	ctx.moveTo(this.Points[0].X, this.Points[0].Y);
	for(let p of this.Points)
	{		
		ctx.lineTo(p.X, p.Y);
	}
	ctx.closePath();
	ctx.fill()
	
	
	if(this.content)
	{
		ctx.globalCompositeOperation = 'source-atop';
		ctx.fillStyle='rgba(255, 255, 255, 1)';
		ctx.fill()
		this.content.x=this.x
		this.content.y=this.y
		this.content.draw(ctx)		
	}
	
	ctx.stroke();
	
	if(this.Id)
	{
		//draw text for debugging
		ctx.fillStyle = "white"
		ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = 'middle';
		//var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
		ctx.fillText(this.Id, this.MidPoint.X, this.MidPoint.Y);
	}
	
	if(this.PathCoOrdX !== null && this.PathCoOrdY !== null && typeof(this.PathCoOrdX) != "undefined" && typeof(this.PathCoOrdY) != "undefined")
	{
		//draw co-ordinates for debugging
		ctx.fillStyle = "white"
		ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = 'middle';
		//var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
		ctx.fillText("("+this.PathCoOrdX+","+this.PathCoOrdY+")", this.MidPoint.X, this.MidPoint.Y + 10);
	}
	
	if(HT.Hexagon.Static.DRAWSTATS)
	{
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		//draw our x1, y1, and z
		ctx.beginPath();
		ctx.moveTo(this.P1.X, this.y);
		ctx.lineTo(this.P1.X, this.P1.Y);
		ctx.lineTo(this.x, this.P1.Y);
		ctx.closePath();
		ctx.stroke();
		
		ctx.fillStyle = "black"
		ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		ctx.textAlign = "left";
		ctx.textBaseline = 'middle';
		//var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
		ctx.fillText("z", this.x + this.x1/2 - 8, this.y + this.y1/2);
		ctx.fillText("x", this.x + this.x1/2, this.P1.Y + 10);
		ctx.fillText("y", this.P1.X + 2, this.y + this.y1/2);
		ctx.fillText("z = " + HT.Hexagon.Static.SIDE, this.P1.X, this.P1.Y + this.y1 + 10);
		ctx.fillText("(" + this.x1.toFixed(2) + "," + this.y1.toFixed(2) + ")", this.P1.X, this.P1.Y + 10);
	}
	ctx.restore();
	
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
	if(this.TopLeftPoint.X < p.X && this.TopLeftPoint.Y < p.Y &&
	   p.X < this.BottomRightPoint.X && p.Y < this.BottomRightPoint.Y)
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
		//var pRel = new HT.Point(p.X - this.x, p.Y - this.y);
		var i, j = 0;
		for (i = 0, j = this.Points.length - 1; i < this.Points.length; j = i++)
		{
			var iP = this.Points[i];
			var jP = this.Points[j];
			if (
				(
				 ((iP.Y <= p.Y) && (p.Y < jP.Y)) ||
				 ((jP.Y <= p.Y) && (p.Y < iP.Y))
				//((iP.Y > p.Y) != (jP.Y > p.Y))
				) &&
				(p.X < (jP.X - iP.X) * (p.Y - iP.Y) / (jP.Y - iP.Y) + iP.X)
			   )
			{
				isIn = !isIn;
			}
		}
	}
	return isIn;
};


HT.Hexagon.Static = {HEIGHT:128
					, WIDTH:128
					, SIDE:80
					, DRAWSTATS: false};//hexagons will have 25 unit sides for now


module.exports.HT = HT
