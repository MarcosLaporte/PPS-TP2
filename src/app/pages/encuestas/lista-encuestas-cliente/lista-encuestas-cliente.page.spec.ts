import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaEncuestasClientePage } from './lista-encuestas-cliente.page';

describe('ListaEncuestasClientePage', () => {
  let component: ListaEncuestasClientePage;
  let fixture: ComponentFixture<ListaEncuestasClientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaEncuestasClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
