import { Injectable, signal } from '@angular/core';
import { CORE_TASKS, INITIAL_EVALUATIONS, MEASURES, PLAY_CARDS, TEAMS } from './mock-data';
import { Evaluation, EvaluationInput } from './models';

@Injectable({ providedIn: 'root' })
export class EvaluationService {
  readonly teams = TEAMS;
  readonly coreTasks = CORE_TASKS;
  readonly measures = MEASURES;
  readonly playCards = PLAY_CARDS;
  readonly evaluations = signal<Evaluation[]>([...INITIAL_EVALUATIONS]);

  find(teamId: string, measureId: string, playCardId: string): Evaluation | undefined {
    return this.evaluations().find(e => e.teamId === teamId && e.measureId === measureId && e.playCardId === playCardId);
  }

  save(input: EvaluationInput): Evaluation {
    // DEMO ONLY: in-memory persistence disappears on refresh. Replace with authorized API call.
    const previous = this.find(input.teamId, input.measureId, input.playCardId);
    const result: Evaluation = { ...input, id: previous?.id ?? crypto.randomUUID(), updatedAt: new Date().toISOString() };
    this.evaluations.update(items => previous ? items.map(e => e.id === previous.id ? result : e) : [...items, result]);
    return result;
  }
}
