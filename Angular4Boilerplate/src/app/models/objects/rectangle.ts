import { IVector2d, Vector2d } from '../vector2d/vector2d';
import { IColor, Color } from '../color/color';
import { IPhysicalObject2d } from './physicalObject2d';

export interface IRectangle extends IPhysicalObject2d {
    width: number;
    height: number;
    angle: number;
}

export class Rectangle implements IRectangle {
    position: IVector2d = new Vector2d(0, 0);
    velocity: IVector2d = new Vector2d(0, 0);
    acceleration: IVector2d = new Vector2d(0, 0);

    angle: number = 0;
    angularVelocity: number = 0;
    angularAcceleration: number = 0;

    color: IColor;
    width: number;
    height: number;
    mass: number;
    density: number;
    restitution: number;
    forces: IVector2d[] = [];
    isStatic: boolean = false;

    constructor(width: number, height: number, density: number = 1) {
        this.density = density;
        this.restitution = 1;
        this.width = width;
        this.height = height;
        this.mass = this.width * this.height * this.density;
        this.color = new Color(0, 0, 0);
        this.color.fromRange(this.mass, 0, 8000);
    }

    applyForce(force: IVector2d) {
        this.forces.push(force.clone());
    }

    update() {
        this.updateAcceleration();
        this.updateVelocity();
        this.updatePosition();
    }


    checkBoundaries(boundaries: IVector2d) {
        var boundaryX = boundaries.x;
        var boundaryY = boundaries.y;
        var isBounced: boolean = false;
        if (this.position.x + this.width / 2 > boundaryX) {
            this.position.x = boundaryX - this.width / 2;
            this.velocity.x *= -1;
            isBounced = true;
        }
        if (this.position.x - this.width / 2 < 0) {
            this.position.x = 0 + this.width / 2;
            this.velocity.x *= -1;
            isBounced = true;
        }
        if (this.position.y + this.height / 2 > boundaryY) {
            this.position.y = boundaryY - this.height / 2;
            this.velocity.y *= -1;
            isBounced = true;
        }
        if (this.position.y - this.height / 2 < 0) {
            this.position.y = 0 + this.height / 2;
            this.velocity.y *= -1;
            isBounced = true;
        }
        if (isBounced) {
            this.velocity.mult(this.restitution);
        }
    }

    private updateAcceleration() {
        var force = this.forces.pop();
        var forceSum = new Vector2d(0, 0);
        while (force != null) {
            forceSum.add(force);
            force = this.forces.pop();
        }
        this.acceleration.add(forceSum.div(this.mass));
    }

    private updateVelocity() {
        this.velocity.add(this.acceleration);
        this.acceleration = new Vector2d(0, 0);
        this.angularVelocity += this.angularAcceleration;
        //this.angularVelocity = Math.atan2(this.velocity.y / 50, this.velocity.x /50); //TEMP
        this.angularAcceleration = 0;
    }

    private updatePosition() {
        this.position.add(this.velocity);
        this.angle += this.angularVelocity;
    }

    private calculateBouncedPosition(position: number, boundary: number): number {
        return 2 * boundary - position;
    }

    draw(context: CanvasRenderingContext2D) {
        context.save();
        context.beginPath();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.angle);
        context.rect(-this.width / 2, -this.height / 2, this.width, this.height);
        context.fillStyle = this.color.toRGBA();
        context.fill();
        context.closePath();

        context.beginPath();
        context.lineWidth = 3;
        context.moveTo(0, 0);
        context.lineTo(-1 * this.width / 2, 0);
        context.strokeStyle = 'red';
        context.stroke();
        context.closePath();
        context.restore();

        // black frame without rotation
        //context.beginPath();
        //context.rect(this.getX(), this.getY(), this.width, this.height);
        //context.strokeStyle = "black";
        //context.stroke();
        //context.closePath();
    }

    private getX() {
        return this.position.x - this.width / 2;
    }

    private getY() {
        return this.position.y - this.height / 2;
    }
}