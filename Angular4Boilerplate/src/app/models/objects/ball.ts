import { IVector2d, Vector2d } from '../vector2d/vector2d';
import { IObject2d } from './object2d';

export interface IBall extends IObject2d {
    color: string;
    radius: number;
}

export class Ball implements IBall {
    position: IVector2d;
    velocity: IVector2d;
    acceleration: IVector2d;

    color: string;
    radius: number;

    update() {
        this.position.add(this.velocity);
        if (this.position.x + this.radius > 512 || this.position.x - this.radius < 0) {
            this.velocity.mult(-1);
        }
    }


    draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }
}