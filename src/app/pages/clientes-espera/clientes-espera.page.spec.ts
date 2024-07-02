import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientesEsperaPage } from './clientes-espera.page';

describe('ClientesEsperaPage', () => {
  let component: ClientesEsperaPage;
  let fixture: ComponentFixture<ClientesEsperaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientesEsperaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
