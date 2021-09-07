import { Inject, Injectable } from '@angular/core';
import { User } from './user.model';
import { UserStore } from './user.store';

@Injectable({ providedIn: 'root' })
export class UserStateService {

  constructor(@Inject('persistStorage') private persistStorage, private userStore: UserStore) {
  }

  addUser(user: User) {
    this.userStore.add(user);
  }

  deleteAllUser() {
    this.userStore.reset();
    this.persistStorage.clearStore('user');
  }

}
