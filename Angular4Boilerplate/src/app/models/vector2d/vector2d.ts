export interface IVector2d {
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
}