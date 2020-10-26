import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObserverPageComponent } from './observer-page.component';

describe('ObserverPageComponent', () => {
  let component: ObserverPageComponent;
  let fixture: ComponentFixture<ObserverPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObserverPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObserverPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
