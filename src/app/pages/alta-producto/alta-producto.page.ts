import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonInput, IonCardHeader, IonCard, IonCardTitle, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';
import { MySwal } from 'src/app/utils/alerts';
import { Producto } from 'src/app/utils/classes/producto';
import { QrCodeModule } from 'ng-qrcode';
import { tomarFoto } from 'src/main';
import { NgxSpinnerService } from 'ngx-spinner';
import { addIcons } from 'ionicons';
import { helpCircleOutline, search } from 'ionicons/icons';

@Component({
  selector: 'app-alta-producto',
  templateUrl: './alta-producto.page.html',
  styleUrls: ['./alta-producto.page.scss'],
  standalone: true,
  imports: [IonIcon, IonCardContent, IonCardTitle, IonCard, IonCardHeader, IonButton, IonLabel, IonItem, IonContent,
    IonHeader, IonTitle, IonToolbar, CommonModule, IonInput, ReactiveFormsModule, QrCodeModule]
})
export class AltaProductoPage {
  frmProducto: FormGroup;
  pictures: { file: File | null, url: string | null }[] = [
    { file: null, url: null },
    { file: null, url: null },
    { file: null, url: null }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private db: DatabaseService,
    private storage: StorageService
  ) {
    this.frmProducto = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      minutos: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
      segundos: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
    });

    addIcons({ helpCircleOutline });
  }

  async takePics() {
    try {
      let continuar;
      do {
        continuar = false;
        let foto = await tomarFoto();
        if (foto) {
          // Find the first empty slot in pictures array and fill it
          const emptySlotIndex = this.pictures.findIndex(p => p.file === null);
          if (emptySlotIndex !== -1) {
            this.pictures[emptySlotIndex].file = foto;
            this.pictures[emptySlotIndex].url = URL.createObjectURL(foto); // Create a URL for preview
          }
        }
      } while (this.pictures.some(p => p.file === null));
    } catch (er: any) {
      await MySwal.fire('Algo salió mal.', er.message, 'error');
    }
  }

  private async uploadPictures(): Promise<void> {
    try {
      this.spinner.show();
      const promises = this.pictures.map(async (pic, index) => {
        if (pic.file) {
          const nombreFotoBase = `${this.frmProducto.value.nombre}-foto-${index + 1}`;
          const url = await this.storage.subirArchivo(pic.file, `${Colecciones.Productos}/${nombreFotoBase}`);
          this.pictures[index].url = url;
        }
      });
      await Promise.all(promises);
    } catch (error: any) {
      console.error("Error al subir fotos:", error);
    } finally {
      this.spinner.hide();
    }
  }

  async subirProducto() {
    try {
      this.spinner.show();
      await this.uploadPictures();

      const tiempo = (this.frmProducto.value.minutos * 60) + this.frmProducto.value.segundos;
      const producto = new Producto(
        '',
        this.frmProducto.value.nombre,
        this.frmProducto.value.descripcion,
        tiempo,
        this.frmProducto.value.precio,
        this.pictures.filter(p => p.url !== null).map(p => p.url as string),
        ''
      );
      await this.db.subirDoc(Colecciones.Productos, producto);

      MySwal.fire('Producto agregado con éxito');
    } catch (error: any) {
      console.error("Error al subir producto:", error);
    } finally {
      this.spinner.hide();
    }
  }
}
