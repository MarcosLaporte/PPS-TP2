import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PushNotifications } from '@capacitor/push-notifications';

@Component({
  selector: 'app-push',
  templateUrl: './push.component.html',
  styleUrls: ['./push.component.scss'],
})
export class PushComponent implements OnInit {

  constructor(private plt: Platform) { }

  ngOnInit() {
    if (this.plt.is('android')) {
      this.addListeners();
      this.registerNotifications();
    }
  }

  async registerNotifications() {
    let permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'prompt')
      permStatus = await PushNotifications.requestPermissions();
    if (permStatus.receive !== 'granted')
      console.log('User denied permissions!')
    await PushNotifications.register();
  }

  async addListeners() {
    await PushNotifications.addListener('registration', (token) => {
      console.log("Registration token: ", token.value);
    });

    await PushNotifications.addListener('registrationError', (err) => {
      console.error("Registration error: ", err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log("Push notification received: ", notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {

      console.log("Push notification action performed ", notification.actionId, notification.inputValue);
    });
  }
}
