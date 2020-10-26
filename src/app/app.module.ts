import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';

// Import ng-circle-progress
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ScoreboardPageComponent } from './scoreboard-page/scoreboard-page.component';
import { TimerPageComponent } from './timer-page/timer-page.component';
import { HttpClientModule } from '@angular/common/http';
import { ObserverPageComponent } from './observer-page/observer-page.component';
import { ObserverItemComponent } from './observer-item/observer-item.component';
import { FacilitatorPageComponent } from './facilitator-page/facilitator-page.component';
import { SetupPageComponent } from './setup-page/setup-page.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    ScoreboardPageComponent,
    TimerPageComponent,
    ObserverPageComponent,
    ObserverItemComponent,
    FacilitatorPageComponent,
    SetupPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
      outerStrokeLinecap: "butt",
      startFromZero: false

    }),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
