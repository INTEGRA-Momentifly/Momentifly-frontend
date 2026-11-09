import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddReminderComponent } from './add-reminder';

describe('AddReminderComponent', () => {
  let component: AddReminderComponent;
  let fixture: ComponentFixture<AddReminderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReminderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddReminderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
