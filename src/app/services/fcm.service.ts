import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';
import { BehaviorSubject } from 'rxjs';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  private _redirect = new BehaviorSubject<any>(null);

  get redirect() {
    return this._redirect.asObservable();
  }

  constructor(
    private databaseService: DatabaseService // Inyecta tu servicio DatabaseService aquí
  ) { }

  initPush(id: string) {
    console.log('*** initPush called with id:', id);
    if (Capacitor.getPlatform() !== 'web') {

      console.log("entro init push")
      this.registerPush(id);
      this.getDeliveredNotifications();
    }
  }

  private async registerPush(id: string) {
    console.log('*** registerPush called with id:', id);
    try {
      await this.addListeners(id);
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
      }

      await PushNotifications.register();
    } catch (e) {
      console.log('*** Error in registerPush:', e);
    }
  }

  async getDeliveredNotifications() {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('*** delivered notifications:', notificationList);
  }

  addListeners(id: string) {
    console.log('*** addListeners called with id:', id);
    PushNotifications.addListener(
      'registration',
      async (token: Token) => {
        console.log('*** registration event with token:', token);
        const fcm_token = (token?.value);
        let go = 1;
        let saved_token;

        try {
          // Obtener el token guardado en Firestore
          const user = await this.databaseService.traerDoc<any>('users', id);
          saved_token = user?.token;
          console.log('*** saved_token from Firestore:', saved_token);

          // Comparar el token actual con el token guardado
          if (saved_token === fcm_token) {
            console.log('*** same token');
            go = 0;
          } else {
            go = 2;
          }
        } catch (e) {
          console.error('*** Error getting user or token:', e);
        }

        // Según el estado, guardar o actualizar el token en Firestore
        if (go === 1) {
          console.log('*** go === 1, calling saveTokenToFirestore');
          await this.saveTokenToFirestore(fcm_token, id);
        } else if (go === 2) {
          console.log('*** go === 2, calling updateTokenInFirestore');
          await this.updateTokenInFirestore(fcm_token, id);
        }
      }
    );

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('*** registrationError event:', JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        console.log('*** pushNotificationReceived event:', JSON.stringify(notification));

        const data = notification?.data;
        if (data?.redirect) this._redirect.next(data?.redirect);
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        const data = notification.notification.data;
        console.log('*** pushNotificationActionPerformed event:', JSON.stringify(notification.notification));
        console.log('*** push data:', data);
        if (data?.redirect) this._redirect.next(data?.redirect);
      }
    );
  }

  async saveTokenToFirestore(token: string, id: string) {
    try {
      console.log('*** saveTokenToFirestore called with token:', token, 'and id:', id);
      // Guardar el token en Firestore
      await this.databaseService.actualizarDoc('users', id, { token: token });
      console.log('*** Token saved to Firestore');
    } catch (error) {
      console.error('*** Error saving token to Firestore:', error);
    }
  }

  async updateTokenInFirestore(newToken: string, id: string) {
    try {
      console.log('*** updateTokenInFirestore called with newToken:', newToken, 'and id:', id);
      // Actualizar el token en Firestore
      await this.databaseService.actualizarDoc('users', id, { token: newToken });
      console.log('*** Token updated in Firestore');
    } catch (error) {
      console.error('*** Error updating token in Firestore:', error);
    }
  }
}
