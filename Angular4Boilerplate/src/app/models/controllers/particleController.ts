import { IParticle, Particle } from '../objects/particle';
import { IObject2d } from '../objects/object2d';
import { IVector2d, Vector2d } from '../vector2d/vector2d';
import { NoiseService } from '../../services/noise.service';
import { IColor, Color } from '../color/color';

export interface IParticleController extends IObject2d {
    isGenerating: boolean;
    applyForce(force: IVector2d);
    particleRadius: number;
    particleColor: IColor;
    isRandomPosition: boolean;
}


export class ParticleController implements IParticleController {
    isGenerating: boolean = true;
    position: IVector2d = new Vector2d(0, 0);
    angle: number;
    particles: Array<IParticle> = new Array<IParticle>();
    particleNumber: number;
    particleRadius: number;
    particleColor: IColor = new Color(255, 0, 0);
    isRandomPosition: boolean = false;

    constructor(particleNumber: number = 100) {
        this.particleNumber = particleNumber;
    }

    private createNewParticle() {
        var particle = new Particle(this.particleRadius, this.particleNumber, this.particleColor.clone());
        var particlePosition = this.position.clone();
        if (this.isRandomPosition) {
            particlePosition.x += (Math.random() - .5) * this.particleRadius * 2;
            particlePosition.y += (Math.random() - .5) * this.particleRadius * 2;
        }
        particle.position = particlePosition;
        return particle;
    }

    applyForce(force: IVector2d) {
        for (var particle of this.particles) {
            particle.forces.push(force.clone());
        }
    }

    update() {
        for (var particle of this.particles) {
            particle.radius = particle.radius + particle.radius / particle.lifespan * 3 * (1 - particle.lifeRemaining / particle.lifespan);
            particle.density = particle.density * particle.lifeRemaining / particle.lifespan;
            particle.update();
            if (particle.isDead()) {
                this.particles.splice(this.particles.indexOf(particle), 1);
            }
        }
        if (this.particles.length < this.particleNumber && this.isGenerating) {
            this.particles.push(this.createNewParticle());
        }
    }

    draw(context: CanvasRenderingContext2D) {
        for (var particle of this.particles) {
            particle.draw(context);
        }
    }
}