import { Injectable } from '@angular/core';

import { ParlayUser } from '../features/users/interfaces/parlay-user.interface';

function isEmail(str: string) {
  return str.includes('@');
}

@Injectable({
  providedIn: 'root',
})
export class UserDatabaseService {
  private users: ParlayUser[] = [
    { userID: 0, name: 'ANDREW', email: 'ACKILPATRICK@GMAIL.COM' },
    { userID: 1, name: 'BARDIA', email: 'BBAKHTARI@GMAIL.COM' },
    { userID: 2, name: 'COOPER', email: 'COOPER.KOCSIS@MATTEL.COM' },
    { userID: 3, name: 'MICAH', email: 'MICAHGOLDMAN@GMAIL.COM' },
    { userID: 4, name: 'RYAN', email: 'RYAN.PIELOW@GMAIL.COM' },
    { userID: 5, name: 'TJ', email: 'TYERKE@YAHOO.COM' },
  ];

  constructor() {}

  allUsers() {
    return this.users;
  }

  fromName(name: string) {
    const capName = name.toUpperCase();
    for (const user of this.users) {
      if (user.name === capName) return user;
    }

    return;
  }

  fromEmail(email: string) {
    const capEmail = email.toUpperCase();
    for (const user of this.users) {
      if (user.email === capEmail) return user;
    }

    return;
  }

  fromID(userID: number) {
    if (userID < this.users.length && userID >= 0)
      return this.users[userID];
    return;
  }

  fromAmbig(input: ParlayUser | string | number) {
    switch (typeof input) {
      case "number": return this.fromID(input);
      case "string": {
        if (isEmail(input)) return this.fromEmail(input);
        return this.fromName(input);
      }
    }

    return input;
  }
}
