import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IParlayPick } from '../../interfaces/parlay-pick.interface';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input() picks$: Observable<IParlayPick[]>;
  
  constructor() { }

  ngOnInit(): void {
  }

}
