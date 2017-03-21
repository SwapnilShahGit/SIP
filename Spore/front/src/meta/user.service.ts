export class UserService {

  private avatarBaseUrl: string = "https://api.adorable.io/avatars/";

  private avatarEyes: Array<String> = ["eyes1","eyes10","eyes2","eyes3","eyes4","eyes5","eyes6","eyes7","eyes9"];
  private avatarEyesIndex: number = Math.floor(Math.random() * 8);
  private avatarNose: Array<String> = ["nose2","nose3","nose4","nose5","nose6","nose7","nose8","nose9"];
  private avatarNoseIndex: number = Math.floor(Math.random() * 7);
  private avatarMouth: Array<String> = ["mouth1","mouth10","mouth11","mouth3","mouth5","mouth6","mouth7","mouth9"];
  private avatarMouthIndex: number = Math.floor(Math.random() * 7);
  private avatarColour: string = (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);

  public setAvatarColour(colour: string) {
    this.avatarColour = colour.substr(1);
  }

  public getColour() {
    return this.avatarColour;
  }

  public getRandomPicture() {
    this.avatarEyesIndex = Math.floor(Math.random() * 8);
    this.avatarMouthIndex = Math.floor(Math.random() * 7);
    this.avatarNoseIndex = Math.floor(Math.random() * 7);
    return this.getUrl();
  }

  public nextProfilePictureByPart(part: string) {
    if (part == 'eyes') {
      if (this.avatarEyesIndex >= 8) {
        this.avatarEyesIndex = 0;
      } else {
        this.avatarEyesIndex++;
      }
    } else if (part == 'nose') {
      if (this.avatarNoseIndex >= 7) {
        this.avatarNoseIndex = 0;
      } else {
        this.avatarNoseIndex++;
      }
    } else if (part == 'mouth') {
      if (this.avatarMouthIndex >= 7) {
        this.avatarMouthIndex = 0;
      } else {
        this.avatarMouthIndex++;
      }
    }
    return this.getUrl();
  }

  public getUrl() {
    return this.avatarBaseUrl + 'face/'
      + this.avatarEyes[this.avatarEyesIndex] + '/'
      + this.avatarNose[this.avatarNoseIndex] + '/'
      + this.avatarMouth[this.avatarMouthIndex] + '/'
      + this.avatarColour;
  }

}
