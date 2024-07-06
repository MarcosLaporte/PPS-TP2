import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';
import { BehaviorSubject } from 'rxjs';
import { Colecciones, DatabaseService } from './database.service';
import { Persona } from '../utils/classes/usuarios/persona';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  private _redirect = new BehaviorSubject<any>(null);

  get redirect() {
    return this._redirect.asObservable();
  }

  constructor(private db: DatabaseService) { }

  initPush(id: string) {
    console.log('22» initPush called with id:', id);
    if (Capacitor.getPlatform() !== 'web') {
      console.log("entro init push")
      this.registerPush(id);
      this.getDeliveredNotifications();
    }
  }

  private async registerPush(docUserId: string) {
    console.log('31» registerPush called with id:', docUserId);
    try {
      this.addListeners(docUserId);
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
      }

      await PushNotifications.register();
    } catch (e) {
      console.log('46» Error in registerPush:', e);
    }
  }

  async unregisterPush(docUserId: string) {
    await this.updateTokenInFirestore('', docUserId);
    await PushNotifications.removeAllListeners();
  }

  async getDeliveredNotifications() {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('58» delivered notifications:', notificationList);
  }

  addListeners(docUserId: string) {
    PushNotifications.addListener('registration', async (token: Token) => {
        const fcm_token = token?.value;

        try {
          // Obtener el token guardado en Firestore
          const user = await this.db.traerDoc<Persona>(Colecciones.Usuarios, docUserId);
          const saved_token = user?.token;
          console.log(user);
          
          // Comparar el token actual con el token guardado
          // Según el estado, guardar o actualizar el token en Firestore
          if (!saved_token || saved_token !== fcm_token) {
            await this.updateTokenInFirestore(fcm_token, docUserId);
          }
        } catch (e) {
          console.error('Error getting user or token:', e);
        }
      }
    );

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('87» registrationError event:', JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        console.log('93» pushNotificationReceived event:', JSON.stringify(notification));

        const data = notification?.data;
        if (data?.redirect) this._redirect.next(data?.redirect);
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        const data = notification.notification.data;
        console.log('104» pushNotificationActionPerformed event:', JSON.stringify(notification.notification));
        console.log('105» push data:', data);
        if (data?.redirect) this._redirect.next(data?.redirect);
      }
    );
  }

  async updateTokenInFirestore(newToken: string, docUserId: string) {
    try {
      console.log('113» updateTokenInFirestore called with newToken:', newToken??'NONE', ' and id:', docUserId);
      // Actualizar el token en Firestore
      this.db.actualizarDoc(Colecciones.Usuarios, docUserId, { token: newToken });
      console.log('116» Token updated in Firestore');
    } catch (error) {
      console.error('118» Error updating token in Firestore:', error);
    }
  }
}
