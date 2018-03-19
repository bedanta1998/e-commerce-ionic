import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Menu } from '../pages/menu/menu';
import { Signup } from '../pages/signup/signup';
import { OneSignal } from "@ionic-native/onesignal";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Menu;

 

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public oneSignal: OneSignal) {
    this.initializeApp();

   
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Now the platform is ready and our plugins are available.
      // Here I can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.oneSignal.startInit('a97c3d56-f695-49aa-8224-a429c591d176', '631671269607');

this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

this.oneSignal.handleNotificationReceived().subscribe(() => {
 // Need to do something when notification is received
});

this.oneSignal.handleNotificationOpened().subscribe(() => {
  // Need to do something when a notification is opened
});

this.oneSignal.endInit();

    });
  }
}
