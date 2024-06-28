import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { clienteAceptadoGuard } from './cliente-aceptado.guard';

describe('clienteAceptadoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => clienteAceptadoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
