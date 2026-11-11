import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AssessorComponent } from './assessor.component';
import { WheelComponent } from './wheel.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'MATT | Home' },
  { path: 'assess', component: AssessorComponent, title: 'MATT | Evaluations' },
  { path: 'wheel', component: WheelComponent, title: 'MATT | Wheel' },
  { path: '**', redirectTo: '' }
];
