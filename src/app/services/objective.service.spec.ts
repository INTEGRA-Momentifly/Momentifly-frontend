import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FitnessObjectives } from '../models/objective.model';
import { OBJECTIVES_API_CONFIG, ObjectiveService } from './objective.service';

const OBJECTIVES: FitnessObjectives = { calories: 2000, protein: 150, carbohydrates: 200, fats: 67 };
const USER_URL = `${OBJECTIVES_API_CONFIG.baseUrl}/${OBJECTIVES_API_CONFIG.userId}`;

describe('ObjectiveService', () => {
  let api: ObjectiveService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(ObjectiveService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  describe('get()', () => {
    it('requests the objectives for the configured user and maps the response', () => {
      const result = vi.fn();
      api.get().subscribe(result);

      const req = http.expectOne(
        (r) => r.url === OBJECTIVES_API_CONFIG.baseUrl && r.params.get('userId') === OBJECTIVES_API_CONFIG.userId,
      );
      expect(req.request.method).toBe('GET');
      req.flush({ calories: 2000.4, protein: 150, carbohydrates: 200, fats: 67 });

      expect(result).toHaveBeenCalledWith(OBJECTIVES);
    });

    it('emits null when the user has no objectives (404)', () => {
      const result = vi.fn();
      const error = vi.fn();
      api.get().subscribe({ next: result, error });

      http.expectOne((r) => r.url === OBJECTIVES_API_CONFIG.baseUrl).flush('Not found', {
        status: 404,
        statusText: 'Not Found',
      });

      expect(result).toHaveBeenCalledWith(null);
      expect(error).not.toHaveBeenCalled();
    });

    it('emits null when the backend returns only empty fields', () => {
      const result = vi.fn();
      api.get().subscribe(result);

      http
        .expectOne((r) => r.url === OBJECTIVES_API_CONFIG.baseUrl)
        .flush({ calories: null, protein: null, carbohydrates: null, fats: null });

      expect(result).toHaveBeenCalledWith(null);
    });

    it('propagates server errors', () => {
      const error = vi.fn();
      api.get().subscribe({ error });

      http.expectOne((r) => r.url === OBJECTIVES_API_CONFIG.baseUrl).flush('Boom', {
        status: 500,
        statusText: 'Server Error',
      });

      expect(error).toHaveBeenCalledWith(expect.objectContaining({ status: 500 }));
    });

    it('propagates network failures', () => {
      const error = vi.fn();
      api.get().subscribe({ error });

      http.expectOne((r) => r.url === OBJECTIVES_API_CONFIG.baseUrl).error(new ProgressEvent('error'));

      expect(error).toHaveBeenCalledWith(expect.objectContaining({ status: 0 }));
    });
  });

  it('create() POSTs the objectives to the user URL and maps the response', () => {
    const result = vi.fn();
    api.create(OBJECTIVES).subscribe(result);

    const req = http.expectOne(USER_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(OBJECTIVES);
    req.flush(OBJECTIVES);

    expect(result).toHaveBeenCalledWith(OBJECTIVES);
  });

  it('update() PUTs the objectives to the user URL and maps the response', () => {
    const result = vi.fn();
    api.update(OBJECTIVES).subscribe(result);

    const req = http.expectOne(USER_URL);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(OBJECTIVES);
    req.flush(OBJECTIVES);

    expect(result).toHaveBeenCalledWith(OBJECTIVES);
  });

  it('create() emits null when the backend returns an empty body', () => {
    const result = vi.fn();
    api.create(OBJECTIVES).subscribe(result);

    http.expectOne(USER_URL).flush(null);

    expect(result).toHaveBeenCalledWith(null);
  });
});
