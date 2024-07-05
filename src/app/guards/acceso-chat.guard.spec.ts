import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { accesoChatGuard } from './acceso-chat.guard';

describe('accesoChatGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => accesoChatGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
