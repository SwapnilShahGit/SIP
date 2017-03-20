
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

  constructor(userID?: string, firstName?: string, lastName?: string, password?: string,
              email?: string, facebookId?: string, pic?: string,
              school?: string, theme?: Theme) {
    this.userID = userID || '' ;
    this.firstName = firstName || '';
    this.lastName = lastName || '';
    this.password = password || '';
    this.email = email || '';
    this.facebookID = facebookId || '';
    this.pictureURL = pic || '';
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

