import { IUser } from './interfaces';

export class User implements IUser {
    
  UserID: string;
  FirstName: string;
  LastName: string;
  Email: string;
  //using email as profile picture URL for now....

  constructor(userID?: string, firstName?: string, lastName?: string, email?: string) {
    this.UserID = userID || '' ;
    this.FirstName = firstName || '';
    this.LastName = lastName || '';
    this.Email = email || 'https://scontent.xx.fbcdn.net/v/t1.0-1/c15.0.50.50/p50x50/10354686_10150004552801856_220367501106153455_n.jpg?oh=6c801f82cd5a32fd6e5a4258ce00a314&oe=589AAD2F';
  }

}
