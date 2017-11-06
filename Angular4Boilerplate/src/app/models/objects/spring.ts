import { IVector2d, Vector2d } from '../vector2d/vector2d';
import { IPhysicalObject2d } from './physicalObject2d';
import { IObject2d } from './object2d';


export interface ISpring extends IObject2d {
    restLength: number;
    elasticity: number;
}

export class Spring implements ISpring {
    position: IVector2d;
    angle: number;
    firstObject: IPhysicalObject2d;
    secondObject: IPhysicalObject2d;
    restLength: number = 50;
    elasticity: number = .99;

    constructor(firstObject: IPhysicalObject2d, secondObject: IPhysicalObject2d) {
        this.position = firstObject.position.clone();
        this.firstObject = firstObject;
        this.secondObject = secondObject;
    }

    update() {
        var springForce = this.firstObject.position.clone().sub(this.secondObject.position);
        var springLength = springForce.mag();
        var springExtension = this.restLength - springLength; 
        springForce.normalize().mult(this.elasticity * springExtension);
        if (!this.firstObject.isStatic && !this.secondObject.isStatic) {
            this.firstObject.applyForce(springForce.mult(.5));
            this.secondObject.applyForce(springForce.mult(-.5));
        }
        else if (!this.firstObject.isStatic) {
            this.firstObject.applyForce(springForce);
        }
        else if (!this.secondObject.isStatic) {
            this.secondObject.applyForce(springForce.mult(-1));
        }
    }


    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(this.firstObject.position.x, this.firstObject.position.y);
        ctx.lineTo(this.secondObject.position.x, this.secondObject.position.y);
        ctx.stroke();
        ctx.closePath();
    }
}