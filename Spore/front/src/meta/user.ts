
export class User implements IUser {

  UserID: string;
  FirstName: string;
  LastName: string;
  Password: string;
  Email: string;
  Gender: string;
  FacebookID: string;
  PictureURL: string;
  School: string;
  Theme: string;

  public FacebookDefaultPicture: string = 'https://scontent.xx.fbcdn.net/v/t1.0-1/c15.0.50.50/p50x50/10354686_10150004552801856_220367501106153455_n.jpg?oh=6c801f82cd5a32fd6e5a4258ce00a314&oe=589AAD2F';

  constructor(userID?: string, firstName?: string, lastName?: string, password?: string, email?: string, gender?: string, facebookId?: string, pic?: string, school?: string, theme?: string) {
    this.UserID = userID || '' ;
    this.FirstName = firstName || '';
    this.LastName = lastName || '';
    this.Password = password || '';
    this.Email = email || '';
    this.Gender = gender || '';
    this.FacebookID = facebookId || '';
    this.PictureURL = pic || this.FacebookDefaultPicture;
    this.School = school || '';
    this.Theme = theme || 'Default';
  }

}

export interface IUser {
  UserID: string,
  FirstName: string,
  LastName: string,
  Password: string,
  Email: string,
  Gender: string;
  FacebookID: string,
  PictureURL: string,
  School: string,
  Theme: string
}

