import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Weather } from './weather';

describe('Weather', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(Weather)).toBeTruthy();
  });
});
