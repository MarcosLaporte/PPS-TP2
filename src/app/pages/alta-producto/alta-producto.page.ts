import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonInput } from '@ionic/angular/standalone';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';
import { MySwal, ToastInfo } from 'src/app/utils/alerts';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Producto } from 'src/app/utils/classes/producto';
import { QrCodeModule } from 'ng-qrcode';
import { tomarFoto } from 'src/main';

@Component({
  selector: 'app-alta-producto',
  templateUrl: './alta-producto.page.html',
  styleUrls: ['./alta-producto.page.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonItem, IonContent,
    IonHeader, IonTitle, IonToolbar, CommonModule, IonInput, ReactiveFormsModule, QrCodeModule]
})
export class AltaProductoPage {
  frmProducto: FormGroup;
  pictures: File[] = [];
  // pictureUrls: string[] = []; // URLs to display the pictures
  qrData: string = '';

  constructor(
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private data: DatabaseService
  ) {
    this.frmProducto = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      minutos: [0, [Validators.required]],
      segundos: [0, [Validators.required, Validators.max(59)]], // Ensure seconds are valid
      precio: [0, [Validators.required, Validators.min(0.01)]], // Ensure price is positive
    });
  }

  async takePics() {
    try {
      let continuar;
      do {
        continuar = false;

        let foto = await tomarFoto();
        //TODO: Si cancela la subida de fotos mostrar un error. Debe subir 3 sí o sí.
        if (foto)
          this.pictures.push(foto);

      } while (this.pictures.length < 3);

    } catch (er: any) {
      await MySwal.fire('Algo salió mal.', er.message, 'error');
    }
  }

  private async uploadPictures(images: File[]): Promise<string[]> {
    const nombreFotoBase = `${this.frmProducto.value.nombre}`;
    let urls = [];
    for (let i = 0; i < images.length; i++) {
      const url = await this.storageService.subirArchivo(images[i], `${Colecciones.Productos}/producto-${nombreFotoBase}-${i + 1}`);
      urls.push(url);
    }
    return urls;
  }

  async subirProducto() {
    try {
      const fotosUrls = await this.uploadPictures(this.pictures);
      if (fotosUrls.length > 0) {
        const tiempo = (this.frmProducto.value.minutos * 60) + this.frmProducto.value.segundos;
        const producto = new Producto(
          '',
          this.frmProducto.value.nombre,
          this.frmProducto.value.descripcion,
          tiempo,
          this.frmProducto.value.precio,
          fotosUrls,
          ''
        );
        await this.data.subirDoc(Colecciones.Productos, producto);

        this.generarQr(fotosUrls);

        MySwal.fire('Producto agregado con éxito');
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  private generarQr(imageUrls: string[]) {
    const productoInfo = `Nombre: ${this.frmProducto.value.nombre}\n` +
      `Descripción: ${this.frmProducto.value.descripcion}\n` +
      `Tiempo: ${this.frmProducto.value.minutos}:${this.frmProducto.value.segundos}\n` +
      `Precio: ${this.frmProducto.value.precio}\n` +
      `Fotos: ${imageUrls.join(', ')}`;
    this.qrData = productoInfo;
    //TODO: El QR tiene que ser el ID del producto en firebase.
  }

}
