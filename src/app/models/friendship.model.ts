export interface User {
  id: string;
  username: string;
}

export type Status = 'PENDING' | 'DECLINED' | 'ACCEPTED';

export interface Friendship {
  id: string;
    userId: string;
    userName: string;
    friendId: string;
    friendName: string;
    friendshipDate: string;
    status: string;
}
