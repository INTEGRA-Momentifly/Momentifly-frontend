export interface User {
  id: string;
  username: string;
}

export type Status = 'PENDING' | 'DECLINED' | 'ACCEPTED';

export interface Friendship {
  id: string;
  user: User;
  friend: User;
  friendshipDate: string;
  status: Status;
}
