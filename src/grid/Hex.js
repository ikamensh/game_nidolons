import {Intersector} from "./Geometry"
import {Point, Line} from "./Geometry"

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
        this.column =null;
        this.row =null;


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


        if(this.column !== null && this.row !== null)
        {
            //draw co-ordinates for debugging
            ctx.fillStyle = "white";
            ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = 'middle';
            //var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
            ctx.fillText("("+this.column+","+this.row+")", this.MidPoint.x, this.MidPoint.y + 10);

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

export {Hexagon}