import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AltaClienteAnonPage } from './alta-cliente-anon.page';

describe('AltaClienteAnonPage', () => {
  let component: AltaClienteAnonPage;
  let fixture: ComponentFixture<AltaClienteAnonPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaClienteAnonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
