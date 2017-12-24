import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './components/app/app.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { AnimatedCanvasComponent } from './components/animated-canvas/animated-canvas.component';
import { GravityComponent } from './components/gravity/gravity.component';
import { AngularMotionComponent } from './components/angular-motion/angular-motion.component';
import { SpacecraftNavigationComponent } from './components/spacecraft-navigation/spacecraft-navigation.component';
import { SimpleWaveComponent } from './components/simple-wave/simple-wave.component';
import { PendulumComponent } from './components/pendulum/pendulum.component';
import { ParticlesComponent } from './components/particles/particles.component';
import { AutonomousVehicleComponent } from './components/autonomous-vehicle/autonomous-vehicle.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AnimatedCanvasComponent,
        GravityComponent,
        AngularMotionComponent,
        SpacecraftNavigationComponent,
        SimpleWaveComponent,
        PendulumComponent,
        ParticlesComponent,
        AutonomousVehicleComponent,
        NavMenuComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'gravity', component: GravityComponent },
            { path: 'angular-motion', component: AngularMotionComponent },
            { path: 'spacecraft-navigation', component: SpacecraftNavigationComponent },
            { path: 'simple-wave', component: SimpleWaveComponent },
            { path: 'pendulum', component: PendulumComponent },
            { path: 'particles', component: ParticlesComponent },
            { path: 'autonomous-vehicle', component: AutonomousVehicleComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }