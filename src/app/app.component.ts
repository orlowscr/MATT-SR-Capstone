import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root', standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <header class="topbar"><a class="brand" routerLink="/">MATT <small>Assessor Prototype</small></a>
      <nav aria-label="Main navigation">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Home</a>
        <a routerLink="/assess" routerLinkActive="active">Evaluations</a>
        <a routerLink="/wheel" routerLinkActive="active">Assessment Wheel</a>
      </nav>
      <span class="event-pill">Demo Event · Day 2</span>
    </header>
    <main class="container"><router-outlet /></main>
    <footer>Training prototype · Approved sample data only · No authentication or backend connected</footer>
  `
})
export class AppComponent {}
