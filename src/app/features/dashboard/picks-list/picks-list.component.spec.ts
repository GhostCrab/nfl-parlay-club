import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PicksListComponent } from './picks-list.component';

describe('PicksListComponent', () => {
  let component: PicksListComponent;
  let fixture: ComponentFixture<PicksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PicksListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PicksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
