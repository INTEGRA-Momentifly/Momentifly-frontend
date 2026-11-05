import {Component, Input} from '@angular/core';
import {FoodLog} from '../../models/food-log.model';

@Component({
  imports:[],
  templateUrl:'food-log-item.html',
  styleUrl:'food-log-item.css',
  selector:'app-food-log-item'
})

export class FoodLogItem{
  @Input() foodLog!: FoodLog
}
