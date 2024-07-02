import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaEncuestasEmpleadosPage } from './lista-encuestas-empleados.page';

describe('ListaEncuestasEmpleadosPage', () => {
  let component: ListaEncuestasEmpleadosPage;
  let fixture: ComponentFixture<ListaEncuestasEmpleadosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaEncuestasEmpleadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
