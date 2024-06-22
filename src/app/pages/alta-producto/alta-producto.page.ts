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
import { helpCircleOutline } from 'ionicons/icons';

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
  fotos: { archivo: File | null, url: string | null }[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private db: DatabaseService,
    private storage: StorageService
  ) {
    this.frmProducto = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      minutos: [0, [Validators.required, Validators.min(0)]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
    });

    addIcons({ helpCircleOutline });
  }

  private async tomarFotos(): Promise<void> {
    try {
      let continuarTomando = true;
      while (continuarTomando || this.fotos.length < 3) {
        const foto = await tomarFoto();
        if (foto) {
          this.fotos.push({ archivo: foto, url: URL.createObjectURL(foto) });
        }
        // Pregunta al usuario si desea tomar otra foto, excepto cuando tienen menos de 3 fotos
        if (this.fotos.length >= 3) {
          const resultado = await MySwal.fire({
            title: '¿Desea tomar otra foto?',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
          });
          continuarTomando = resultado.isConfirmed;
        }
      }
    } catch (er: any) {
      await MySwal.fire('Algo salió mal.', er.message, 'error');
    }
  }

  private async subirFotos(): Promise<void> {
    try {
      this.spinner.show();
      const promesas = this.fotos.map(async (foto, indice) => {
        if (foto.archivo) {
          const nombreFotoBase = `${this.frmProducto.value.nombre}-foto-${indice + 1}`;
          const url = await this.storage.subirArchivo(foto.archivo, `${Colecciones.Productos}/${nombreFotoBase}`);
          foto.url = url;
        }
      });
      await Promise.all(promesas);
    } catch (error: any) {
      console.error("Error al subir fotos:", error);
    } finally {
      this.spinner.hide();
    }
  }

  async subirProducto() {
    try {
      await this.tomarFotos();

      this.spinner.show();
      await this.subirFotos();

      const tiempo = this.frmProducto.value.minutos;
      const producto = new Producto(
        '',
        this.frmProducto.value.nombre,
        this.frmProducto.value.descripcion,
        tiempo,
        this.frmProducto.value.precio,
        this.fotos.filter(f => f.url !== null).map(f => f.url as string),
      );
      await this.db.subirDoc(Colecciones.Productos, producto);

      MySwal.fire('Producto agregado con éxito');

      this.frmProducto.reset({
        nombre: '',
        descripcion: '',
        minutos: 0,
        precio: 0
      });

      this.fotos = [];
    } catch (error: any) {
      console.error("Error al subir producto:", error);
    } finally {
      this.spinner.hide();
    }
  }
}
