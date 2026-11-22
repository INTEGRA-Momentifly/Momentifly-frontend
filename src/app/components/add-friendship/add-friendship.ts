import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FriendshipService } from '../../services/friendship.service';

@Component({
  selector: 'app-friendship',
  standalone: true,
  imports: [FormsModule],
  styleUrl: './add-friendship.css',
  templateUrl: './add-friendship.html',
})
export class FriendshipForm {

  @Output() friendshipCreated = new EventEmitter<void>();

  friend = {
    description: ''
  };

  errorMessage = '';

  constructor(private friendshipService: FriendshipService) {}

  submitForm(): void {
    const friendName = this.friend.description.trim();

    if (!friendName) return;

    this.errorMessage = '';

    this.friendshipService.newFriendshipRequest(friendName).subscribe({
      next: () => {
        this.friend.description = '';
        this.friendshipCreated.emit();
      },
      error: (error) => {
        if (error.status === 400) {
          this.errorMessage = 'There is no user with this username.';
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
      }
    });
  }
}
