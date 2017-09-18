import { Component, HostListener, AfterViewInit } from '@angular/core';
import { IVector2d, Vector2d } from '../../models/vector2d/vector2d';
import { Rectangle, IRectangle } from '../../models/objects/rectangle';
import { AnimatedCanvasComponent } from '../animated-canvas/animated-canvas.component';
import { Canvas2d } from '../../models/canvas2d/canvas2d';

@Component({
    selector: 'angular-motion',
    templateUrl: './angular-motion.component.html'
})
export class AngularMotionComponent {
    testRectangle: IRectangle;

    reset(canvas: Canvas2d) {
        this.testRectangle = new Rectangle(1 + Math.random() * 100, 1 + Math.random() * 100);
        var canvasDimensions = canvas.getCanvasDimensions();
        this.testRectangle.position = new Vector2d(Math.random() * canvasDimensions.x, Math.random() * canvasDimensions.y);
    }

    tick(canvas: Canvas2d) {
        this.applyMouseGravity(this.testRectangle, canvas);
        this.testRectangle.update();
        this.testRectangle.angle = Math.atan2(this.testRectangle.position.y - canvas.mousePosition.y, this.testRectangle.position.x - canvas.mousePosition.x);
        var canvasDimensions = canvas.getCanvasDimensions();
        this.testRectangle.checkBoundaries(canvasDimensions);
        this.testRectangle.draw(canvas.getContext());
    }

    applyMouseGravity(testRectangle: IRectangle, canvas: Canvas2d) {
        var distance = testRectangle.position.distance(canvas.mousePosition);
        var gravityForceY = testRectangle.mass;
        testRectangle.applyForce(canvas.mousePosition.clone().sub(testRectangle.position).normalize().mult(gravityForceY));
    }
}