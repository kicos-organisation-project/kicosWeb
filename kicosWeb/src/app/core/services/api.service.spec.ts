import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('filterByTerm returns all items when term is empty', () => {
    const items = [{ name: 'Pizza' }, { name: 'Burger' }];
    expect(service.filterByTerm(items, '', ['name'])).toEqual(items);
  });

  it('filterByTerm filters case-insensitively on flat properties', () => {
    const items = [
      { name: 'Pizza Margherita' },
      { name: 'Burger' },
      { name: 'pizza 4 fromages' },
    ];

    const result = service.filterByTerm(items, 'pizza', ['name']);
    expect(result.length).toBe(2);
  });

  it('filterByTerm supports nested properties', () => {
    const items = [
      { user: { firstName: 'Awa' } },
      { user: { firstName: 'Moussa' } },
    ];

    const result = service.filterByTerm(items, 'awa', ['user.firstName']);
    expect(result.length).toBe(1);
    expect(result[0].user.firstName).toBe('Awa');
  });

  it('filterByTerm ignores missing nested paths', () => {
    const items = [{ user: null }, { user: { firstName: 'Awa' } }];
    const result = service.filterByTerm(items, 'awa', ['user.firstName']);
    expect(result.length).toBe(1);
  });

  it('put currently uses HTTP POST (known bug regression guard)', () => {
    service.put('/api/items/1', { name: 'x' }).subscribe();
    const req = httpMock.expectOne('/api/items/1');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
