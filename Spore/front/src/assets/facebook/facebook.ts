/// <reference path="./facebookTypings.d.ts" />

export class FBConnector {

  constructor(appID:string) {
    if (!(<any>window).fbAsyncInit) {
      (<any>window).fbAsyncInit = function() {
        (<any>window).FB.init({
          appId: appID,
          xfbml: true,
          version: 'v2.6'
        });
      };
    }
  }

  initFB() {
    var js,
      id = 'facebook-jssdk',
      ref = document.getElementsByTagName('script')[0];

    if (document.getElementById(id)) {
      return;
    }

    js = document.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/sdk.js";

    ref.parentNode.insertBefore(js, ref);
  }

}