import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObserverItemComponent } from './observer-item.component';

describe('ObserverItemComponent', () => {
  let component: ObserverItemComponent;
  let fixture: ComponentFixture<ObserverItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObserverItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObserverItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
