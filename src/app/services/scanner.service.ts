import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BarcodeScanner, Barcode } from '@capacitor-mlkit/barcode-scanning';


@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  constructor(private alertController: AlertController) {}

  // Verifica si el escáner de códigos de barras es compatible con el dispositivo
  async isScannerSupported(): Promise<boolean> {
    const result = await BarcodeScanner.isSupported();
    return result.supported;
  }

  // Realiza el escaneo de códigos de barras
  async scanBarcodes(): Promise<Barcode[]> {
    const granted = await this.requestPermissions();
    if (!granted) {
      await this.presentAlert();
      return [];
    }

    try {
      const { barcodes } = await BarcodeScanner.scan();
      return barcodes;
    } catch (error) {
      console.error('Error durante el escaneo:', error);
      return [];
    }
  }

  // Solicita permisos para usar la cámara
  private async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  // Muestra una alerta si no se otorgan los permisos de la cámara
  private async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permiso denegado',
      message: 'Por favor, concede permiso para usar la cámara y poder utilizar el escáner de códigos de barras.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Extrae datos del DNI de un valor crudo del código de barras
  extractDniData(rawValue: string): { dni: number, nombre: string, apellido: string } | null {
    const partes = rawValue.split('@');
    if (partes.length >= 3) {
      const dni = partes.find(part => /^\d{8}$/.test(part));
      const apellido = this.capitalize(partes[1]);
      const nombre = this.capitalizeNames(partes[2]);
      if (dni) {
        return {
          dni: parseInt(dni, 10),
          nombre: nombre,
          apellido: apellido
        };
      }
    }
    return null;
  }

  // Capitaliza la primera letra de una palabra y convierte el resto a minúsculas
  private capitalize(text: string): string {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  // Capitaliza los nombres, manejando múltiples palabras
  private capitalizeNames(names: string): string {
    return names
      .split(' ')
      .map(name => this.capitalize(name))
      .join(' ');
  }
}
