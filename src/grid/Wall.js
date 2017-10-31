import {Line} from "./Geometry"
import {Point} from "./Geometry"

class Wall{
    constructor(/*Hex*/ leftHex, /*Hex*/ rightHex){

        this.leftHex = leftHex;
        this.rightHex = rightHex;

        this.point1 = null;
        this.point2 = null;
        for(let pointA of leftHex.points){
            for(let pointB of rightHex.points){
                if(pointA.equals(pointB)){
                    if(!this.point1){
                        this.point1= new Point(pointA.x, pointA.y);
                    } else {
                        this.point2 = new Point(pointA.x, pointA.y);
                    }
                }
            }
        }

    }

    checkBlocked(/*Hex*/ leftHex, /*Hex*/ rightHex){

        if(leftHex === this.leftHex && rightHex === this.rightHex){
            return true;
        } else if(leftHex === this.rightHex && rightHex === this.leftHex){
            return true;
        }

        return false;

    }

    draw(ctx){
        let colorWall = 'rgba(60, 70, 50, 0.8)';
        Line.draw(ctx, this.point1, this.point2, colorWall, 12);
    }


}

export {Wall}