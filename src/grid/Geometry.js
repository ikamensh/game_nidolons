class Point{
    constructor(x,y){
        this.x = x;
        this.y = y;
    };

    equals(/*Point*/ anotherPoint){
        return this.x == anotherPoint.x && this.y == anotherPoint.y
    }
}


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


    drawBar(ctx, color1, color2, thickness, percentage) {

        let pointMid = new Point(this.p1.x + percentage * (this.p2.x-this.p1.x),
            this.p1.y + percentage * (this.p2.y-this.p1.y));

        Line.draw(ctx, this.p1, pointMid, color1, thickness);
        Line.draw(ctx, pointMid, this.p2, color2, thickness);

    };
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

export {Point, Line, Intersector}