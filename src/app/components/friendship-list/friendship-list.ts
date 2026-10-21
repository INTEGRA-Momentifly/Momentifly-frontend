import { Component, Input, input, signal } from '@angular/core';
import { FriendshipItem } from '../friendship-item/friendship-item';
import { Friendship } from '../../models/friendship.model';

@Component({
  imports: [FriendshipItem],
  selector: 'app-friendship-list',
  styleUrl: './friendship-list.css',
  templateUrl: './friendship-list.html',
})

export class FriendshipList {
  friendships = input<Friendship[]>([]);
  loading = input(false);

  get activeFriends(): Friendship[] {
    return this.friendships().filter((friendship) => friendship.status == 'ACCEPTED');
  }
}
