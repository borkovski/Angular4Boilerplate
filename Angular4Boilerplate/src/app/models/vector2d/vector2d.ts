﻿export interface IVector2d {
    x: number;
    y: number;

    clone(): IVector2d;
    add(vector: IVector2d): IVector2d;
    sub(vector: IVector2d): IVector2d;
    mult(scalar: number): IVector2d;
    div(scalar: number): IVector2d;
    mag();
    normalize(): IVector2d;
    distance(vector: IVector2d): number;
    dot(vector: IVector2d): number;
    round(precision: number): IVector2d;
    rotate(angle: number);
}

export class Vector2d implements IVector2d {
    x: number;
    y: number;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    clone(): IVector2d {
        return new Vector2d(this.x, this.y);
    }

    add(vector: IVector2d): IVector2d {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    sub(vector: IVector2d): IVector2d {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    mult(scalar: number): IVector2d {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    div(scalar: number): IVector2d {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(): IVector2d {
        var m = this.mag();
        if (m != 0) {
            this.div(m);
        }
        return this;
    }

    distance(vector: IVector2d): number {
        var xd = vector.x - this.x;
        var yd = vector.y - this.y;
        var dist = Math.sqrt(xd * xd + yd * yd);
        return dist;
    }

    dot(vector: IVector2d): number {
        return this.x * vector.x + this.y * vector.y; 
    }

    round(precision: number) {
        var multiplier = precision > 0 ? 10 * precision : 1;
        this.x = Math.round(this.x * multiplier) / multiplier;
        this.y = Math.round(this.y * multiplier) / multiplier;
        return this;
    }

    rotate(angle: number) {
        var initialVector = this.clone();
        this.x = initialVector.x * Math.cos(angle) - initialVector.y * Math.sin(angle);
        this.y = initialVector.x * Math.sin(angle) + initialVector.y * Math.cos(angle);
        return this;
    }
}