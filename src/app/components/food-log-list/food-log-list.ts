import {Component, computed, inject, signal} from '@angular/core';
import {FoodCategory, FoodLog} from '../../models/food-log.model';
import {FoodCategorySection} from './food-category-section';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FoodLogService} from '../../services/food-log-service';
import {AuthService} from '../../services/auth.service';

@Component({
  imports: [
    FoodCategorySection,
    ReactiveFormsModule
  ],
  templateUrl:'food-log-list.html',
  styleUrl:'food-log-list.css'
})

export class FoodLogList{
  private foodLogService = inject(FoodLogService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  currentUserId = signal<string | null>(null);

  foodLogs = signal<FoodLog[]>([]);
  isModalOpen = signal<boolean>(false);

  foodForm: FormGroup;

  constructor() {
    this.foodForm = this.fb.group({
      description: ['', Validators.required],
      foodCategory: ['BREAKFAST' as FoodCategory, Validators.required],
      calories: [null, [Validators.min(0)]],
      proteins: [null, [Validators.min(0)]],
      carbs: [null, [Validators.min(0)]],
      fats: [null, [Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadCurrentUserAndLogs();
  }

  loadCurrentUserAndLogs(){
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUserId.set(user.id);
        this.loadFoodLogs();
      },
      error: (err) => console.error('Eroare la preluarea utilizatorului curent:', err)
    })
  }
  loadFoodLogs(){
    this.foodLogService.getFoodLogs().subscribe({
      next: (logs) => this.foodLogs.set(logs),
      error: (err) => console.error('Eroare la preluarea jurnalelor:', err)
    })
  }

  totalCalories = computed(() => {
    return this.foodLogs().reduce((sum,item) => sum + (item.calories ?? 0),0);
  });

  totalEntries = computed(() => this.foodLogs().length)

  openModal(){
    this.foodForm.reset({
      foodCategory: 'BREAKFAST',
      description:'',
      calories: null,
      proteins: null,
      carbs: null,
      fats: null
    });
    this.isModalOpen.set(true);  }

  closeModal(){
    this.isModalOpen.set(false);
  }

  addFoodEntry () {
    console.log('Formular valid:', this.foodForm.valid);
    console.log('Valori formular:', this.foodForm.value);

    if (this.foodForm.invalid) {
      console.warn('Formularul este invalid:', this.foodForm.errors);
      return;
    }
    const formValues = this.foodForm.value;

    const requestPayload = {
      userId: this.currentUserId(),
      description: formValues.description,
      foodCategory: formValues.foodCategory,
      calories: formValues.calories ? Number(formValues.calories) : null,
      proteins: formValues.proteins ? Number(formValues.proteins) : null,
      carbs: formValues.carbs ? Number(formValues.carbs) : null,
      fats: formValues.fats ? Number(formValues.fats) : null,
      date: new Date().toISOString().split('T')[0]
    };

    this.foodLogService.createFoodLog(requestPayload).subscribe({
      next: (savedLog) => {
        this.foodLogs.update(logs => [...logs, savedLog]);
        this.closeModal();
      },
      error: (err) => {
        console.error('Eroare la salvarea alimentului:', err);
      }
    })
  }


  selectCategory(category: FoodCategory) {
    this.foodForm.patchValue({ foodCategory: category }, { emitEvent: false });  }
}
