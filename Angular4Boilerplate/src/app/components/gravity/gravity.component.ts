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
    canvasWidth: number;
    canvasHeight: number;
    mousePosition: IVector2d;
    isDrawing: boolean = true;
    ballCount: number = 25;
    testBall: IBall;

    ngAfterViewInit() {
        this.myCanvas = document.getElementById("myCanvas") as HTMLCanvasElement;
        this.context = this.myCanvas.getContext("2d");
        this.canvasHeight = this.myCanvas.height;
        this.canvasWidth = this.myCanvas.width;
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
        if (this.isDrawing) {
            requestAnimationFrame(() => {
                this.tick()
            });
        }
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.testBall.update();
        this.testBall.draw(this.context);
    }

    reset() {
        this.testBall = new Ball();
        this.testBall.color = "red";
        this.testBall.radius = 10;
        this.testBall.position = new Vector2d(100, 100);
        this.testBall.velocity = new Vector2d(1, 0);
    }
}
