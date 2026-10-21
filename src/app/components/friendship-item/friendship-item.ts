import { Component, Input } from '@angular/core';
import { Friendship, User} from '../../models/friendship.model';
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

  get otherUser(): User {
    return this.friendship.user.id === this.currentUserId
      ? this.friendship.friend
      : this.friendship.user;
  }
}
