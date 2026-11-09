import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Fitness } from './fitness';

describe('Fitness', () => {
  let component: Fitness;
  let fixture: ComponentFixture<Fitness>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fitness],
    }).compileComponents();

    fixture = TestBed.createComponent(Fitness);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
