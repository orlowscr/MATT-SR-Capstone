import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EvaluationService } from './evaluation.service';
import { Rating, Measure } from './models';

@Component({selector:'app-assessor',standalone:true, imports:[CommonModule, FormsModule], template:`
<section class="page-heading"><div><span class="eyebrow">ASSESSOR WORKSPACE</span><h1>Evaluations</h1><p>Select a play card, rate measures, and record assessor observations.</p></div><span class="tag">Demo mode · Local only</span></section>
<div class="filters panel">
  <label>Team <select [ngModel]="teamId()" (ngModelChange)="changeTeam($event)"><option *ngFor="let t of api.teams" [value]="t.id">{{t.name}}</option></select></label>
  <label>Exercise day <select [ngModel]="day()" (ngModelChange)="changeDay(+$event)"><option [value]="1">Day 1</option><option [value]="2">Day 2</option></select></label>
  <label>Play card <select [ngModel]="cardId()" (ngModelChange)="chooseCard($event)"><option *ngFor="let c of cards()" [value]="c.id">{{c.title}}</option></select></label>
</div>
<div class="work-grid">
  <section class="panel"><div class="section-header"><h2>Measures</h2><span class="muted">{{measures().length}} in this play card</span></div>
    <div *ngIf="!measures().length" class="empty">No measures for this selection.</div>
    <button class="measure-row" *ngFor="let m of measures()" [class.selected]="selectedId() === m.id" (click)="selectMeasure(m.id)">
      <span><strong>{{m.code}}</strong><small>{{m.title}}</small><small class="comment-preview" *ngIf="record(m.id)?.comment">“{{record(m.id)?.comment}}”</small></span>
      <span class="rating" [class]="record(m.id)?.rating || 'NOT_ASSESSED'">{{ratingText(record(m.id)?.rating)}}</span>
    </button>
  </section>
  <section class="panel editor" *ngIf="selectedMeasure() as measure; else selectPrompt">
    <div class="section-header"><div><span class="eyebrow">{{measure.code}}</span><h2>{{measure.title}}</h2></div></div>
    <div class="guidance"><strong>Assessor guidance</strong><p>{{measure.guidance}}</p></div>
    <form (ngSubmit)="save()">
      <label>Rating <select name="rating" [(ngModel)]="rating" required><option value="NOT_ASSESSED">Not assessed</option><option value="GREEN">Green — Complete</option><option value="YELLOW">Yellow — Partial</option><option value="RED">Red — Needs improvement</option></select></label>
      <label>Assessor comment <textarea name="comment" [(ngModel)]="comment" rows="6" placeholder="Enter your evaluation observations..."></textarea></label>
      <button type="submit" class="button primary">Save evaluation</button>
      <p class="success" role="status" *ngIf="notice()">{{notice()}}</p>
    </form>
    <p class="muted tiny">Saved data is held in browser memory and resets when the page reloads.</p>
  </section>
  <ng-template #selectPrompt><section class="panel empty">Select a measure to begin.</section></ng-template>
</div>
`})
export class AssessorComponent {
  readonly api = inject(EvaluationService);
  private readonly route = inject(ActivatedRoute);
  readonly teamId = signal('team-alpha');
  readonly day = signal(2);
  readonly cardId = signal('pc-b');
  readonly selectedId = signal('m211');
  readonly notice = signal('');
  rating: Rating = 'NOT_ASSESSED';
  comment = '';
  readonly cards = computed(() => this.api.playCards.filter(c => c.day === this.day()));
  readonly measures = computed(() => {
    const card = this.api.playCards.find(c => c.id === this.cardId());
    return this.api.measures.filter(m => card?.measureIds.includes(m.id));
  });
  readonly selectedMeasure = computed<Measure | undefined>(() => this.measures().find(m => m.id === this.selectedId()));
  constructor() {
    this.route.queryParamMap.subscribe(params => {
      const measureId = params.get('measure');
      if (measureId) {
        const card = this.api.playCards.find(c => c.measureIds.includes(measureId));
        if (card) { this.day.set(card.day); this.cardId.set(card.id); this.selectedId.set(measureId); }
      }
      const team = params.get('team'); if (team && this.api.teams.some(t => t.id === team)) this.teamId.set(team);
      this.loadRecord();
    });
  }
  record(id: string) { return this.api.find(this.teamId(), id, this.cardId()); }
  ratingText(value?: Rating) { return ({ GREEN:'Green', YELLOW:'Yellow', RED:'Red', NOT_ASSESSED:'Not assessed' })[value || 'NOT_ASSESSED']; }
  changeTeam(team: string) { this.teamId.set(team); this.loadRecord(); }
  changeDay(day: number) { this.day.set(day); this.cardId.set(this.cards()[0]?.id || ''); this.selectMeasure(this.measures()[0]?.id || ''); }
  chooseCard(id: string) { this.cardId.set(id); this.selectMeasure(this.measures()[0]?.id || ''); }
  selectMeasure(id: string) { this.selectedId.set(id); this.loadRecord(); }
  loadRecord() { const e = this.record(this.selectedId()); this.rating = e?.rating || 'NOT_ASSESSED'; this.comment = e?.comment || ''; this.notice.set(''); }
  save() {
    if (!this.selectedMeasure() || !this.cardId()) return;
    const e = this.api.save({ teamId:this.teamId(), measureId:this.selectedId(), playCardId:this.cardId(), day:this.day(), rating:this.rating, comment:this.comment.trim() });
    this.notice.set(`Saved ${this.selectedMeasure()!.code} at ${new Date(e.updatedAt).toLocaleTimeString()}.`);
  }
}
