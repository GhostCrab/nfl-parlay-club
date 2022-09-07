import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationStateService {
  private isMobileResolution: boolean;
  private ismobileResolution$: BehaviorSubject<boolean>;

  constructor() {
    if (window.innerWidth <= 768) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }

    this.ismobileResolution$ = new BehaviorSubject<boolean>(this.isMobileResolution);
  }

  public getIsMobileResolution(): boolean {
    return this.isMobileResolution;
  }

  public watchIsMobileResolution(): Observable<boolean> {
    return this.ismobileResolution$.asObservable();
  }
}
