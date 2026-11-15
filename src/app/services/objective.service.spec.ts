import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FitnessObjectives } from '../models/objective.model';
import { OBJECTIVES_API_URL, ObjectiveService } from './objective.service';

const OBJECTIVES: FitnessObjectives = { calories: 2000, protein: 150, carbohydrates: 200, fats: 67 };
const EMPTY = { calories: null, protein: null, carbohydrates: null, fats: null };
const WRITES = [
  { type: 'CALORIES', value: 2000 },
  { type: 'PROTEIN', value: 150 },
  { type: 'CARBOHYDRATES', value: 200 },
  { type: 'FATS', value: 67 },
];

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

  function expectWrites(methods: ('POST' | 'PUT')[], finalResponse: FitnessObjectives | null = OBJECTIVES): void {
    WRITES.forEach((body, index) => {
      const req = http.expectOne((r) => r.url === OBJECTIVES_API_URL && r.method !== 'GET');
      expect(req.request.method).toBe(methods[index]);
      expect(req.request.body).toEqual(body);
      req.flush(index === WRITES.length - 1 ? finalResponse : {});
    });
  }

  describe('get()', () => {
    it('requests the objectives of the logged-in user without a userId and maps the response', () => {
      const result = vi.fn();
      api.get().subscribe(result);

      const req = http.expectOne(OBJECTIVES_API_URL);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys()).toEqual([]);
      req.flush({ calories: 2000.4, protein: 150, carbohydrates: 200, fats: 67 });

      expect(result).toHaveBeenCalledWith(OBJECTIVES);
    });

    it('emits null when the backend returns only empty fields', () => {
      const result = vi.fn();
      api.get().subscribe(result);

      http.expectOne(OBJECTIVES_API_URL).flush(EMPTY);

      expect(result).toHaveBeenCalledWith(null);
    });

    it('emits null on 404', () => {
      const result = vi.fn();
      const error = vi.fn();
      api.get().subscribe({ next: result, error });

      http.expectOne(OBJECTIVES_API_URL).flush('Not found', { status: 404, statusText: 'Not Found' });

      expect(result).toHaveBeenCalledWith(null);
      expect(error).not.toHaveBeenCalled();
    });

    it('propagates server errors', () => {
      const error = vi.fn();
      api.get().subscribe({ error });

      http.expectOne(OBJECTIVES_API_URL).flush('Boom', { status: 500, statusText: 'Server Error' });

      expect(error).toHaveBeenCalledWith(expect.objectContaining({ status: 500 }));
    });

    it('propagates network failures', () => {
      const error = vi.fn();
      api.get().subscribe({ error });

      http.expectOne(OBJECTIVES_API_URL).error(new ProgressEvent('error'));

      expect(error).toHaveBeenCalledWith(expect.objectContaining({ status: 0 }));
    });
  });

  it('create() POSTs one request per objective type, in order, and emits the final response', () => {
    const result = vi.fn();
    api.create(OBJECTIVES).subscribe(result);

    http.expectOne((r) => r.method === 'GET').flush(EMPTY);
    expectWrites(['POST', 'POST', 'POST', 'POST']);

    expect(result).toHaveBeenCalledOnce();
    expect(result).toHaveBeenCalledWith(OBJECTIVES);
  });

  it('update() PUTs one request per objective type when all types already exist', () => {
    const result = vi.fn();
    api.update(OBJECTIVES).subscribe(result);

    http.expectOne((r) => r.method === 'GET').flush({ calories: 1800, protein: 120, carbohydrates: 180, fats: 60 });
    expectWrites(['PUT', 'PUT', 'PUT', 'PUT']);

    expect(result).toHaveBeenCalledWith(OBJECTIVES);
  });

  it('PUTs the types that exist and POSTs the missing ones after a partial save', () => {
    const result = vi.fn();
    api.create(OBJECTIVES).subscribe(result);

    http.expectOne((r) => r.method === 'GET').flush({ calories: 2000, protein: 150, carbohydrates: null, fats: null });
    expectWrites(['PUT', 'PUT', 'POST', 'POST']);

    expect(result).toHaveBeenCalledWith(OBJECTIVES);
  });

  it('stops at the first failed write and propagates the error', () => {
    const result = vi.fn();
    const error = vi.fn();
    api.create(OBJECTIVES).subscribe({ next: result, error });

    http.expectOne((r) => r.method === 'GET').flush(EMPTY);
    http.expectOne((r) => r.method === 'POST').flush({});
    http
      .expectOne((r) => r.method === 'POST')
      .flush('Value must be greater than 0', { status: 400, statusText: 'Bad Request' });

    expect(result).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith(expect.objectContaining({ status: 400 }));
  });

  it('emits null when the final response is empty', () => {
    const result = vi.fn();
    api.create(OBJECTIVES).subscribe(result);

    http.expectOne((r) => r.method === 'GET').flush(EMPTY);
    expectWrites(['POST', 'POST', 'POST', 'POST'], null);

    expect(result).toHaveBeenCalledWith(null);
  });
});
