import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaPedidosSinHacerPage } from './lista-pedidos-sin-hacer.page';

describe('ListaPedidosSinHacerPage', () => {
  let component: ListaPedidosSinHacerPage;
  let fixture: ComponentFixture<ListaPedidosSinHacerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPedidosSinHacerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
