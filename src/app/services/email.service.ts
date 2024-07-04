import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  serverUrl: string = 'https://pushnotificationy.onrender.com'

  constructor(private http: HttpClient) {
  }

  mandarCorreoAutomatico(aceptado: boolean, nombreUsuario: string, mail: string): void{
    this.serverUrl += "/send-mail";
    console.log(this.serverUrl);
    this.http.post<JSON>(this.serverUrl, {
      "aceptacion":aceptado,
      "nombreUsuario":nombreUsuario,
      "mail":mail
    }).subscribe( e => {
      console.log(e);
    });
  }
}
