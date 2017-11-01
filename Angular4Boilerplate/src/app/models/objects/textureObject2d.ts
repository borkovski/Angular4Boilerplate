import { IVector2d, Vector2d } from '../vector2d/vector2d';
import { IColor, Color } from '../color/color';
import { IMovingObject2d, IRotatingObject2d } from './object2d';

export interface ITextureObject2d extends IMovingObject2d, IRotatingObject2d {
    setImage(image: HTMLImageElement, width: number, height: number);
    applyVelocity(velocity: IVector2d);
    applyAngularVelocity(value: number);
}

export class TextureObject2d implements ITextureObject2d {
    image: HTMLImageElement;
    position: IVector2d = new Vector2d(0, 0);
    velocity: IVector2d = new Vector2d(0, 0);
    acceleration: IVector2d = new Vector2d(0, 0);
    forces: IVector2d[] = [];

    angle: number = 0;
    angularVelocity: number = 0;
    angularAcceleration: number = 0;
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

    applyVelocity(velocity: IVector2d) {
        this.velocity.add(velocity.rotate(this.angle));
    }

    applyAngularVelocity(value: number) {
        if (Math.abs(this.angularVelocity) < .05 || this.angularVelocity >= .05 && value < 0 || this.angularVelocity <= -.05 && value > 0) {
            this.angularVelocity += value;
        }
    }

    update() {
        this.updatePosition();
    }

    private updatePosition() {
        this.position.add(this.velocity);
        this.velocity.div(1.01);
        this.angle += this.angularVelocity;
        this.angularVelocity /= 1.05;
    }

    draw(context: CanvasRenderingContext2D) {
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.angle);
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