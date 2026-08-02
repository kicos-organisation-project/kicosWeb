import { ApiService } from '../../../core/services/api.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

/**
 * Light unit coverage for category filtering used by CategorieComponent.
 * Full component has heavy PrimeNG deps — filter logic is tested via ApiService.
 */
describe('Categorie filtering (via ApiService)', () => {
  let api: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    api = TestBed.inject(ApiService);
  });

  it('filters categories by titre for admin/partner lists', () => {
    const categories = [
      { titre: 'Boissons', type: 'resto' },
      { titre: 'Plats', type: 'resto' },
      { titre: 'Électronique', type: 'boutique' },
    ];

    const result = api.filterByTerm(categories, 'boi', ['titre']);
    expect(result).toEqual([{ titre: 'Boissons', type: 'resto' }]);
  });

  it('returns empty when no category matches', () => {
    const categories = [{ titre: 'Plats' }];
    expect(api.filterByTerm(categories, 'xyz', ['titre']).length).toBe(0);
  });
});
