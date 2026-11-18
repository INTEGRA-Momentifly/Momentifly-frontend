import { Component, inject, OnInit, signal, output } from '@angular/core';
import { Friendship } from '../../models/friendship.model';
import { FriendshipService } from '../../services/friendship.service';

@Component({
  selector: 'app-friendship-requests',
  standalone: true,
  templateUrl: './friendship-requests.html',
  styleUrl: './friendship-requests.css',
})
export class FriendshipRequests implements OnInit {

  private friendshipService = inject(FriendshipService);

  requests = signal<Friendship[]>([]);
  loading = signal<boolean>(true);

  requestsUpdated = output<void>();

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading.set(true);

    this.friendshipService.getFriendshipRequests().subscribe({
      next: (data) => {
        this.requests.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading requests', err);
        this.loading.set(false);
      }
    });
  }

  modifyRequest(id: string, status: string): void {
    this.friendshipService.modifyFriendshipStatus(status, id)
      .subscribe({
        next: () => {
          this.loadRequests();
          this.requestsUpdated.emit();
        },
        error: (err) => {
          console.error('Error modifying request', err);
        }
      });
  }
}
