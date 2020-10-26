import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitatorPageComponent } from './facilitator-page.component';

describe('FacilitatorPageComponent', () => {
  let component: FacilitatorPageComponent;
  let fixture: ComponentFixture<FacilitatorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilitatorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilitatorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
