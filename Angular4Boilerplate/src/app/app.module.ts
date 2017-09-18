import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './components/app/app.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { GravityComponent } from './components/gravity/gravity.component';
import { AngularMotionComponent } from './components/angular-motion/angular-motion.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        GravityComponent,
        AngularMotionComponent,
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
            { path: '**', redirectTo: 'home' }
        ])
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }