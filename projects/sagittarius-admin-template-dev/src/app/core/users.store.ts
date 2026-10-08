import { Injectable, signal } from '@angular/core';
import { DEMO_USERS, DemoUser } from './demo-data';

/** Jednoduchý in-memory store – v reálnej aplikácii volanie API. */
@Injectable({ providedIn: 'root' })
export class UsersStore {
  readonly users = signal<DemoUser[]>(DEMO_USERS);

  save(user: DemoUser) {
    this.users.update(list => list.some(u => u.id === user.id)
      ? list.map(u => u.id === user.id ? user : u)
      : [user, ...list]);
  }

  nextId() {
    return Math.max(...this.users().map(u => u.id)) + 1;
  }
}
