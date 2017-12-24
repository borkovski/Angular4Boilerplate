import { Component, HostListener, AfterViewInit } from '@angular/core';
import { IVector2d, Vector2d } from '../../models/vector2d/vector2d';
import { TextureObject2d, ITextureObject2d } from '../../models/objects/textureObject2d';
import { AnimatedCanvasComponent } from '../animated-canvas/animated-canvas.component';
import { Canvas2d } from '../../models/canvas2d/canvas2d';
import { IColor, Color } from '../../models/color/color';
import { Ball, IBall } from '../../models/objects/ball';

@Component({
    selector: 'spacecraft-navigation',
    templateUrl: './spacecraft-navigation.component.html'
})
export class SpacecraftNavigationComponent {
    spacecraftImage: HTMLImageElement;
    spacecraftAcceleratingImage: HTMLImageElement;
    spacecraftBreakingImage: HTMLImageElement;
    spacecraft: ITextureObject2d;
    isAccelerating: boolean;
    isBreaking: boolean;
    isTurningLeft: boolean;
    isTurningRight: boolean;
    projectiles: Array<IBall> = new Array<IBall>();
    canvas: Canvas2d;
    map = [];

    reset(canvas: Canvas2d) {
        this.canvas = canvas;
        this.projectiles = new Array<IBall>();
        this.spacecraftImage = document.getElementById('spacecraftImage') as HTMLImageElement;
        this.spacecraftAcceleratingImage = document.getElementById('spacecraftAcceleratingImage') as HTMLImageElement;
        this.spacecraftBreakingImage = document.getElementById('spacecraftBreakingImage') as HTMLImageElement;
        this.spacecraft = new TextureObject2d(this.spacecraftImage, 32, 32);
        var canvasDimensions = canvas.getCanvasDimensions();
        this.spacecraft.position = new Vector2d(Math.random() * canvasDimensions.x, Math.random() * canvasDimensions.y);
    }

    updateKeys() {
        for (var key in this.map) {
            if (this.map[key]) {
              switch (key) {
                  case '37':
                      this.isTurningLeft = true;
                      break;
                  case '38':
                      this.isAccelerating = true;
                      break;
                  case '39':
                      this.isTurningRight = true;
                      break;
                  case '40':
                      this.isBreaking = true;
                      break;
                  case '32':
                      var projectile = new Ball(2);
                      var canvasDimensions = this.canvas.getCanvasDimensions();
                      projectile.position = this.spacecraft.position.clone();
                      projectile.velocity = new Vector2d(0, -20).rotate(this.spacecraft.angle);
                      this.projectiles.push(projectile);

                      if (this.projectiles.length > 100) {
                          this.projectiles = this.projectiles.splice(1);
                      }
                      break;
                  }
            }
        }
    }

    tick(canvas: Canvas2d) {
        this.updateKeys();
        var velocity = new Vector2d(0, 0);
        var angleVelocity = 0;
        this.spacecraft.setImage(this.spacecraftImage, 32, 32);
        if (this.isAccelerating) {
            velocity.sub(new Vector2d(0, .3));
            this.isAccelerating = false;
            this.spacecraft.setImage(this.spacecraftAcceleratingImage, 32, 32);
        }
        if (this.isBreaking) {
            velocity.add(new Vector2d(0, this.spacecraft.velocity.clone().mag() * .05));
            this.isBreaking = false;
            this.spacecraft.setImage(this.spacecraftBreakingImage, 32, 32);
        }
        if (this.isTurningLeft) {
            angleVelocity -= .05;
            this.isTurningLeft = false;
        }
        if (this.isTurningRight) {
            angleVelocity += .05;
            this.isTurningRight = false;
        }
        this.spacecraft.rotate(angleVelocity);
        this.spacecraft.applyForce(velocity);
        this.spacecraft.update();
        var ctx = canvas.getContext();
        ctx.fillStyle = new Color(0, 0, 0).toRGBA();
        ctx.fillRect(0, 0, canvas.getCanvasDimensions().x, canvas.getCanvasDimensions().y);
        for (var projectile of this.projectiles) {
            projectile.update();
            projectile.draw(ctx);
        }
        this.spacecraft.draw(ctx);
    }

    focusKeyReader() {
        var keyReader = document.getElementById('keyReader');
        keyReader.focus();
        return false;
    }

    blurKeyReader() {
        var keyReader = document.getElementById('keyReader');
        keyReader.blur();
        return false;
    }

    readKeys(e) {
        this.map[e.keyCode] = e.type == 'keydown';
        return true;
    }
}