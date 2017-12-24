import { IVector2d, Vector2d } from '../vector2d/vector2d';
import { IPhysicalObject2d } from './physicalObject2d';
import { IColor, Color } from '../color/color';

export interface IParticle extends IPhysicalObject2d {
    radius: number;
    density: number;
    lifespan: number;
    lifeRemaining: number;

    isDead(): boolean;
}


export class Particle implements IParticle {
    position: IVector2d = new Vector2d(0, 0);
    velocity: IVector2d = new Vector2d(0, 0);
    acceleration: IVector2d = new Vector2d(0, 0);
    radius: number;
    lifespan: number;
    lifeRemaining: number;
    color: IColor;
    mass: number;
    density: number = .03;
    restitution: number;
    forces: IVector2d[] = new Array<IVector2d>();
    isStatic: boolean = false;

    angle: number = 0;

    constructor(radius: number = 1, lifespan: number = 500, color: IColor = new Color(100, 100, 100)) {
        this.radius = radius;
        this.lifespan = lifespan;
        this.lifeRemaining = lifespan;
        this.restitution = .9;
        this.mass = (2 * Math.PI * this.radius) * this.density;
        this.color = color;
    }

    isDead(): boolean {
        return this.lifeRemaining < 0;
    }

    applyForce(force: IVector2d) {
        this.forces.push(force.clone());
    }

    rotate(value: number) {
        this.angle += value;
    }

    update() {
        this.updateAcceleration();
        this.updateVelocity();
        this.updatePosition();
        this.updateLifespan();
    }

    private updateLifespan() {
        this.lifeRemaining--;
        this.color.a = this.lifeRemaining / this.lifespan;
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
        this.velocity.add(this.acceleration).mult(.999);
        this.acceleration = new Vector2d(0, 0);
    }

    private updatePosition() {
        this.position.add(this.velocity);
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

    draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
        var gradient = context.createRadialGradient(this.position.x, this.position.y, this.radius, this.position.x, this.position.y, 0);
        var endColor = this.color.clone();
        endColor.a = 0;
        gradient.addColorStop(0, endColor.toRGBA());
        gradient.addColorStop(1, this.color.toRGBA());
        context.fillStyle = gradient;
        context.fill();
        context.closePath();
    }
}