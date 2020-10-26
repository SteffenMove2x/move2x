import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimerPageComponent } from './timer-page/timer-page.component';
import { ScoreboardPageComponent } from './scoreboard-page/scoreboard-page.component';
import { ObserverPageComponent } from './observer-page/observer-page.component';
import { FacilitatorPageComponent } from './facilitator-page/facilitator-page.component';
import { SetupPageComponent } from './setup-page/setup-page.component';


const routes: Routes = [
  {path: 'timer', component: TimerPageComponent},
  {path: 'scoreboard', component: ScoreboardPageComponent},
  {path: 'observer', component: ObserverPageComponent},
  {path: 'facilitator', component: FacilitatorPageComponent},
  {path: 'setup', component: SetupPageComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [TimerPageComponent, ScoreboardPageComponent, ObserverPageComponent, FacilitatorPageComponent, SetupPageComponent]
