import { Component, inject, OnInit, signal } from '@angular/core';
import { FriendshipList } from '../../components/friendship-list/friendship-list';
import { Friendship } from '../../models/friendship.model';
import { FriendshipService } from '../../services/friendship.service';

@Component({
  selector: 'app-friendships',
  imports: [FriendshipList],
  templateUrl: './friendship.html',
  styleUrl: './friendship.css',
})
export class Friendships implements OnInit {
  private friendshipService = inject(FriendshipService);

  // hardcode id
  currentUserId = 'd213bb1b-b92d-4fae-8dc7-59970a6db834';

  friendships = signal<Friendship[]>([]);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    this.friendshipService.getActiveFriendships().subscribe({
      next: (data) => {
        this.friendships.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading friendships', err);
        this.loading.set(false);
      },
    });
  }
}
