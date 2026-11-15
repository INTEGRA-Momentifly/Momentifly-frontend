import { Component, Input } from '@angular/core';
import { Friendship } from '../../models/friendship.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-friendship-item',
  imports: [DatePipe],
  styleUrl: './friendship-item.css',
  templateUrl: './friendship-item.html',
})
export class FriendshipItem {
  @Input() friendship!: Friendship;
  @Input() currentUserId!: string;

  get other(): string {
    return this.friendship?.userId === this.currentUserId
      ? this.friendship?.friendName
      : this.friendship?.userName;
  }
}
