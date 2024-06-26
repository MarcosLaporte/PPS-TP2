import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraficoClientesPage } from './grafico-clientes.page';

describe('GraficoClientesPage', () => {
  let component: GraficoClientesPage;
  let fixture: ComponentFixture<GraficoClientesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficoClientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
