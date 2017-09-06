import { IVector2d, Vector2d } from '../vector2d/vector2d';
import { IObject2d } from './object2d';

export interface IBall extends IObject2d {
    color: string;
    radius: number;
    mass: number;
    density: number;
    restitution: number;
    forces: IVector2d[];

    applyForce(force: IVector2d);
}

export class Ball implements IBall {
    position: IVector2d = new Vector2d(0, 0);
    velocity: IVector2d = new Vector2d(0, 0);
    acceleration: IVector2d = new Vector2d(0, 0);

    color: string;
    radius: number;
    mass: number;
    density: number;
    restitution: number;
    forces: IVector2d[] = [];

    constructor(radius: number) {
        this.density = 10;
        this.restitution = .91;
        this.radius = radius;
        this.mass = (2 * Math.PI * this.radius) / this.density;
        this.color = this.radius < 10 ? "blue" : this.radius < 20 ? "green" : this.radius < 30 ? "yellow" : this.radius < 40 ? "orange" : "red";

        console.log("NEW BALL: density - " + this.density + ", radius - " + this.radius + ", mass - " + this.mass + ", color - " + this.color);
    }

    applyForce(force: IVector2d) {
        this.forces.push(force.clone());
    }

    update() {
        this.updateAcceleration();
        this.updateVelocity();
        this.updatePosition();
        this.checkBoundaries();
    }

    private updateAcceleration() {
        var force = this.forces.pop();
        while (force != null) {
            this.acceleration.add(force);
            force = this.forces.pop();
        }
    }

    private updateVelocity() {
        this.velocity.add(this.acceleration);
    }

    private updatePosition() {
        this.position.add(this.velocity).round(0);
    }

    private checkBoundaries() {
        var boundaryX = 512;
        var boundaryY = 512;
        var isBounced: boolean = false;
        if (this.position.x + this.radius > boundaryX) {
            this.position.x = this.calculateBouncedPosition(this.position.x + this.radius, boundaryX) - this.radius;
            isBounced = true;
        }
        if (this.position.x - this.radius < 0) {
            this.position.x = this.calculateBouncedPosition(this.position.x - this.radius, 0) + this.radius;
            isBounced = true;
        }
        if (this.position.y + this.radius > 512) {
            this.position.y = this.calculateBouncedPosition(this.position.y + this.radius, boundaryY) - this.radius;
            isBounced = true;
        }
        if (this.position.y - this.radius < 0) {
            this.position.y = this.calculateBouncedPosition(this.position.y - this.radius, 0) + this.radius;
            isBounced = true;
        }
        if (isBounced) {
            this.velocity.mult(-1).mult(this.restitution).round(2);
        }
    }

    private calculateBouncedPosition(position: number, boundary: number): number {
        return 2 * boundary - position;
    }

    draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }
}