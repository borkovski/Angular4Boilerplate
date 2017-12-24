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

    constructor(image: HTMLImageElement, width: number, height: number, position: IVector2d) {
        this.texturedObject = new TextureObject2d(image, width, height);
        this.texturedObject.position = position;
        var steeringWheelImage = document.getElementById('steeringWheelImage') as HTMLImageElement;
        this.steeringWheel = new TextureObject2d(steeringWheelImage, 64, 64);
        this.steeringWheel.position = new Vector2d(100, 100);
    }

    update() {
        if (!this.destination) {
            return;
        }
        var currentSpeed = this.texturedObject.velocity.mag();
        var maxAngleAvailable = this.maxAngle * currentSpeed / this.getMaxSpeed();
        var destinationVector = this.getDestinationVector();
        var distance = this.destination.clone().distance(this.texturedObject.position.clone());
        var destinationAngle = this.getDestinationAngle(destinationVector);

        if (this.prevDestinationAngle != 0
            && Math.abs(this.prevDestinationAngle) < Math.abs(destinationAngle)
            && this.prevDistance > 0 && distance > this.prevDistance
            && !this.isInReverse) {
            this.isInReverse = true;
            this.backFromReverseAngle = destinationAngle / 10;
        }
        else if (this.isInReverse && Math.abs(destinationAngle) < Math.abs(this.backFromReverseAngle)) {
            this.isInReverse = false;
            this.prevDestinationAngle = 0;
            this.prevDistance = 0;
            this.backFromReverseAngle = 0;
        }

        var addAngle = Math.min(Math.abs(destinationAngle), maxAngleAvailable) * Math.sign(destinationAngle);
        this.turn(addAngle);

        var brakeFraction = 0;
        var gasFraction = 0;
        if (destinationVector.mag() > this.getMaxSpeed() * this.getMaxAcceleration()) {
            if (destinationVector.mag() < currentSpeed * this.speedToAccelerationCoefficient) {
                brakeFraction = 1 - destinationVector.mag() / (currentSpeed * this.speedToAccelerationCoefficient);
                this.slowDown(brakeFraction);
            }
            else if (this.getCurrentVelocitySign() == -1 && this.isInReverse || this.getCurrentVelocitySign() == 1 && !this.isInReverse) {
                this.slowDown(1);
            }
            else if (currentSpeed < this.getMaxSpeed()) {
                gasFraction = Math.min(this.getMaxSpeed() - currentSpeed, 1);
                this.accelerate(gasFraction);
            }
        }
        else {
            this.handBrake();
        }
        console.log('' +
            //'; destinationVectorMag: ' + destinationVector.mag() +
            //'; maxSpeed * maxAcceleration: ' + (this.getMaxSpeed() * this.getMaxAcceleration()) +
            //'; currentSpeed * coefficient: ' + (currentSpeed * this.speedToAccelerationCoefficient) +
            '; brakeFraction / gasFraction: ' + (this.getMaxAcceleration() * brakeFraction) + ' ' + gasFraction + 
            //'; addAngle: ' + addAngle +
            //'; angle: ' + this.texturedObject.angle +
            '; currentSpeed: ' + currentSpeed +
            '; velocity: ' + this.texturedObject.velocity.log() +
            //'; destinationAngle: ' + destinationAngle +
            //'; prevDestinationAngle: ' + this.prevDestinationAngle +
            '; distance: ' + distance +
            //'; prevDistance: ' + this.prevDistance +
            //'; backFromReverseAngle: ' + this.backFromReverseAngle +
            '; isInReverse: ' + this.isInReverse);
        this.texturedObject.update();
        this.steeringWheel.update();
        this.prevDestinationAngle = destinationAngle;
        this.prevDistance = distance;
    }

    private getDestinationVector(): IVector2d {
        return this.destination.clone().sub(this.texturedObject.position);
    }

    private getDestinationAngle(destinationVector: IVector2d): number {
        return Math.round(destinationVector.clone().normalize().rotate(Math.PI / 2).getAngle(new Vector2d(1,0).rotate(this.texturedObject.angle).normalize()) * 10000)/10000;
    }

    private getMaxAcceleration(): number {
        return this.getMaxSpeed() / this.speedToAccelerationCoefficient;
    }

    private getMaxSpeed(): number {
        return this.isInReverse ? this.maxReverse : this.maxSpeed;
    }

    private turn(addAngle: number) {
        this.texturedObject.rotate(addAngle);
        this.steeringWheel.angle = addAngle * Math.PI / this.maxAngle;
    }

    private slowDown(brakeFraction: number) {
        this.addForce(brakeFraction * -1 / this.getMaxAcceleration());
    }

    private accelerate(gasFraction: number) {
        this.addForce(gasFraction);
    }

    private addForce(fraction: number) {
        var currentSign = this.getCurrentVelocitySign();
        this.gasForce = this.getMaxAcceleration() * fraction * currentSign;
        this.texturedObject.applyForce(new Vector2d(0, this.gasForce));
    }

    private getCurrentVelocitySign() {
        return this.texturedObject.velocity.y != 0 ? Math.sign(this.texturedObject.velocity.y) : this.isInReverse ? 1 : -1;
    }

    private handBrake() {
        this.gasForce = 0;
        this.texturedObject.velocity.mult(0);
    }

    draw(context: CanvasRenderingContext2D) {
        if (this.destination) {
            context.beginPath();
            context.arc(this.destination.x, this.destination.y, 5, 0, 2 * Math.PI, false);
            context.fillStyle = 'red';
            context.fill();
            context.closePath();
        }
        this.texturedObject.draw(context);
        context.beginPath();
        context.rect(20, 100, 40, (this.gasForce * 50) * (this.isInReverse ? -1 : 1));
        context.fillStyle = this.gasForce > 0 && !this.isInReverse || this.gasForce <= 0 && this.isInReverse ? 'red' : 'green';
        context.fill();
        context.closePath();
        this.steeringWheel.draw(context);
        context.fillStyle = 'black';
        context.font = '32px Arial';
        context.fillText(this.isInReverse ? 'R' : 'D', 20, 40);
    }

    setDestination(destination: IVector2d) {
        this.destination = destination;
        this.prevDestinationAngle = this.getDestinationAngle(this.getDestinationVector());
    }
}