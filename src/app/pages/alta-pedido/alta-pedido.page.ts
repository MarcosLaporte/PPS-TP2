import {
  CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit, ViewChild, inject,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardTitle, IonCardHeader, IonCardContent, IonItem, IonLabel, IonList, IonIcon, IonAccordion, IonAccordionGroup, IonButton, IonPopover, IonFooter, IonCardSubtitle } from '@ionic/angular/standalone';
import { Producto } from 'src/app/utils/classes/producto';
import { Colecciones, DatabaseService, } from 'src/app/services/database.service';
import { addIcons } from 'ionicons';
import { addCircleOutline, chatboxEllipsesOutline, receiptOutline, removeCircleOutline } from 'ionicons/icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { MySwal, ToastError, ToastSuccess } from 'src/app/utils/alerts';
import { ModalController } from '@ionic/angular';
import { PedidoComponent } from 'src/app/components/pedido/pedido.component';

@Component({
  selector: 'app-alta-pedido',
  templateUrl: './alta-pedido.page.html',
  styleUrls: ['./alta-pedido.page.scss'],
  standalone: true,
  imports: [IonCardSubtitle, IonFooter, IonPopover, IonButton, IonAccordionGroup, IonAccordion, IonIcon, IonList, IonLabel, IonItem, IonCardContent, IonCardHeader, IonCardTitle, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, NgOptimizedImage],
  providers: [ModalController]
})
export class AltaPedidoPage {
  protected pedido: Producto[] = [];
  precio: number = 0;
  productosElegidos: { [id: string]: number } = {};
  productos: Producto[] = [];

  constructor(
    private db: DatabaseService,
    private spinner: NgxSpinnerService,
    private modalCtrl: ModalController
  ) {
    this.spinner.show();

    this.db.traerColeccion<Producto>(Colecciones.Productos).then((prods) => {
      this.productos = prods;
      this.spinner.hide();
    });

    addIcons({ receiptOutline, addCircleOutline, removeCircleOutline, chatboxEllipsesOutline });
  }

  async addProducto(prod: Producto, cant: number) {
    console.log(cant);
    if (cant > 0) {
      this.pedido.push(prod);
    } else {
      ToastError.fire("Cantidad inválida!")
    }
  }

  manejarProdCant(prod: Producto, inputEv: CustomEvent) {
    const cant: number = Number(inputEv.detail.value ?? '');
    if (cant === 0)
      delete this.productosElegidos[prod.id];
    else
      this.productosElegidos[prod.id] = cant;
  }
  restarProd(idProd: string) {
    if (this.productosElegidos[idProd])
      this.precio -= this.precio > 0 ? this.productos.filter(e => { return e.id == idProd })[0].precio : 0;

    if (this.productosElegidos[idProd] > 1)
      this.productosElegidos[idProd]--;
    else
      delete this.productosElegidos[idProd];

  }

  sumarProd(idProd: string) {
    this.productosElegidos[idProd] = (this.productosElegidos[idProd] || 0) + 1;
    if (this.productosElegidos[idProd])
      this.precio += this.productos.filter(e => { return e.id == idProd })[0].precio;
  }
  async mostrarProd() {
    const modal = await this.modalCtrl.create({
      component: PedidoComponent,
      id: 'pedido-modal',
      componentProps: { productos: this.productos, prodCant: this.productosElegidos },
    });
    modal.present();
  }

  consultar() { }
}