import { Component, HostListener, AfterViewInit } from '@angular/core';
import { IVector2d, Vector2d } from '../../models/vector2d/vector2d';
import { AnimatedCanvasComponent } from '../animated-canvas/animated-canvas.component';
import { Canvas2d } from '../../models/canvas2d/canvas2d';
import { IColor, Color } from '../../models/color/color';
import { Ball, IBall } from '../../models/objects/ball';
import { Spring, ISpring } from '../../models/objects/spring';
import { IPhysicalObject2d } from '../../models/objects/physicalObject2d';
import { AutonomousObject2d, IAutonomousObject2d } from '../../models/objects/autonomousObject2d';

@Component({
    selector: 'autonomous-vehicle',
    templateUrl: './autonomous-vehicle.component.html'
})
export class AutonomousVehicleComponent {
    carImage: HTMLImageElement;
    canvas: Canvas2d;
    car: IAutonomousObject2d;

    reset(canvas: Canvas2d) {
        this.canvas = canvas;
        this.carImage = document.getElementById('carImage') as HTMLImageElement;
        var canvasDimensions = canvas.getCanvasDimensions();
        this.car = new AutonomousObject2d(this.carImage, 64, 64, canvasDimensions);
    }

    tick(canvas: Canvas2d) {
        var ctx = canvas.getContext();
        ctx.fillStyle = "gray";
        ctx.fillRect(0, 0, canvas.getCanvasDimensions().x, canvas.getCanvasDimensions().y);
        this.car.update();
        if (this.carImage) {
            this.car.draw(ctx);
        }
        else {
            console.log('no image');
        }
    }

    mouseDown(event) {
    }

    mouseUp(event) {
        this.car.setDestination(this.canvas.mousePosition.clone());
    }
}