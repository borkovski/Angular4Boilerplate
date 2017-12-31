import { Component, HostListener, AfterViewInit } from '@angular/core';
import { IVector2d, Vector2d } from '../../models/vector2d/vector2d';
import { AnimatedCanvasComponent } from '../animated-canvas/animated-canvas.component';
import { Canvas2d } from '../../models/canvas2d/canvas2d';

@Component({
    selector: 'tree',
    templateUrl: './tree.component.html'
})
export class TreeComponent {
    canvas: Canvas2d;
    minimalBranchLength: number = 2;
    maxLength: number = 400;

    private getInitialLength(): number {
        return Math.random() * this.maxLength;
    }

    private getAngle(): number {
        return (Math.random() - .5) * Math.PI;
    }

    private getBranchRatio(): number {
        return Math.random();
    }

    private getBranchNumber(): number {
        return Math.round(1 + Math.random() * 4);
    }

    private getLineWidth(branchVector: IVector2d): number {
        return Math.max(branchVector.mag() / 10, 1);
    }

    reset(canvas: Canvas2d) {
        this.canvas = canvas;
        var canvasDimensions = canvas.getCanvasDimensions();
        var ctx = canvas.getContext();
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvasDimensions.x, canvasDimensions.y);
        ctx.lineCap = 'round';
    }

    tick(canvas: Canvas2d) {
        var ctx = canvas.getContext();
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.getCanvasDimensions().x, canvas.getCanvasDimensions().y);
        var initialLength = this.getInitialLength();
        var newBranch = new Vector2d(0, initialLength * -1);
        ctx.translate(canvas.getCanvasDimensions().x / 2, canvas.getCanvasDimensions().y);
        this.branchSingle(ctx, newBranch, initialLength, 0);
        ctx.rotate(Math.PI);
    }

    private branch(ctx: CanvasRenderingContext2D, length: number): void {
        length *= this.getBranchRatio();
        if (length > this.minimalBranchLength) {
            var newBranch = new Vector2d(0, length * -1);
            var branchNumber = this.getBranchNumber();
            for (var i = 0; i < branchNumber; i++) {
                this.branchSingle(ctx, newBranch, length, this.getAngle());
            }
        }
    }

    private branchSingle(ctx: CanvasRenderingContext2D, newBranch: IVector2d, length: number, angle: number): void {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.rotate(angle);
        ctx.lineTo(newBranch.x, newBranch.y);
        ctx.lineWidth = this.getLineWidth(newBranch);
        ctx.stroke();
        ctx.translate(newBranch.x, newBranch.y);
        this.branch(ctx, length);
        ctx.closePath();
        ctx.restore();
    }
}