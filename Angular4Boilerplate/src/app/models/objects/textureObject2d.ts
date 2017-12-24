import { IVector2d, Vector2d } from '../vector2d/vector2d';
import { IColor, Color } from '../color/color';
import { IMovingObject2d, IRotatingObject2d } from './object2d';

export interface ITextureObject2d extends IMovingObject2d, IRotatingObject2d {
    setImage(image: HTMLImageElement, width: number, height: number);
    applyForce(force: IVector2d);
    angle: number;
    rotate(value: number);
}

export class TextureObject2d implements ITextureObject2d {
    image: HTMLImageElement;
    position: IVector2d = new Vector2d(0, 0);
    velocity: IVector2d = new Vector2d(0, 0);
    acceleration: IVector2d = new Vector2d(0, 0);
    forces: IVector2d[] = [];

    angularVelocity: number = 0;
    angle: number = 0;
    width: number;
    height: number;

    constructor(image: HTMLImageElement, width: number, height: number) {
        this.setImage(image, width, height);
    }

    setImage(image: HTMLImageElement, width: number, height: number) {
        this.image = image;
        this.width = width;
        this.height = height;
    }

    applyForce(force: IVector2d) {
        this.forces.push(force.clone());
    }

    rotate(value: number) {
        this.angularVelocity += value;
    }

    update() {
        this.updateAcceleration();
        this.updateAngle();
        this.updateVelocity();
        this.updatePosition();
    }

    private updateAcceleration() {
        var force = this.forces.pop();
        var forceSum = new Vector2d(0, 0);
        while (force != null) {
            forceSum.add(force);
            force = this.forces.pop();
        }
        this.acceleration.add(forceSum);
    }

    private updateAngle() {
        this.angle += this.angularVelocity;
        if (this.angle > Math.PI) {
            this.angle = Math.PI * -1 + (this.angle - Math.PI);
        }
        else if (this.angle < Math.PI * -1) {
            this.angle = Math.PI + (this.angle - Math.PI * -1);
        }
        this.angularVelocity = 0;
    }

    private updateVelocity() {
        this.velocity.add(this.acceleration).mult(.999);
        this.acceleration = new Vector2d(0, 0);
    }

    private updatePosition() {
        this.position.add(this.velocity.clone().rotate(this.angle));
    }

    draw(context: CanvasRenderingContext2D) {
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(new Vector2d(0,-1).rotate(this.angle).getAngle(new Vector2d(0, -1)));
        context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        context.restore();
    }

    private getX() {
        return this.position.x - this.width / 2;
    }

    private getY() {
        return this.position.y - this.height / 2;
    }
}