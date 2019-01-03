import { TestBed } from '@angular/core/testing';

import { MailExchangeService } from './mail-exchange.service';

describe('MailExchangeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MailExchangeService = TestBed.get(MailExchangeService);
    expect(service).toBeTruthy();
  });
});
