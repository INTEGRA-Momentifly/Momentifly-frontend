import {Component, computed, signal} from '@angular/core';
import {FoodCategory, FoodLog} from '../../models/food-log.model';
import {FoodCategorySection} from './food-category-section';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  imports: [
    FoodCategorySection,
    ReactiveFormsModule
  ],
  templateUrl:'food-log-list.html',
  styleUrl:'food-log-list.css'
})

export class FoodLogList{
  foodLogs = signal<FoodLog[]>([]);
  isModalOpen = signal<boolean>(false);

  foodForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.foodForm = this.fb.group({
      description: ['', Validators.required],
      foodCategory: ['BREAKFAST' as FoodCategory, Validators.required],
      calories: [null, [Validators.required, Validators.min(0)]],
      proteins: [null, [Validators.min(0)]],
      carbs: [null, [Validators.min(0)]],
      fats: [null, [Validators.min(0)]]
    });
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
    if(this.foodForm.invalid) return;

    const formValues = this.foodForm.value;

    const newLog: FoodLog = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      userId: 'current-user',
      description: formValues.description,
      foodCategory: formValues.foodCategory,
      calories: Number(formValues.calories) || 0,
      proteins: Number(formValues.proteins) || 0,
      carbs: Number(formValues.carbs) || 0,
      fats: Number(formValues.fats) || 0,
      date: new Date().toISOString()
    };

    this.foodLogs.update(logs => [...logs, newLog]);
    this.closeModal();
  }

  selectCategory(category: FoodCategory) {
    this.foodForm.patchValue({ foodCategory: category }, { emitEvent: false });  }
}
