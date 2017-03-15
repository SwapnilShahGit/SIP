
export class User implements IUser {

  public userID: string;
  public firstName: string;
  public lastName: string;
  public password: string;
  public email: string;
  public facebookID: string;
  public pictureURL: string;
  public school: string;
  public theme: Theme;

  public facebookDefaultPicture: string = 'https://scontent.xx.fbcdn.net/v/t1.0-1/c15.0.50.50/p50x50/10354686_10150004552801856_220367501106153455_n.jpg?oh=6c801f82cd5a32fd6e5a4258ce00a314&oe=589AAD2F';

  constructor(userID?: string, firstName?: string, lastName?: string, password?: string,
              email?: string, facebookId?: string, pic?: string,
              school?: string, theme?: Theme) {
    this.userID = userID || '' ;
    this.firstName = firstName || '';
    this.lastName = lastName || '';
    this.password = password || '';
    this.email = email || '';
    this.facebookID = facebookId || '';
    this.pictureURL = pic || this.facebookDefaultPicture;
    this.school = school || '';
    this.theme = theme || new Theme();
  }

}

export class Theme {
  primaryColour: String = '#f1ae03';
  secondaryColour: String = '#2c5268';
  tertiaryColour: String = '#ec4040';
}

export interface IUser {
  userID: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  facebookID: string;
  pictureURL: string;
  school: string;
  theme: Theme;
}

