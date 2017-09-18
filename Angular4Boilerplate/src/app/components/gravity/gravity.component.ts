import { Component, AfterViewInit } from '@angular/core';
import { IVector2d, Vector2d } from '../../models/vector2d/vector2d';
import { Ball, IBall } from '../../models/objects/ball';

@Component({
    selector: 'gravity',
    templateUrl: './gravity.component.html'
})
export class GravityComponent implements AfterViewInit {
    context: CanvasRenderingContext2D;
    myCanvas: HTMLCanvasElement;
    canvasDimensions: IVector2d;
    mousePosition: IVector2d;
    ballCount: number = 100;
    testBalls: Array<IBall> = new Array<IBall>();
    isSteppedDraw: boolean = true;
    isCentralGravityActive: boolean = false;
    isFloorGravityActive: boolean = false;
    isBoudariesCheckActive: boolean = true;
    isCollisionHandling: boolean = false;
    isDrawingHighlights: boolean = true;
    gravityCenter: IBall;

    ngAfterViewInit() {
        this.myCanvas = document.getElementById("myCanvas") as HTMLCanvasElement;
        this.context = this.myCanvas.getContext("2d");
        this.canvasDimensions = new Vector2d(this.myCanvas.width, this.myCanvas.height);
        this.myCanvas.addEventListener('mousemove', (evt) => {
            this.mousePosition = this.getMousePos(this.myCanvas, evt);
        }, false);
        this.reset();
        this.tick();
    }

    getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return new Vector2d(evt.clientX - rect.left, evt.clientY - rect.top);
    }

    tick() {
        if (!this.isSteppedDraw) {
            requestAnimationFrame(() => {
                this.tick()
            });
        }
        this.canvasDimensions = new Vector2d(this.myCanvas.width, this.myCanvas.height);
        this.context.clearRect(0, 0, this.canvasDimensions.x, this.canvasDimensions.y);
        if (this.isCentralGravityActive) {
            this.gravityCenter.position = new Vector2d(this.canvasDimensions.x / 2, this.canvasDimensions.y / 2);
            this.drawGravityCenter();
        }
        if (this.isFloorGravityActive) {
            this.drawFloorGravity();
        }
        for (var testBall of this.testBalls) {
            if (this.isCentralGravityActive) {
                this.applyCenterGravity(testBall);
            }
            if (this.isFloorGravityActive) {
                this.applyFloorGravity(testBall);
            }
            testBall.update();
            if (this.isBoudariesCheckActive) {
                testBall.checkBoundaries(this.canvasDimensions);
            }
            if (this.isCollisionHandling) {
                for (var collidingBall of this.testBalls) {
                    if (testBall != collidingBall) {
                        testBall.handleCollision(collidingBall);
                    }
                }
            }
            testBall.isDrawingHighlights = this.isDrawingHighlights;
            testBall.draw(this.context);
        }
    }

    drawFloorGravity() {
        this.context.beginPath();
        this.context.moveTo(0, this.canvasDimensions.y);
        this.context.lineTo(this.canvasDimensions.x, this.canvasDimensions.y);
        this.context.strokeStyle = "red";
        this.context.stroke();
        this.context.closePath();
    }

    drawGravityCenter() {
        this.context.beginPath();
        this.context.arc(this.gravityCenter.position.x, this.gravityCenter.position.y, this.gravityCenter.radius, 0, 2 * Math.PI, false);
        this.context.fillStyle = this.gravityCenter.color.toRGBA();
        this.context.fill();
        this.context.closePath();
    }

    applyCenterGravity(testBall: IBall) {
        var distance = testBall.position.distance(this.gravityCenter.position);
        var gravityForceY = ((testBall.mass * this.gravityCenter.mass) / (distance * distance));
        testBall.applyForce(this.gravityCenter.position.clone().sub(testBall.position).normalize().mult(gravityForceY));
    }

    applyFloorGravity(testBall: IBall) {
        var floorPosition = new Vector2d(this.canvasDimensions.x / 2, this.canvasDimensions.y + 1000);
        var distance = testBall.position.distance(floorPosition);
        var gravityForceY = ((testBall.mass * 1000000) / (distance * distance));
        testBall.applyForce(new Vector2d(0, floorPosition.y - testBall.position.y).normalize().mult(gravityForceY));
    }

    reset() {
        this.testBalls = new Array<IBall>();
        this.gravityCenter = new Ball(1, 1000);
        for (var i = 0; i < this.ballCount; i++) {
            var testBall = new Ball(1 + Math.random() * 40);
            testBall.position = new Vector2d(Math.random() * this.canvasDimensions.x, Math.random() * this.canvasDimensions.y);
            testBall.velocity = new Vector2d((Math.random() - .5) * 5, (Math.random() - .5) * 5);
            this.testBalls.push(testBall);
        }
    }

    triggerStep(event: any) {
        this.tick();
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
