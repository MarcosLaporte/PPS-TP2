import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { rolTipoGuard } from './rol-tipo.guard';

describe('rolTipoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => rolTipoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
