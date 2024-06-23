import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardTitle, IonCardHeader, IonCardContent, IonItem, IonLabel, IonList, IonIcon, IonAccordion, IonAccordionGroup } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Producto } from 'src/app/utils/classes/producto';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { addIcons } from 'ionicons';
import {  addOutline, receiptOutline } from 'ionicons/icons';
import { NgxSpinnerService } from 'ngx-spinner';
import Swiper from 'swiper';

@Component({
  selector: 'app-alta-pedido',
  templateUrl: './alta-pedido.page.html',
  styleUrls: ['./alta-pedido.page.scss'],
  standalone: true,
  imports: [IonAccordionGroup, IonAccordion, IonIcon, IonList, IonLabel, IonItem, IonCardContent, IonCardHeader, IonCardTitle, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class AltaPedidoPage implements OnInit {

  @ViewChild('swiper') private mySwiper!: Swiper;

  protected productos: Producto[] = [];

  constructor(private auth: AuthService, private db: DatabaseService, private spinner: NgxSpinnerService,) {
    this.spinner.show();
    this.db.traerColeccion<Producto>(Colecciones.Productos).then( prods => {
      this.productos = prods;
      
      this.spinner.hide();
    });

    console.log(this.mySwiper);

    // const swiper = new Swiper('.swiper', {
    //   autoHeight: true
    // });


    addIcons( {receiptOutline, addOutline} );
  }
  ngOnInit() {
  }

}
