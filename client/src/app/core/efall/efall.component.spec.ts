import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EfallComponent } from './efall.component';

describe('EfallComponent', () => {
  let component: EfallComponent;
  let fixture: ComponentFixture<EfallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EfallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EfallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
