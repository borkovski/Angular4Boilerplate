import { Component, AfterViewInit } from '@angular/core';
import { IVector2d, Vector2d } from '../../models/vector2d/vector2d';
import { Ball, IBall } from '../../models/objects/ball';
import { AnimatedCanvasComponent } from '../animated-canvas/animated-canvas.component';
import { Canvas2d } from '../../models/canvas2d/canvas2d';

@Component({
    selector: 'gravity',
    templateUrl: './gravity.component.html'
})
export class GravityComponent {
    ballCount: number = 100;
    testBalls: Array<IBall> = new Array<IBall>();
    isCentralGravityActive: boolean = false;
    isFloorGravityActive: boolean = false;
    isBoudariesCheckActive: boolean = true;
    isCollisionHandling: boolean = false;
    isDrawingHighlights: boolean = true;
    gravityCenter: IBall;
    
    reset(canvas: Canvas2d) {
        this.testBalls = new Array<IBall>();
        this.gravityCenter = new Ball(1, 1000);
        for (var i = 0; i < this.ballCount; i++) {
            var testBall = new Ball(1 + Math.random() * 40);
            var canvasDimensions = canvas.getCanvasDimensions();
            testBall.position = new Vector2d(Math.random() * canvasDimensions.x, Math.random() * canvasDimensions.y);
            testBall.velocity = new Vector2d((Math.random() - .5) * 5, (Math.random() - .5) * 5);
            this.testBalls.push(testBall);
        }
    }

    tick(canvas: Canvas2d) {
        var canvasDimensions = canvas.getCanvasDimensions();
        var context = canvas.getContext();
        if (this.isCentralGravityActive) {
            this.gravityCenter.position = new Vector2d(canvasDimensions.x / 2, canvasDimensions.y / 2);
            this.drawGravityCenter(context);
        }
        if (this.isFloorGravityActive) {
            this.drawFloorGravity(context, canvasDimensions);
        }
        for (var testBall of this.testBalls) {
            if (this.isCentralGravityActive) {
                this.applyCenterGravity(testBall);
            }
            if (this.isFloorGravityActive) {
                this.applyFloorGravity(testBall, canvasDimensions);
            }
            testBall.update();
            if (this.isBoudariesCheckActive) {
                testBall.checkBoundaries(canvasDimensions);
            }
            if (this.isCollisionHandling) {
                for (var collidingBall of this.testBalls) {
                    if (testBall != collidingBall) {
                        testBall.handleCollision(collidingBall);
                    }
                }
            }
            testBall.isDrawingHighlights = this.isDrawingHighlights;
            testBall.draw(context);
        }
    }

    drawFloorGravity(context: CanvasRenderingContext2D, canvasDimensions: IVector2d) {
        context.beginPath();
        context.moveTo(0, canvasDimensions.y);
        context.lineTo(canvasDimensions.x, canvasDimensions.y);
        context.strokeStyle = "red";
        context.stroke();
        context.closePath();
    }

    drawGravityCenter(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.gravityCenter.position.x, this.gravityCenter.position.y, this.gravityCenter.radius, 0, 2 * Math.PI, false);
        context.fillStyle = this.gravityCenter.color.toRGBA();
        context.fill();
        context.closePath();
    }

    applyCenterGravity(testBall: IBall) {
        var distance = testBall.position.distance(this.gravityCenter.position);
        var gravityForceY = ((testBall.mass * this.gravityCenter.mass) / (distance * distance));
        testBall.applyForce(this.gravityCenter.position.clone().sub(testBall.position).normalize().mult(gravityForceY));
    }

    applyFloorGravity(testBall: IBall, canvasDimensions: IVector2d) {
        var floorPosition = new Vector2d(canvasDimensions.x / 2, canvasDimensions.y + 1000);
        var distance = testBall.position.distance(floorPosition);
        var gravityForceY = ((testBall.mass * 1000000) / (distance * distance));
        testBall.applyForce(new Vector2d(0, floorPosition.y - testBall.position.y).normalize().mult(gravityForceY));
    }

    centralGravityChanged(event: any) {
        this.isFloorGravityActive = this.isFloorGravityActive && !this.isCentralGravityActive;
        this.isBoudariesCheckActive = !this.isCentralGravityActive;
    }

    floorGravityChanged(event: any) {
        this.isCentralGravityActive = this.isCentralGravityActive && !this.isFloorGravityActive;
        this.isBoudariesCheckActive = !this.isCentralGravityActive;

    }
}
