import { Observable, Observer } from '../observers';

export type yyyymmdd = [number, number, number];
export type DateSelection = yyyymmdd | typeof today;
export const today = 'today';

let currentDay: DateSelection = today;
const dateChangeObservable = new Observable();

export function selectToday(): void {
  currentDay = today;
  dateChangeObservable.notify();
}

export function selectAnimationDate(date: yyyymmdd): void {
  currentDay = date;
  dateChangeObservable.notify();
}

export function getAnimationDate(): DateSelection {
  return currentDay;
}

export function observeDateChanges(listener: Observer): void {
  dateChangeObservable.observe(listener);
}
