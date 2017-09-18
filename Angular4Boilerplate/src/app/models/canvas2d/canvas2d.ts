import { IVector2d, Vector2d } from '../vector2d/vector2d';

export class Canvas2d {
    canvasElement: HTMLCanvasElement;
    mousePosition: IVector2d = new Vector2d(0, 0);

    constructor(canvasElement: HTMLCanvasElement) {
        this.canvasElement = canvasElement;
    }

    getCanvasDimensions(): IVector2d {
        return new Vector2d(this.canvasElement.width, this.canvasElement.height);
    }

    getCanvasScale(): IVector2d {
        return new Vector2d(this.canvasElement.width / this.canvasElement.offsetWidth, this.canvasElement.height / this.canvasElement.offsetHeight);
    }

    getContext(): CanvasRenderingContext2D {
        return this.canvasElement.getContext("2d");
    }
}