export type Rating = 'NOT_ASSESSED' | 'GREEN' | 'YELLOW' | 'RED';
export type Role = 'ASSESSOR' | 'ASSESSMENT_LEAD' | 'ADMIN';
export interface Team { id: string; name: string; }
export interface Measure { id: string; code: string; title: string; guidance: string; taskId: string; }
export interface Task { id: string; code: string; title: string; coreTaskId: string; }
export interface CoreTask { id: string; name: string; tasks: Task[]; }
export interface PlayCard { id: string; title: string; day: number; measureIds: string[]; }
export interface Evaluation { id: string; teamId: string; measureId: string; playCardId: string; day: number; rating: Rating; comment: string; updatedAt: string; }
export type EvaluationInput = Pick<Evaluation, 'teamId' | 'measureId' | 'playCardId' | 'day' | 'rating' | 'comment'>;
