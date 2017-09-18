import { IVector2d, Vector2d } from '../vector2d/vector2d';

export interface IObject2d {
    position: IVector2d;
    angle: number;
    
    update();
    draw(context: CanvasRenderingContext2D);
}

export interface IMovingObject2d extends IObject2d {
    velocity: IVector2d;
    acceleration: IVector2d;
}

export interface IRotatingObject2d extends IObject2d {
    angularVelocity: number;
    angularAcceleration: number;
}