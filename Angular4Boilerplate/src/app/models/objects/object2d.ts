import { IVector2d, Vector2d } from '../vector2d/vector2d';

export interface IObject2d {
    position: IVector2d;
    velocity: IVector2d;
    acceleration: IVector2d;
    
    update();
    draw(context: CanvasRenderingContext2D);
}