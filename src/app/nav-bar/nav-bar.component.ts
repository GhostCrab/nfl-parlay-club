import {
  Component,
  HostListener,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { UserDatabaseService } from '../core/services/user-database.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  navElement: HTMLElement | null;

  isDrawerOpen: boolean;
  show: boolean;
  userID: number;

  @Output()
  drawerToggleEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private auth: Auth,
    private readonly userdb: UserDatabaseService
  ) {}

  ngOnInit() {
    this.navElement = null;
    this.isDrawerOpen = false;
    this.show = false;
  }

  ngAfterViewInit() {
    this.navElement = <HTMLElement>document.getElementById('navbar');
    this.show = this.auth.currentUser !== null;
    this.auth.onAuthStateChanged((user) => {
      this.show = user !== null;
      this.userID = this.userdb.currentUser().userID;
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll($event: Event) {
    if (!this.navElement) return;

    let scrollFactor = 200;
    let opacity = window.pageYOffset / scrollFactor;
    opacity = opacity < 1 ? opacity : 1;

    if (opacity <= 1) {
      this.navElement.style.backgroundColor =
        'rgba(255, 255, 255, ' + opacity + ')';
    }

    if (window.pageYOffset / scrollFactor > 1) {
      this.navElement.classList.add('navbar-shadow');
    } else {
      this.navElement.classList.remove('navbar-shadow');
    }
  }

  logout() {
    this.authService
      .logout()
      .then(() => this.router.navigate(['/']))
      .catch((e) => console.log(e.message));
  }
}
