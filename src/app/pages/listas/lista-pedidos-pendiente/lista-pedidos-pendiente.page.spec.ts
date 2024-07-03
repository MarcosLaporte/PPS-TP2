import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaPedidosPendientePage } from './lista-pedidos-pendiente.page';

describe('ListaPedidosPendientePage', () => {
  let component: ListaPedidosPendientePage;
  let fixture: ComponentFixture<ListaPedidosPendientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPedidosPendientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
