import { Component, HostBinding } from '@angular/core';
import { getWeekFromAmbig } from './features/games/interfaces/parlay-game.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'NavigationBarProject';

  @HostBinding("class.drawer-open")
  isDrawerOpen: boolean = false;
  
  toggleDrawer(isDrawerOpen: boolean) {
    this.isDrawerOpen = isDrawerOpen;
  }
  
  constructor() {
    localStorage['week'] = Math.max(getWeekFromAmbig(new Date()), 1);
  }
}
