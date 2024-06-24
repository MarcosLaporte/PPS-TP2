import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
  IonItem,
  IonLabel,
  IonList,
  IonIcon,
  IonAccordion,
  IonAccordionGroup,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Producto } from 'src/app/utils/classes/producto';
import {
  Colecciones,
  DatabaseService,
} from 'src/app/services/database.service';
import { addIcons } from 'ionicons';
import { addOutline, book, receiptOutline, removeOutline } from 'ionicons/icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { MySwal, ToastError, ToastSuccess } from 'src/app/utils/alerts';
import Swiper from 'swiper';
import { PedidoComponent } from 'src/app/components/pedido/pedido.component';

@Component({
  selector: 'app-alta-pedido',
  templateUrl: './alta-pedido.page.html',
  styleUrls: ['./alta-pedido.page.scss'],
  standalone: true,
  imports: [
    IonAccordionGroup,
    IonAccordion,
    IonIcon,
    IonList,
    IonLabel,
    IonItem,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    PedidoComponent,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AltaPedidoPage implements OnInit {
  
  protected productos: Producto[] = [];
  protected pedido: Producto[] = [];
  protected cant!: number;

  constructor(
    private auth: AuthService,
    private db: DatabaseService,
    private spinner: NgxSpinnerService,
    private frmBuilder: FormBuilder
  ) {
    this.spinner.show();
    this.db.traerColeccion<Producto>(Colecciones.Productos).then((prods) => {
      this.productos = prods;
      this.spinner.hide();
    });

    addIcons({ receiptOutline, addOutline, removeOutline });
  }

  ngOnInit() {
  }

  async addProducto(prod: Producto, cant: number) {
    console.log(cant);
    if(cant > 0){
      this.pedido.push(prod);
    }else{
      ToastError.fire("Cantidad inválida!")
    }
    
  }

  async carrito() {
    await MySwal.fire({
      template: '#my-template',
    }).then(async (res) => {});
  }

  sumarProd(){
    this.cant++;
  }
  restarProd(){
    if(this.cant > 0){
      this.cant--;
    }
  }
  // setCant(numero: Event){
  //   console.log(numero.target['value']);
  // }
  onChange(){
    console.log("A");
  }
}
