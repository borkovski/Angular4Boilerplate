import { Component, HostListener, AfterViewInit } from '@angular/core';
import { IVector2d, Vector2d } from '../../models/vector2d/vector2d';
import { AnimatedCanvasComponent } from '../animated-canvas/animated-canvas.component';
import { Canvas2d } from '../../models/canvas2d/canvas2d';
import { IColor, Color } from '../../models/color/color';

@Component({
    selector: 'simple-wave',
    templateUrl: './simple-wave.component.html'
})
export class SimpleWaveComponent {
    canvas: Canvas2d;
    angle: number = 0;
    period: number = 0;
    speed: number = 0;
    distance: number = 0;

    reset(canvas: Canvas2d) {
        this.canvas = canvas;
        var canvasDimensions = canvas.getCanvasDimensions();
        this.angle = 0;
        this.period = 10;
        this.speed = .1;
        this.distance = .5;
    }

    tick(canvas: Canvas2d) {
        var currentAngle = this.angle;
        var ctx = canvas.getContext();
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.getCanvasDimensions().x, canvas.getCanvasDimensions().y);
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.lineWidth = 5;
        for (var x = 0; x < canvas.getCanvasDimensions().x; x += this.period) {
            var y = this.map(Math.sin(currentAngle), -1, 1, 0, canvas.getCanvasDimensions().y);
            currentAngle = (currentAngle + this.distance) % (2 * Math.PI);
            if (x == 0) {
                ctx.moveTo(x, y);
            }
            else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        ctx.closePath();
        this.angle += this.speed;
    }

    map(currentValue: number, minValue: number, maxValue: number, minMappedValue: number, maxMappedValue: number): number {
        return (maxMappedValue - minMappedValue) * (currentValue - minValue) / (maxValue - minValue) + minMappedValue;
    }
}