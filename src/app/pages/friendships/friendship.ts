import { Component, inject, OnInit, signal } from '@angular/core';
import { FriendshipList } from '../../components/friendship-list/friendship-list';
import { FriendshipForm } from '../../components/add-friendship/add-friendship';
import { Friendship } from '../../models/friendship.model';
import { FriendshipService } from '../../services/friendship.service';
import { AuthService } from '../../services/auth.service';
import { FriendshipRequests } from '../../components/friendship-requests/friendship-requests';

@Component({
  selector: 'app-friendships',
  standalone: true,
  imports: [FriendshipList, FriendshipForm, FriendshipRequests],
  templateUrl: './friendship.html',
  styleUrl: './friendship.css',
})
export class Friendships implements OnInit {

  private friendshipService = inject(FriendshipService);
  private authService = inject(AuthService);

  friendships = signal<Friendship[]>([]);
  loading = signal<boolean>(true);
  showFriendshipForm = signal<boolean>(false);
  errorMessage = signal<string>('');
  showRequests = signal<boolean>(false);
  requestCount = signal<number>(0);

  currentUserId: string = '';

  ngOnInit(): void {

    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUserId = user.id;
      },
      error: (err) => {
        console.error('Error loading current user', err);
      }
    });


    this.loadFriendships();
    this.loadRequestCount();
  }

  loadRequestCount(): void {
      this.friendshipService.getFriendshipRequests().subscribe({
        next: (data) => this.requestCount.set(data.length),
        error: (err) => console.error(err)
      });
    }

  loadFriendships(): void {
    this.loading.set(true);

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

  toggleRequests(): void {
      this.showRequests.update(value => !value);
    }

  onRequestsUpdated(): void {
      this.loadRequestCount();
      this.loadFriendships();
    }

  toggleFriendshipForm(): void {
    this.showFriendshipForm.update(value => !value);
    this.errorMessage.set('');
  }

  createFriendship(): void {
    this.loadFriendships();
    this.showFriendshipForm.set(false);
  }
}
