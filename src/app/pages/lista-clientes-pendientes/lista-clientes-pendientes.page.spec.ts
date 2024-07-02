import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaClientesPendientesPage } from './lista-clientes-pendientes.page';

describe('ListaClientesPendientesPage', () => {
  let component: ListaClientesPendientesPage;
  let fixture: ComponentFixture<ListaClientesPendientesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaClientesPendientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
