import { Injectable } from '@angular/core';
import { NgEntityService } from '@datorama/akita-ng-entity-service';
import { UserStore, UserState } from './user.store';

@Injectable({ providedIn: 'root' })
export class UserService extends NgEntityService<UserState> {

  constructor(protected store: UserStore) {
    super(store);
  }

}
