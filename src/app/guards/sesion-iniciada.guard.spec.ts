import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { sesionIniciadaGuard } from './sesion-iniciada.guard';

describe('sesionIniciadaGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => sesionIniciadaGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
