import { Component } from '@angular/core';
import { FriendshipList } from '../../components/friendship-list/friendship-list';
import { Friendship } from '../../models/friendship.model';

@Component({
  selector: 'app-friendships',
  imports: [FriendshipList],
  templateUrl: './friendship.html',
    styleUrl: './friendship.css',
})
export class Friendships {
  currentUserId = '10';
  friendships: Friendship[] = [
    {
      id: '1',
      user: { id: '10', username: 'Peter' },
      friend: { id: '20', username: 'Anna' },
      friendshipDate: '2026-10-10T12:00:00',
      status: 'ACCEPTED',
    },
    {
      id: '2',
      user: { id: '30', username: 'Mark' },
      friend: { id: '10', username: 'Peter' },
      friendshipDate: '2026-10-15T12:00:00',
      status: 'ACCEPTED',
    },
    {
          id: '3',
          user: { id: '30', username: 'Hanna' },
          friend: { id: '10', username: 'Peter' },
          friendshipDate: '2026-10-15T12:00:00',
          status: 'DECLINED',
        },
  ];
}
