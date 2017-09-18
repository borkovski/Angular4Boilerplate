import { Component, HostListener, AfterViewInit } from '@angular/core';
import { IVector2d, Vector2d } from '../../models/vector2d/vector2d';
import { Rectangle, IRectangle } from '../../models/objects/rectangle';

@Component({
    selector: 'angular-motion',
    templateUrl: './angular-motion.component.html'
})
export class AngularMotionComponent implements AfterViewInit {
    context: CanvasRenderingContext2D;
    myCanvas: HTMLCanvasElement;
    canvasDimensions: IVector2d;
    canvasScale: IVector2d;
    mousePosition: IVector2d = new Vector2d(0,0);
    testRectangle: IRectangle;

    ngAfterViewInit() {
        this.myCanvas = document.getElementById("myCanvas") as HTMLCanvasElement;
        this.context = this.myCanvas.getContext("2d");
        this.canvasDimensions = new Vector2d(this.myCanvas.width, this.myCanvas.height);
        this.canvasScale = new Vector2d(this.myCanvas.width / this.myCanvas.offsetWidth, this.myCanvas.height / this.myCanvas.offsetHeight);
        this.reset();
        this.tick();
    }

    @HostListener('mousemove', ['$event'])
    onMousemove(event: MouseEvent) {
        this.mousePosition = this.getMousePos(this.myCanvas, event);
    }
    
    getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return new Vector2d((evt.clientX - rect.left) * this.canvasScale.x, (evt.clientY - rect.top) * this.canvasScale.y);
    }

    tick() {
        requestAnimationFrame(() => {
            this.tick()
        });
        this.canvasDimensions = new Vector2d(this.myCanvas.width, this.myCanvas.height);
        this.context.clearRect(0, 0, this.canvasDimensions.x, this.canvasDimensions.y);
        this.applyMouseGravity(this.testRectangle);
        this.testRectangle.update();
        this.testRectangle.angle = Math.atan2(this.testRectangle.position.y - this.mousePosition.y, this.testRectangle.position.x - this.mousePosition.x);
        this.testRectangle.checkBoundaries(this.canvasDimensions);
        this.testRectangle.draw(this.context);
    }

    applyMouseGravity(testRectangle: IRectangle) {
        var distance = testRectangle.position.distance(this.mousePosition);
        var gravityForceY = testRectangle.mass;
        testRectangle.applyForce(this.mousePosition.clone().sub(testRectangle.position).normalize().mult(gravityForceY));
    }

    reset() {
        this.testRectangle = new Rectangle(1 + Math.random() * 100, 1 + Math.random() * 100);
        this.testRectangle.position = new Vector2d(Math.random() * this.canvasDimensions.x, Math.random() * this.canvasDimensions.y);
        //this.testRectangle.velocity = new Vector2d((Math.random() - .5) * 10, (Math.random() - .5) * 10);
        this.myCanvas.removeEventListener('mousemove', null, null);
    }
}