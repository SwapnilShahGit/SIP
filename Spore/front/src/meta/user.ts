export class User {
    
  id: string;
  fname: string;
  lname: string;
  email: string;
  profileImage: string;
  //swapping email and profileImage FOR NOW...

  constructor(id?: string, response?: any, fnam?: string, lnam?: string, eml?: string, profileImg?: string) {
    this.id = id || '' ;
    this.fname = response && response.first_name || fnam || '';
    this.lname = response && response.last_name || lnam || '';
    this.email = response && response.picture && response.picture.data && response.picture.data.url || profileImg || 'https://scontent.xx.fbcdn.net/v/t1.0-1/c15.0.50.50/p50x50/10354686_10150004552801856_220367501106153455_n.jpg?oh=6c801f82cd5a32fd6e5a4258ce00a314&oe=589AAD2F';
    this.profileImage = response && response.email || eml || '';
  }

}