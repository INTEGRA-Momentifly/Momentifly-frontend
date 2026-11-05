import {Component, computed, input, Input} from '@angular/core';
import {FoodLog} from '../../models/food-log.model';
import {FoodLogItem} from '../food-log-item/food-log-item';

@Component({
  imports: [
    FoodLogItem
  ],
  templateUrl:'food-category-section.html',
  styleUrl:'food-category-section.css',
  selector:'app-food-category-section'
})

export class FoodCategorySection{

  categoryName = input.required<string>();

  displayTitle = input.required<string>();

  allLogs = input<FoodLog[]>([]);

  categoryLogs = computed(() => {
    return this.allLogs().filter(item =>
      item.foodCategory?.toUpperCase() === this.categoryName()?.toUpperCase()
    );
  });

  categoryCalories = computed(() => {
    return this.categoryLogs().reduce((sum, item) => sum + (item.calories ?? 0), 0);
  });
}
