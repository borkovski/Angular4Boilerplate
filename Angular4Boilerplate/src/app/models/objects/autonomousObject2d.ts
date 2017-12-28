import { IVector2d, Vector2d } from '../vector2d/vector2d';
import { IColor, Color } from '../color/color';
import { IObject2d } from './object2d';
import { TextureObject2d, ITextureObject2d } from '../../models/objects/textureObject2d';

export interface IAutonomousObject2d {

    setDestination(destination: IVector2d);
    update();
    draw(context: CanvasRenderingContext2D);
}

export class AutonomousObject2d implements IAutonomousObject2d {
    texturedObject: ITextureObject2d;
    destination: IVector2d;
    maxSpeed: number = 15;
    maxReverse: number = 5;
    speedToAccelerationCoefficient: number = 30;
    isInReverse: boolean = false;
    maxAngle: number = .05;
    gasForce: number = 0;
    prevDestinationAngle: number = 0;
    prevDistance: number = 0;
    backFromReverseAngle: number = 0;

    steeringWheel: ITextureObject2d;
    canvasDimensions: IVector2d;

    constructor(image: HTMLImageElement, width: number, height: number, canvasDimensions: IVector2d) {
        this.canvasDimensions = canvasDimensions;
        this.texturedObject = new TextureObject2d(image, width, height);
        this.texturedObject.position = new Vector2d(Math.random() * canvasDimensions.x, Math.random() * canvasDimensions.y);
        var steeringWheelImage = document.getElementById('steeringWheelImage') as HTMLImageElement;
        this.steeringWheel = new TextureObject2d(steeringWheelImage, 128, 128);
        this.steeringWheel.position = new Vector2d(this.canvasDimensions.x / 2, this.canvasDimensions.y - 50);
    }

    setDestination(destination: IVector2d): void {
        this.destination = destination;
        this.prevDestinationAngle = this.getDestinationAngle();
    }

    update() {
        if (!this.destination) {
            return;
        }
        var initialDestinationAngle = this.getDestinationAngle();
        var initialDistance = this.destination.clone().distance(this.texturedObject.position.clone());
        this.tryChangeGear();
        this.turn();
        this.tryChangeVelocity();
        this.texturedObject.update();
        this.steeringWheel.update();
        this.prevDestinationAngle = initialDestinationAngle;
        this.prevDistance = initialDistance;
    }

    draw(context: CanvasRenderingContext2D): void {
        if (this.destination) {
            this.drawDestination(context);
        }
        this.texturedObject.draw(context);
        this.drawForce(context);
        this.steeringWheel.draw(context);
        this.drawGear(context);
    }


    private tryChangeGear(): void {
        if (this.shouldReverse()) {
            this.gearToReverse();
        }
        else if (this.isInReverse && this.shouldDrive()) {
            this.gearToDrive();
        }
    }

    private shouldReverse(): boolean {
        return this.prevDestinationAngle != 0
            && Math.abs(this.prevDestinationAngle) < Math.abs(this.getDestinationAngle())
            && this.prevDistance > 0 && this.getDistanceToDestination() > this.prevDistance
            && !this.isInReverse
    }

    private getDistanceToDestination(): number {
        return this.destination.clone().distance(this.texturedObject.position.clone());
    }

    private gearToReverse(): void {
        this.isInReverse = true;
        this.backFromReverseAngle = this.getDestinationAngle() / 10;
    }

    private shouldDrive(): boolean {
        return Math.abs(this.getDestinationAngle()) < Math.abs(this.backFromReverseAngle);
    }

    private gearToDrive(): void {
        this.isInReverse = false;
        this.prevDestinationAngle = 0;
        this.prevDistance = 0;
        this.backFromReverseAngle = 0;
    }


    private turn(): void {
        var addAngle = this.addAngle();
        this.texturedObject.rotate(addAngle);
        this.steeringWheel.angle = addAngle * Math.PI / this.maxAngle;
    }

