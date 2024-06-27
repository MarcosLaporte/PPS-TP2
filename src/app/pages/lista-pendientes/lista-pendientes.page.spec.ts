import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaPendientesPage } from './lista-pendientes.page';

describe('ListaPendientesPage', () => {
  let component: ListaPendientesPage;
  let fixture: ComponentFixture<ListaPendientesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPendientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
