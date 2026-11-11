import { CoreTask, Evaluation, Measure, PlayCard, Team } from './models';
// PUBLIC DEMONSTRATION DATA ONLY. No sponsor exercise information belongs here.
export const TEAMS: Team[] = [
  { id: 'team-alpha', name: 'Demo Team Alpha' },
  { id: 'team-beta', name: 'Demo Team Beta' }
];
export const CORE_TASKS: CoreTask[] = [
  { id: 'ct1', name: 'Core Task 1', tasks: [
    { id: 't11', code: 'CT1.1', title: 'Identify systems', coreTaskId: 'ct1' },
    { id: 't12', code: 'CT1.2', title: 'Document assets', coreTaskId: 'ct1' }] },
  { id: 'ct2', name: 'Core Task 2', tasks: [
    { id: 't21', code: 'CT2.1', title: 'Protect accounts', coreTaskId: 'ct2' },
    { id: 't22', code: 'CT2.2', title: 'Review access', coreTaskId: 'ct2' }] },
  { id: 'ct3', name: 'Core Task 3', tasks: [
    { id: 't31', code: 'CT3.1', title: 'Detect indicators', coreTaskId: 'ct3' },
    { id: 't32', code: 'CT3.2', title: 'Triage findings', coreTaskId: 'ct3' }] }
];
export const MEASURES: Measure[] = [
  { id:'m111', code:'CT1.1.P1', title:'Create a system inventory', guidance:'Verify the team has documented its sample systems.', taskId:'t11' },
  { id:'m112', code:'CT1.2.P1', title:'Record asset ownership', guidance:'Look for clearly assigned owners in the demo inventory.', taskId:'t12' },
  { id:'m211', code:'CT2.1.P1', title:'Review account protections', guidance:'Check for appropriate access controls in the practice scenario.', taskId:'t21' },
  { id:'m212', code:'CT2.2.P1', title:'Check least privilege', guidance:'Review a sample account for excessive permissions.', taskId:'t22' },
  { id:'m311', code:'CT3.1.P1', title:'Identify a simulated alert', guidance:'Check whether the team recognizes the synthetic alert.', taskId:'t31' },
  { id:'m312', code:'CT3.2.P1', title:'Document investigation notes', guidance:'Look for a concise timeline in the practice notes.', taskId:'t32' }
];
export const PLAY_CARDS: PlayCard[] = [
  { id:'pc-a', title:'Play Card A — Inventory Check', day:1, measureIds:['m111','m112'] },
  { id:'pc-b', title:'Play Card B — Account Security', day:2, measureIds:['m211','m212'] },
  { id:'pc-c', title:'Play Card C — Detection Drill', day:2, measureIds:['m311','m312'] }
];
export const INITIAL_EVALUATIONS: Evaluation[] = [
  { id:'demo-e1', teamId:'team-alpha', measureId:'m211', playCardId:'pc-b', day:2, rating:'YELLOW', comment:'Access review is in progress.', updatedAt:'2026-11-11T12:00:00.000Z' }
];
