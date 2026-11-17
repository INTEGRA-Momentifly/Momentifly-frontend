import { Component, inject, OnInit, signal } from '@angular/core';
import { FriendshipList } from '../../components/friendship-list/friendship-list';
import { FriendshipForm } from '../../components/add-friendship/add-friendship';
import { Friendship } from '../../models/friendship.model';
import { FriendshipService } from '../../services/friendship.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-friendships',
  standalone: true,
  imports: [FriendshipList, FriendshipForm],
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

  toggleFriendshipForm(): void {
    this.showFriendshipForm.update(value => !value);
    this.errorMessage.set('');
  }

  createFriendship(): void {
    this.loadFriendships();
    this.showFriendshipForm.set(false);
  }
}
