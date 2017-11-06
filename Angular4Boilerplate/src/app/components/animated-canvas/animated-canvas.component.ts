import { Component, HostListener, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Canvas2d } from '../../models/canvas2d/canvas2d';
import { IVector2d, Vector2d } from '../../models/vector2d/vector2d';

@Component({
    selector: 'animated-canvas',
    templateUrl: './animated-canvas.component.html'
})
export class AnimatedCanvasComponent implements AfterViewInit {
    canvas: Canvas2d;
    isSteppedDraw: boolean = false;

    ngAfterViewInit() {
        this.canvas = new Canvas2d(document.getElementById("myCanvas") as HTMLCanvasElement);
        this.resetView();
        this.tickView();
    }

    @HostListener('mousemove', ['$event'])
    onMousemove(event: MouseEvent) {
        this.canvas.mousePosition = this.getMousePos(event);
        this.mouseMove.emit(this.canvas);
    }

    @HostListener('mousedown', ['$event'])
    onMousedown(event: MouseEvent) {
        this.mouseDown.emit(this.canvas);
    }

    @HostListener('mouseup', ['$event'])
    onMouseup(event: MouseEvent) {
        this.mouseUp.emit(this.canvas);
    } 

    getMousePos(evt) {
        var rect = this.canvas.canvasElement.getBoundingClientRect();
        var canvasScale = this.canvas.getCanvasScale();
        return new Vector2d((evt.clientX - rect.left) * canvasScale.x, (evt.clientY - rect.top) * canvasScale.y);
    }

    @Output()
    reset: EventEmitter<Canvas2d> = new EventEmitter<Canvas2d>();

    @Output()
    tick: EventEmitter<Canvas2d> = new EventEmitter<Canvas2d>();

    @Output()
    mouseDown: EventEmitter<Canvas2d> = new EventEmitter<Canvas2d>();

    @Output()
    mouseMove: EventEmitter<Canvas2d> = new EventEmitter<Canvas2d>();

    @Output()
    mouseUp: EventEmitter<Canvas2d> = new EventEmitter<Canvas2d>();

    tickView() {
        if (!this.isSteppedDraw) {
            requestAnimationFrame(() => {
                this.tickView()
            });
        }
        var canvasDimensions = this.canvas.getCanvasDimensions();
        this.canvas.getContext().clearRect(0, 0, canvasDimensions.x, canvasDimensions.y);
        this.tick.emit(this.canvas);
    }

    resetView() {
        this.reset.emit(this.canvas);
    }

    triggerStep(event: any) {
        this.tickView();
    }
}