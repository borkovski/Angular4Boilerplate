import { IVector2d, Vector2d } from '../vector2d/vector2d';
import { IColor, Color } from '../color/color';
import { IMovingObject2d, IRotatingObject2d } from './object2d';

export interface IPhysicalObject2d extends IMovingObject2d, IRotatingObject2d {
    color: IColor;
    mass: number;
    density: number;
    restitution: number;
    forces: IVector2d[];

    applyForce(force: IVector2d);
    checkBoundaries(boundaries: IVector2d);
}