import { Component, HostListener, AfterViewInit } from '@angular/core';
import { IVector2d, Vector2d } from '../../models/vector2d/vector2d';
import { AnimatedCanvasComponent } from '../animated-canvas/animated-canvas.component';
import { Canvas2d } from '../../models/canvas2d/canvas2d';
import { IColor, Color } from '../../models/color/color';
import { Ball, IBall } from '../../models/objects/ball';
import { Spring, ISpring } from '../../models/objects/spring';
import { IPhysicalObject2d } from '../../models/objects/physicalObject2d';
import { IParticle, Particle } from '../../models/objects/particle';
import { IParticleController, ParticleController } from '../../models/controllers/particleController';
import { NoiseService } from '../../services/noise.service';

@Component({
    selector: 'particles',
    templateUrl: './particles.component.html'
})
export class ParticlesComponent {
    canvas: Canvas2d;
    smokeController: IParticleController;
    fireController: IParticleController;
    isParticleDrag: boolean = false;
    noiseService: NoiseService = new NoiseService();
    noiseServiceIterator: number = 0;

    reset(canvas: Canvas2d) {
        this.smokeController = new ParticleController();
        this.smokeController.isGenerating = false;
        this.smokeController.particleColor = new Color(100, 100, 100);
        this.smokeController.isRandomPosition = true;
        this.fireController = new ParticleController(100);
        this.fireController.isGenerating = false;
        this.isParticleDrag = false;
        this.canvas = canvas;
    }

    tick(canvas: Canvas2d) {
        var ctx = canvas.getContext();
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.getCanvasDimensions().x, canvas.getCanvasDimensions().y);
        if (this.isParticleDrag) {
            this.smokeController.position = canvas.mousePosition.clone();
            this.fireController.position = canvas.mousePosition.clone();
        }
        var perlinNoise = this.noiseService.getPerlin(this.noiseServiceIterator, 0, 0);
        this.smokeController.applyForce(new Vector2d((perlinNoise - 0.5) * 10, this.noiseService.getPerlin(0, this.noiseServiceIterator, 0) * -3));
        this.smokeController.particleRadius = 50 + this.noiseService.getPerlin(0, 0, this.noiseServiceIterator) * 150;
        this.smokeController.applyForce(new Vector2d((perlinNoise - 0.5) * 10, this.noiseService.getPerlin(0, this.noiseServiceIterator, 0) * -3));
        this.fireController.particleRadius = this.noiseService.getPerlin(0, 0, this.noiseServiceIterator) * 30;
        this.noiseServiceIterator += .01;
        this.smokeController.update();
        this.smokeController.draw(ctx);
        this.fireController.update();
        //this.fireController.draw(ctx);
    }

    mouseDown(event) {
        this.smokeController.isGenerating = true;
        this.fireController.isGenerating = true;
        this.isParticleDrag = true;
    }

    mouseUp(event) {
        this.smokeController.isGenerating = false;
        this.fireController.isGenerating = false;
        this.isParticleDrag = false;
    }
}