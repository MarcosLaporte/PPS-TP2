import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonInput } from '@ionic/angular/standalone';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';
import { MySwal } from 'src/app/utils/alerts';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Producto } from 'src/app/utils/clases/producto';

@Component({
  selector: 'app-alta-producto',
  templateUrl: './alta-producto.page.html',
  styleUrls: ['./alta-producto.page.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonItem, IonContent,
    IonHeader, IonTitle, IonToolbar,CommonModule,IonInput,ReactiveFormsModule]
})
export class AltaProductoPage {
  frmProducto: FormGroup;
  pictures: File[] = []; // Array to hold the three photos

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

  readonly supportedImageFormats = ['jpg', 'jpeg', 'png'];

  async takePics() {
    try {
      const images = [];
      for (let i = 0; i < 3; i++) {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri,
        });
        if (!this.supportedImageFormats.includes(image.format)) {
          throw new Error('El archivo debe ser de formato .JPG, .JPEG o .PNG');
        }
        const imgFile = await this.getFileFromUri(image.webPath!, image.format);
        images.push(imgFile);
        // Display prompt for each image
        await MySwal.fire({
          text: `¿Desea subir la foto ${i + 1}?`,
          imageUrl: image.webPath,
          imageWidth: '75vw',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: true,
          confirmButtonText: 'Sí',
          confirmButtonColor: '#a5dc86',
          showDenyButton: true,
          denyButtonText: 'No',
          denyButtonColor: '#f27474',
          showCancelButton: true,
          cancelButtonText: 'Volver a tomar esta foto',
          cancelButtonColor: '#f0ec0d',
        }).then((res) => {
          if (res.isDenied) {
            throw new Error('Operación cancelada por el usuario');
          }
        });
      }
      this.pictures = images;
    } catch (er: any) {
      if (er.message.includes('cancelled')) {
        // ToastInfo.fire('Operación cancelada.');
      } else {
        await MySwal.fire('Algo salió mal.', er.message, 'error');
        throw er;
      }
    }
  }

  private async getFileFromUri(fileUri: string, fileFormat: string): Promise<File> {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    return new File([blob], `photo.${fileFormat}`, { type: `image/${fileFormat}` });
  }

  private async uploadPictures(images: File[]): Promise<string[]> {
    const nombreFotoBase = `${this.frmProducto.value.nombre}`;
    const urls = [];
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
        // Combine minutes and seconds into a single time value in seconds
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
        MySwal.fire('Producto agregado con éxito');
      }
    } catch (error) {
      console.log("error", error);
    }
  }
}
