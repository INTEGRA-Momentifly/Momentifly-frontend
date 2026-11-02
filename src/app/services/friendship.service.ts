import { Injectable, inject } from '@angular/core';
import { Friendship } from '../models/friendship.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { delay, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FriendshipService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/friendships';

  private authHeaders = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('username11:username1')
    });

  /*getActiveFriendships(): Observable<Friendship[]> {
    return this.http.get<Friendship[]>(`${this.baseUrl}?status=ACCEPTED`);
  }*/

  getActiveFriendships(): Observable<Friendship[]> {
    return this.http.get<Friendship[]>(`${this.baseUrl}?status=ACCEPTED`, {
        headers: this.authHeaders
      });
    }
}
