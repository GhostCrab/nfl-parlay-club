import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';

import { IParlayUser } from '../../features/users/interfaces/parlay-user.interface';

function isEmail(str: string) {
  return str.includes('@');
}

@Injectable({
  providedIn: 'root',
})
export class UserDatabaseService {
  private users: IParlayUser[] = [
    { userID: 0, name: 'ANDREW', email: 'ACKILPATRICK@GMAIL.COM' },
    { userID: 1, name: 'BARDIA', email: 'BBAKHTARI@GMAIL.COM' },
    { userID: 2, name: 'COOPER', email: 'COOPER.KOCSIS@MATTEL.COM' },
    { userID: 3, name: 'MICAH', email: 'MICAHGOLDMAN@GMAIL.COM' },
    { userID: 4, name: 'RYAN', email: 'RYAN.PIELOW@GMAIL.COM' },
    { userID: 5, name: 'TJ', email: 'TYERKE@YAHOO.COM' },
  ];

  constructor(private readonly auth: Auth) {}

  currentUser() {
    return this.fromAmbig(this.auth.currentUser?.email);
  }

  allUsers() {
    return this.users;
  }

  fromName(name: string) {
    const capName = name.toUpperCase();
    for (const user of this.users) {
      if (user.name === capName) return user;
    }

    throw new Error(`Unable to find valid user with Name: ${name}`);
  }

  fromEmail(email: string) {
    const capEmail = email.toUpperCase();
    for (const user of this.users) {
      if (user.email === capEmail) return user;
    }

    throw new Error(`Unable to find valid user with Email: ${email}`);
  }

  fromID(userID: number) {
    if (userID < this.users.length && userID >= 0) return this.users[userID];

    throw new Error(`Unable to find user with ID ${userID}`);
  }

  fromAmbig(input: IParlayUser | string | number | null | undefined) {
    if (input === null || input === undefined)
      throw Error(`Attempted to look up falsy user`);

    switch (typeof input) {
      case 'number':
        return this.fromID(input);
      case 'string': {
        if (isEmail(input)) return this.fromEmail(input);
        return this.fromName(input);
      }
    }

    return input;
  }
}
