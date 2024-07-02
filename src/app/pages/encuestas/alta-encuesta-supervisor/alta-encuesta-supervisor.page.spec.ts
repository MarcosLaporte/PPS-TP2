import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AltaEncuestaSupervisorPage } from './alta-encuesta-supervisor.page';

describe('AltaEncuestaSupervisorPage', () => {
  let component: AltaEncuestaSupervisorPage;
  let fixture: ComponentFixture<AltaEncuestaSupervisorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaEncuestaSupervisorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
