import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaClientesPagandoPage } from './lista-clientes-pagando.page';

describe('ListaClientesPagandoPage', () => {
  let component: ListaClientesPagandoPage;
  let fixture: ComponentFixture<ListaClientesPagandoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaClientesPagandoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
