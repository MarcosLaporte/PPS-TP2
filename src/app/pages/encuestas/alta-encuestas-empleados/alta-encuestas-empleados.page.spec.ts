import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AltaEncuestasEmpleadosPage } from './alta-encuestas-empleados.page';

describe('AltaEncuestasEmpleadosPage', () => {
  let component: AltaEncuestasEmpleadosPage;
  let fixture: ComponentFixture<AltaEncuestasEmpleadosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaEncuestasEmpleadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