    private addAngle(): number {
        var destinationAngle = this.getDestinationAngle();
        var currentSpeed = this.texturedObject.velocity.mag();
        var maxAngleAvailable = this.maxAngle * currentSpeed / this.getMaxSpeed();
        return Math.min(Math.abs(destinationAngle), maxAngleAvailable) * Math.sign(destinationAngle);
    }


    private tryChangeVelocity(): void {
        if (this.shouldHandBrake()) {
            this.handBrake();
        }
        else if (this.shouldPrepareGearChange()) {
            this.slowDown(1);
        }
        else if (this.shouldSlowDown()) {
            var brakeFraction = 1 - this.getDestinationVector().mag() / (this.texturedObject.velocity.mag() * this.speedToAccelerationCoefficient);
            this.slowDown(brakeFraction);
        }
        else if (this.shouldAccelerate()) {
            var gasFraction = Math.min(this.getMaxSpeed() - this.texturedObject.velocity.mag(), 1);
            this.accelerate(gasFraction);
        }
    }

    private shouldHandBrake(): boolean {
        return this.getDestinationVector().mag() <= this.getMaxSpeed() * this.getMaxAcceleration();
    }

    private shouldPrepareGearChange(): boolean {
        return this.getCurrentVelocitySign() == -1 && this.isInReverse || this.getCurrentVelocitySign() == 1 && !this.isInReverse;
    }

    private shouldSlowDown(): boolean {
        return this.getDestinationVector().mag() < this.texturedObject.velocity.mag() * this.speedToAccelerationCoefficient;
    }

    private shouldAccelerate(): boolean {
        return !this.shouldSlowDown()
            && !this.shouldPrepareGearChange()
            && !this.shouldHandBrake()
            && this.texturedObject.velocity.mag() < this.getMaxSpeed();
    }

    private getDestinationVector(): IVector2d {
        return this.destination.clone().sub(this.texturedObject.position);
    }

    private getDestinationAngle(): number {
        return Math.round(this.getDestinationVector().clone().normalize().rotate(Math.PI / 2).getAngle(new Vector2d(1,0).rotate(this.texturedObject.angle).normalize()) * 10000)/10000;
    }

    private getMaxAcceleration(): number {
        return this.getMaxSpeed() / this.speedToAccelerationCoefficient;
    }

    private getMaxSpeed(): number {
        return this.isInReverse ? this.maxReverse : this.maxSpeed;
    }

    private slowDown(brakeFraction: number): void {
        this.addForce(brakeFraction * -1 / this.getMaxAcceleration());
    }

    private accelerate(gasFraction: number): void {
        this.addForce(gasFraction);
    }

    private addForce(fraction: number): void {
        var currentSign = this.getCurrentVelocitySign();
        this.gasForce = this.getMaxAcceleration() * fraction * currentSign;
        this.texturedObject.applyForce(new Vector2d(0, this.gasForce));
    }

    private getCurrentVelocitySign(): number {
        return this.texturedObject.velocity.y != 0 ? Math.sign(this.texturedObject.velocity.y) : this.isInReverse ? 1 : -1;
    }

    private handBrake(): void {
        this.gasForce = 0;
        this.texturedObject.velocity.mult(0);
    }


    private drawDestination(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.arc(this.destination.x, this.destination.y, 5, 0, 2 * Math.PI, false);
        context.fillStyle = 'red';
        context.fill();
        context.closePath();
    }

    private drawForce(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.rect(this.canvasDimensions.x / 2 - 120, this.canvasDimensions.y - 50, 40, (this.gasForce * 40) * (this.isInReverse ? -1 : 1));
        context.fillStyle = this.gasForce > 0 && !this.isInReverse || this.gasForce <= 0 && this.isInReverse ? 'red' : 'green';
        context.fill();
        context.closePath();
        context.beginPath();
        context.rect(this.canvasDimensions.x / 2 - 120, this.canvasDimensions.y - 90, 40, 80);
        context.stroke();
        context.closePath();
    }

    private drawGear(context: CanvasRenderingContext2D): void {
        context.fillStyle = 'black';
        context.font = '50px Arial';
        context.fillText(this.isInReverse ? 'R' : 'D', this.canvasDimensions.x / 2 + 80, this.canvasDimensions.y - 40);
    }
}