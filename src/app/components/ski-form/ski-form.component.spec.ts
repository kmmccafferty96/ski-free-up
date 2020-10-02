import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkiFormComponent } from './ski-form.component';

describe('SkiFormComponent', () => {
  let component: SkiFormComponent;
  let fixture: ComponentFixture<SkiFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SkiFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkiFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
