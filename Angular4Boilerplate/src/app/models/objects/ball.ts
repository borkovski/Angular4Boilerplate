import { IVector2d, Vector2d } from '../vector2d/vector2d';
import { IColor, Color } from '../color/color';
import { IPhysicalObject2d } from './physicalObject2d';

export interface IBall extends IPhysicalObject2d {
    radius: number;
    isDrawingHighlights: boolean;
    isStatic: boolean;

    handleCollision(collidingObject: IBall);
}

export class Ball implements IBall {
    position: IVector2d = new Vector2d(0, 0);
    velocity: IVector2d = new Vector2d(0, 0);
    acceleration: IVector2d = new Vector2d(0, 0);

    angle: number = 0;

    color: IColor;
    radius: number;
    mass: number; 
    density: number;
    restitution: number;
    forces: IVector2d[] = [];
    isDrawingHighlights: boolean;
    isStatic: boolean;

    constructor(radius: number, density: number = 1) {
        this.density = density;
        this.restitution = .9;
        this.radius = radius;
        this.mass = (2 * Math.PI * this.radius) * this.density;
        this.color = new Color(0, 0, 0);
        this.color.fromRange(this.mass, 0, 255);
        this.isDrawingHighlights = true;
    }

    applyForce(force: IVector2d) {
        this.forces.push(force.clone());
    }

    rotate(value: number) {
        this.angle += value;
    }

    handleCollision(collidingObject: IBall) {
        if (this.isColliding(collidingObject)) {
            var n: IVector2d = this.position.clone().sub(collidingObject.position.clone()).normalize();
            var a1: number = this.velocity.clone().dot(n);
            var a2: number = collidingObject.velocity.clone().dot(n);
            var optimizedP: number = (2 * (a1 - a2)) / (this.mass + collidingObject.mass);
            this.velocity = this.velocity.clone().sub(n.clone().mult(optimizedP).mult(collidingObject.mass)).mult(this.restitution);
            collidingObject.velocity = collidingObject.velocity.clone().add(n.clone().mult(optimizedP).mult(this.mass)).mult(collidingObject.restitution);
            var intersection = this.position.distance(collidingObject.position) - this.radius - collidingObject.radius;
            this.position.sub(n.clone().mult(intersection / 2));
            collidingObject.position.add(n.clone().mult(intersection / 2));
        }
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
        if (this.position.x + this.radius > boundaryX) {
            this.position.x = boundaryX - this.radius;
            this.velocity.x *= -1;
            isBounced = true;
        }
        if (this.position.x - this.radius < 0) {
            this.position.x = 0 + this.radius;
            this.velocity.x *= -1;
            isBounced = true;
        }
        if (this.position.y + this.radius > boundaryY) {
            this.position.y = boundaryY - this.radius;
            this.velocity.y *= -1;
            isBounced = true;
        }
        if (this.position.y - this.radius < 0) {
            this.position.y = 0 + this.radius;
            this.velocity.y *= -1;
            isBounced = true;
        }
        if (isBounced) {
            this.velocity.mult(this.restitution);
        }
    }

    private isColliding(collisionObject: IBall): boolean {
        return this.position.distance(collisionObject.position) < this.radius + collisionObject.radius;
    }

    private updateAcceleration() {
        var force = this.forces.pop();
        var forceSum = new Vector2d(0,0);
        while (force != null) {
            forceSum.add(force);
            force = this.forces.pop();
        }
        this.acceleration.add(forceSum.div(this.mass));
    }

    private updateVelocity() {
        this.velocity.add(this.acceleration).mult(.999);
        this.acceleration = new Vector2d(0, 0);
    }

    private updatePosition() {
        this.position.add(this.velocity);
    }

    private calculateBouncedPosition(position: number, boundary: number): number {
        return 2 * boundary - position;
    }

    draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = this.color.toRGBA();
        context.fill();
        if (this.isDrawingHighlights) {
            var gradient = context.createRadialGradient(this.position.x, this.position.y, 1, this.position.x, this.position.y, this.radius * .9);
            gradient.addColorStop(0, new Color(255, 255, 255, .5).toRGBA());
            gradient.addColorStop(1, this.color.toRGBA());
            context.fillStyle = gradient;
            context.fill();
        }
        context.closePath();
    }
}