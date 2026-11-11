import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector:'app-home', standalone:true, imports:[RouterLink], template:`
  <section class="hero"><span class="eyebrow">SENIOR DESIGN · M1 FOUNDATION</span><h1>Mission Assessment Tracking Tool</h1>
    <p>Assessor-focused workspace for recording exercise evaluations, reviewing team performance, and navigating task measures.</p>
    <div class="actions"><a class="button primary" routerLink="/assess">Open Evaluations</a><a class="button outline" routerLink="/wheel">Explore Assessment Wheel</a></div>
  </section>
  <div class="cards"><article class="panel"><span class="eyebrow">WORKFLOW 01</span><h2>Quick evaluation entry</h2><p>Filter by team, day, and play card. Record ratings and comments with save confirmation.</p></article>
  <article class="panel"><span class="eyebrow">WORKFLOW 02</span><h2>Interactive wheel</h2><p>Browse core tasks, drill into measures, and open the same evaluation record.</p></article>
  <article class="panel"><span class="eyebrow">WORKFLOW 03</span><h2>API-ready models</h2><p>Shared TypeScript interfaces prepared for the Spring Boot contract.</p></article></div>
`})
export class HomeComponent {}
