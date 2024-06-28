import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AltaEncuestaClientePage } from './alta-encuesta-cliente.page';

describe('AltaEncuestaClientePage', () => {
  let component: AltaEncuestaClientePage;
  let fixture: ComponentFixture<AltaEncuestaClientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaEncuestaClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
