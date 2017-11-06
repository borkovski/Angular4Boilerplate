import { Component, HostListener, AfterViewInit } from '@angular/core';
import { IVector2d, Vector2d } from '../../models/vector2d/vector2d';
import { AnimatedCanvasComponent } from '../animated-canvas/animated-canvas.component';
import { Canvas2d } from '../../models/canvas2d/canvas2d';
import { IColor, Color } from '../../models/color/color';
import { Ball, IBall } from '../../models/objects/ball';
import { Spring, ISpring } from '../../models/objects/spring';
import { IPhysicalObject2d } from '../../models/objects/physicalObject2d';

@Component({
    selector: 'pendulum',
    templateUrl: './pendulum.component.html'
})
export class PendulumComponent {
    canvas: Canvas2d;
    origin: IBall;
    r: number = 400;
    angle: number = 0;
    bob: IBall;
    secondBob: IBall;
    gravity: number;
    isBobDrag: boolean = false;
    isSecondBobDrag: boolean = false;
    originSpring: ISpring;
    bobSpring: ISpring;
    gravityForce: IVector2d = new Vector2d(0, 100);
    bobSize: number = 40;


    reset(canvas: Canvas2d) {
        this.canvas = canvas;
        var canvasDimensions = canvas.getCanvasDimensions();
        this.origin = new Ball(5);
        this.origin.position = new Vector2d(canvasDimensions.x / 2, 20);
        this.origin.isDrawingHighlights = false;
        this.origin.isStatic = true;
        this.bob = new Ball(this.bobSize);
        this.secondBob = new Ball(this.bobSize);
        this.bob.position = this.origin.position.clone().fromPolar(this.angle, this.r);
        this.secondBob.position = this.bob.position.clone().fromPolar(this.angle, this.r);
        this.originSpring = new Spring(this.origin, this.bob);
        this.bobSpring = new Spring(this.bob, this.secondBob);
        this.gravity = .4;
    }

    tick(canvas: Canvas2d) {
        var ctx = canvas.getContext();
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.getCanvasDimensions().x, canvas.getCanvasDimensions().y);
        this.originSpring.update();
        this.bobSpring.update();
        if (this.isBobDrag) {
            this.bob.position = canvas.mousePosition.clone();
            this.bob.velocity = new Vector2d(0, 0);
        }
        else {
            this.bob.applyForce(this.gravityForce);
            this.bob.update();
        }
        if (this.isSecondBobDrag) {
            this.secondBob.position = canvas.mousePosition.clone();
            this.secondBob.velocity = new Vector2d(0, 0);
        }
        else {
            this.secondBob.applyForce(this.gravityForce);
            this.secondBob.update();
        }
        this.bob.handleCollision(this.secondBob);
        this.originSpring.draw(ctx);
        this.bobSpring.draw(ctx);
        this.origin.draw(ctx);
        this.bob.draw(ctx);
        this.secondBob.draw(ctx);
    }

    mouseDown(event) {
        if (this.canvas.mousePosition.clone().distance(this.bob.position) < this.bob.radius) {
            this.isBobDrag = true;
            this.bob.isStatic = true;
        }
        if (this.canvas.mousePosition.clone().distance(this.secondBob.position) < this.secondBob.radius) {
            this.isSecondBobDrag = true;
            this.secondBob.isStatic = true;
        }
    }

    mouseUp(event) {
        this.isBobDrag = false;
        this.isSecondBobDrag = false;
        this.bob.isStatic = false;
        this.secondBob.isStatic = false;
    }
}