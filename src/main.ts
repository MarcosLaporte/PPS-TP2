import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular, } from '@ionic/angular/standalone';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { firebaseConfig } from './firebaseConfig';
import { QrCodeModule } from 'ng-qrcode';
import { NgxSpinnerModule } from 'ngx-spinner';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy, },
    QrCodeModule,
    provideHttpClient(),
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    importProvidersFrom(NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })),
    provideAnimations(),
  ],
});

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

import { Camera, CameraResultType } from '@capacitor/camera';
import { MySwal, ToastInfo } from './app/utils/alerts';
export const formatosDeImagen = ['jpg', 'jpeg', 'png', 'avif'];

export async function tomarFoto(): Promise<File | undefined> {
  let archivoImagen: File | undefined;
  let tomarOtra: boolean;

  try {
    do {
      archivoImagen = undefined;
      tomarOtra = false;

      const imagen = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });
      if (!formatosDeImagen.includes(imagen.format)) {
        throw new Error('El archivo debe ser de formato .JPG, .JPEG o .PNG');
      }

      await MySwal.fire({
        text: '¿Subir fotografía?',
        imageUrl: imagen.webPath,
        imageWidth: '75vw',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: true,
        confirmButtonText: 'Sí',
        confirmButtonColor: '#a5dc86',
        showDenyButton: true,
        denyButtonText: 'Tomar otra',
        denyButtonColor: '#f0ec0d',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#f27474',
      }).then(async (res) => {
        if (res.isConfirmed)
          archivoImagen = await archivoDesdeUri(imagen.webPath!, imagen.format);
        else if (res.isDenied)
          tomarOtra = true;
      });
    } while (tomarOtra);
  } catch (er: any) {
    if (er.message === 'User cancelled photos app')
      ToastInfo.fire('Operación cancelada.');
    else
      await MySwal.fire('Algo salió mal.', er.message, 'error');
  }

  return archivoImagen;
}

async function archivoDesdeUri(fileUri: string, fileFormat: string): Promise<File> {
  const response = await fetch(fileUri);
  const blob = await response.blob();
  return new File([blob], `photo.${fileFormat}`, { type: `image/${fileFormat}` });
}
