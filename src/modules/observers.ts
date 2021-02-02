export type Observer = () => void;

export class Observable {
  observers: Observer[] = [];

  observe(observer: Observer): void {
    this.observers.push(observer);
  }

  notify(): void {
    this.observers.forEach(callback => callback());
  }
}
