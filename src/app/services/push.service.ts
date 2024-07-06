import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RolUsuario } from '../utils/classes/usuarios/persona';
import { TipoCliente } from '../utils/classes/usuarios/cliente';
import { TipoEmpleado } from '../utils/classes/usuarios/empleado';
import { TipoJefe } from '../utils/classes/usuarios/jefe';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  private apiUrl = 'https://pushnotificationy.onrender.com';

  constructor(private http: HttpClient) { }

  sendNotification(token: string, title: string, body: string) {
    const payload = { token, title, body };
    this.sendHttpPostRequest('/notify', payload);
  }

  sendNotificationToRole(title: string, body: string, role: RolUsuario) {
    const payload = { title, body, role };
    this.sendHttpPostRequest('/notify-role', payload);
  }

  sendNotificationToType(title: string, body: string, tipo: TipoCliente | TipoEmpleado | TipoJefe) {
    const payload = { title, body, tipo };
    this.sendHttpPostRequest('/notify-type', payload);
  }

  sendMail(aceptacion: boolean, nombreUsuario: string, mail: string) {
    const payload = { aceptacion, nombreUsuario, mail };
    this.sendHttpPostRequest('/send-mail', payload);
  }

  private sendHttpPostRequest(endpoint: string, payload: any) {
    this.http.post<any>(`${this.apiUrl}${endpoint}`, payload).subscribe({
      next: response => console.log('Notificación enviada', response),
      error: error => console.error('Error al enviar la notificación', error),
      complete: () => console.log('Notificación procesada completamente')
    });
  }

}
