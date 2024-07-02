import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit, ViewChild, inject,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardTitle, IonCardHeader, IonCardContent, IonItem, IonLabel, IonList, IonIcon, IonAccordion, IonAccordionGroup, IonButton, IonPopover, IonFooter, IonCardSubtitle } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Producto } from 'src/app/utils/classes/producto';
import { Colecciones, DatabaseService,} from 'src/app/services/database.service';
import { addIcons } from 'ionicons';
import { addCircleOutline, chatboxEllipsesOutline, receiptOutline, removeCircleOutline } from 'ionicons/icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { MySwal, ToastError, ToastSuccess } from 'src/app/utils/alerts';
import { ModalController } from '@ionic/angular';
import { PedidoComponent } from 'src/app/components/pedido/pedido.component';
import { Cliente } from 'src/app/utils/classes/usuarios/cliente';
import { Mesa } from 'src/app/utils/classes/mesa';

@Component({
  selector: 'app-alta-pedido',
  templateUrl: './alta-pedido.page.html',
  styleUrls: ['./alta-pedido.page.scss'],
  standalone: true,
  imports: [IonCardSubtitle, IonFooter, IonPopover, IonButton,  IonAccordionGroup, IonAccordion, IonIcon, IonList, IonLabel, IonItem, IonCardContent, IonCardHeader, IonCardTitle, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, NgOptimizedImage],
  providers:[ModalController]
})
export class AltaPedidoPage implements OnInit {
  protected pedido: Producto[] = [];
  precio: number = 0;
  productosElegidos: { [id: string]: number } = {};
  cliente!: Cliente;
  mesa!:Mesa;
  // productos: Producto[] = [];
  readonly productos: Producto[] = [
    {
      "tiempoElab": 15,
      "nombre": "Hamburguesa Clásica",
      "descripcion": "Carne de res, lechuga, tomate, cebolla, queso cheddar y salsa especial",
      "precio": 3437.5,
      "fotosUrl": [
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FHamburguesa%20Cl%C3%A1sica-foto-1?alt=media&token=7041f329-78c7-47f4-bd5c-fdf8b0309672",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FHamburguesa%20Cl%C3%A1sica-foto-2?alt=media&token=e48e5cd8-6bee-4043-b30d-0590d723a739",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FHamburguesa%20Cl%C3%A1sica-foto-3?alt=media&token=baeff1d0-1113-4cbe-9ccf-ebc6209266dc"
      ],
      "id": "5UfZO7OOyvg59sBEYWhu"
    },
    {
      "descripcion": "Carne con pan rallado y papas fritas",
      "fotosUrl": [
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FMilanesa%20con%20papas%20fritas-foto-1?alt=media&token=688a4563-5b60-488a-b1a5-4ec260a8c3fd",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FMilanesa%20con%20papas%20fritas-foto-2?alt=media&token=ab3dc842-d822-4d58-ae6f-46880429282c",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FMilanesa%20con%20papas%20fritas-foto-3?alt=media&token=db955f2d-6db2-490b-bfb5-9b53d2830c48"
      ],
      "precio": 4000,
      "tiempoElab": 15,
      "id": "7Dfb6ohmbyOpU9EEFnZs",
      "nombre": "Milanesa con papas fritas"
    },
    {
      "precio": 962.5,
      "nombre": "Limonada Fresca",
      "id": "8BCh7R9eYsfSc3CzfqRF",
      "descripcion": "Limonada natural con un toque de menta fresca",
      "tiempoElab": 5,
      "fotosUrl": [
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FLimonada%20Fresca-foto-1?alt=media&token=d647db24-c554-49fd-b805-75f3d70dbf28",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FLimonada%20Fresca-foto-2?alt=media&token=b582c6ff-32d9-4063-a935-80b6c4e6ed0d",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FLimonada%20Fresca-foto-3?alt=media&token=32efcf90-5781-4e2b-959d-4667c8b50e0b"
      ]
    },
    {
      "descripcion": "Pastel de chocolate oscuro con glaseado de chocolate",
      "fotosUrl": [
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FPastel%20de%20Chocolate-foto-1?alt=media&token=cf62a84a-5fcc-4052-8a70-c38eaade673a",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FPastel%20de%20Chocolate-foto-2?alt=media&token=98afd067-dc43-4954-bde4-347ee8022939",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FPastel%20de%20Chocolate-foto-3?alt=media&token=4d0aed07-9a4b-4d66-a710-632039c91f18"
      ],
      "tiempoElab": 20,
      "precio": 1650,
      "id": "9rPeIJOSX3EYFHqZyiqd",
      "nombre": "Pastel de Chocolate"
    },
    {
      "fotosUrl": [
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FPanna%20Cotta%20de%20Vainilla-foto-1?alt=media&token=2b624c9e-8b18-4e9b-9bc4-2fe3dcdba87d",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FPanna%20Cotta%20de%20Vainilla-foto-2?alt=media&token=2fb8d479-4a6c-44be-9671-012cd5031024",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FPanna%20Cotta%20de%20Vainilla-foto-3?alt=media&token=d7e20c2d-3672-4595-b5d1-54db426f121f"
      ],
      "id": "E2HETxpWMntmUERPlxAz",
      "precio": 1581.25,
      "tiempoElab": 20,
      "descripcion": "Panna cotta suave con esencia de vainilla y frutas frescas",
      "nombre": "Panna Cotta de Vainilla"
    },
    {
      "fotosUrl": [
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FCaf%C3%A9%20Americano-foto-1?alt=media&token=25cb332e-d7be-4eb6-9465-fa35cba95d03",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FCaf%C3%A9%20Americano-foto-2?alt=media&token=6a8bd089-5e10-42f1-b235-3a5664d4a7fb",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FCaf%C3%A9%20Americano-foto-3?alt=media&token=96fe39dc-e3fa-4557-9e1f-464fb399636c"
      ],
      "nombre": "Café Americano",
      "precio": 687.5,
      "tiempoElab": 5,
      "id": "Kg5esbYIw1Qcce9j0HyU",
      "descripcion": "Café negro recién hecho, perfecto para cualquier momento del día"
    },
    {
      "fotosUrl": [
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FAgua%20con%20Gas-foto-1?alt=media&token=17e59dea-d1b3-4e85-9446-bcc90e3b55ba",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FAgua%20con%20Gas-foto-2?alt=media&token=7b85294d-1840-445a-a6cf-172e04f75532",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FAgua%20con%20Gas-foto-3?alt=media&token=2baf3e4c-cfb2-450e-a953-a1bccb835ba7"
      ],
      "id": "PqDFaXDUj5Zub4IX0qj6",
      "precio": 550,
      "tiempoElab": 5,
      "descripcion": "Agua con gas embotellada, ideal para acompañar tus comidas",
      "nombre": "Agua con Gas"
    },
    {
      "descripcion": "Refresco de cola con gas, servido bien frío",
      "precio": 687.5,
      "tiempoElab": 5,
      "nombre": "Gaseosa Cola",
      "fotosUrl": [
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FGaseosa%20Cola-foto-1?alt=media&token=7153e1d7-9e5b-4dec-980e-da310b2e2c9c",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FGaseosa%20Cola-foto-2?alt=media&token=831325e7-825e-445d-bede-15b1eb947c2f",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FGaseosa%20Cola-foto-3?alt=media&token=807dd6bd-6ca3-46c8-9834-86dd94a9d4ca"
      ],
      "id": "RL0zU61fs4r5bNkYKjQC"
    },
    {
      "id": "TTm4aHov53Kjjiq4IoiM",
      "descripcion": "algo",
      "precio": 1,
      "nombre": "algo",
      "tiempoElab": 1,
      "fotosUrl": [
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2Falgo-foto-1?alt=media&token=64dd8358-5350-4f0b-96a2-5ee6cb63afd7",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2Falgo-foto-2?alt=media&token=b04ecf8e-8ea1-4a48-a455-4ee4a3c74e9a",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2Falgo-foto-3?alt=media&token=8f3661a5-c8d9-47ec-bdca-67744ee48c73"
      ]
    },
    {
      "fotosUrl": [
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FAgua%20Mineral-foto-1?alt=media&token=596e44cd-26f7-4148-8166-81eaf06980f8",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FAgua%20Mineral-foto-2?alt=media&token=6cdb2a5b-45e8-452f-bd75-186b6256e5d6",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FAgua%20Mineral-foto-3?alt=media&token=3a6f955f-f5c8-44d4-b081-6cdfbff9a960"
      ],
      "descripcion": "Agua mineral embotellada, refrescante y pura",
      "nombre": "Agua Mineral",
      "tiempoElab": 5,
      "id": "hYLQOG5oqCGRdMeaZ9Vj",
      "precio": 412.5
    },
    {
      "descripcion": "algo2",
      "nombre": "algo2",
      "fotosUrl": [
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2Falgo2-foto-1?alt=media&token=aebed393-db8d-41ac-8222-1decf84f5dce",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2Falgo2-foto-3?alt=media&token=5994b3fb-a18f-4858-87e5-1c22584c81b2",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2Falgo2-foto-4?alt=media&token=59ad0157-b433-40d3-ba96-4c46169341d8"
      ],
      "tiempoElab": 1,
      "precio": 1,
      "id": "hy3zZyZbPtIA4TqzQnt1"
    },
    {
      "id": "jCAUCPCiYIle4rBfmSlw",
      "precio": 2472.25,
      "fotosUrl": [
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FEnsalada%20C%C3%A9sar-foto-1?alt=media&token=919d6ca2-7fc1-41fc-824a-134dc946a0c6",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FEnsalada%20C%C3%A9sar-foto-2?alt=media&token=5421dadb-dd0d-4800-b9ac-3ab7eb447972",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FEnsalada%20C%C3%A9sar-foto-3?alt=media&token=f1248ebc-9c37-49b4-97f5-e165a0639ed0"
      ],
      "descripcion": "Lechuga romana con crutones, parmesano y aderezo César",
      "tiempoElab": 10,
      "nombre": "Ensalada César"
    },
    {
      "tiempoElab": 10,
      "descripcion": "Helado de vainilla artesanal con trocitos de vainilla",
      "nombre": "Helado de Vainilla",
      "id": "tB0jxi4OuCC4t8L57lKo",
      "fotosUrl": [
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FHelado%20de%20Vainilla-foto-1?alt=media&token=001db075-fdac-48dc-88e1-ee56fc7b491e",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FHelado%20de%20Vainilla-foto-2?alt=media&token=b4497aae-7f7f-4063-8f96-0160722ec7a5",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FHelado%20de%20Vainilla-foto-3?alt=media&token=5ab35aed-0c88-428a-a14a-e5a1e7f40d91"
      ],
      "precio": 1100
    },
    {
      "descripcion": "Pasta spaghetti con salsa bolognesa casera",
      "precio": 3025,
      "nombre": "Spaghetti Bolognese",
      "fotosUrl": [
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FSpaghetti%20Bolognese-foto-1?alt=media&token=af212fcf-d2ee-4916-8c4c-d9f67d04ace4",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FSpaghetti%20Bolognese-foto-2?alt=media&token=d963eb92-7719-48b5-87c6-7e2507f87360",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FSpaghetti%20Bolognese-foto-3?alt=media&token=42e0322a-45e7-43ad-ad79-559dbc27416c"
      ],
      "tiempoElab": 15,
      "id": "yBf1kmmSgBY4P12mxYhA"
    },
    {
      "descripcion": "Base de tomate, mozzarella fresca, albahaca y aceite de oliva",
      "id": "z3cqNjUXTFc9arvFt1tr",
      "fotosUrl": [
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FPizza%20Margarita-foto-1?alt=media&token=c01ec5e6-6306-4e72-b489-787e1aaa5df9",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FPizza%20Margarita-foto-2?alt=media&token=99395f84-29a3-4cd9-bc6c-9bf895d89cca",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FPizza%20Margarita-foto-3?alt=media&token=b7f4aeae-ccd1-4256-80fa-e3bd8b606570"
      ],
      "tiempoElab": 20,
      "nombre": "Pizza Margarita",
      "precio": 3850
    },
    {
      "id": "zQMhtGWenp7cr9fiqtax",
      "precio": 1512.5,
      "tiempoElab": 15,
      "descripcion": "Brownie de chocolate con una bola de helado de vainilla",
      "fotosUrl": [
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FBrownie%20con%20Helado-foto-1?alt=media&token=8af0e80a-992b-4f0a-a029-c6ae3d91fa58",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FBrownie%20con%20Helado-foto-2?alt=media&token=3f8b8fa1-283b-4992-831d-1989df44a59a",
        "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FBrownie%20con%20Helado-foto-3?alt=media&token=c3231e43-f3cd-4dbf-a491-e580cbdd2b81"
      ],
      "nombre": "Brownie con Helado"
    }
  ];
  
  constructor(
    private auth: AuthService,
    private db: DatabaseService,
    private spinner: NgxSpinnerService,
    private frmBuilder: FormBuilder,
    private modalCtrl: ModalController
  ) {
    // this.spinner.show();
    
    // this.db.traerColeccion<Producto>(Colecciones.Productos).then((prods) => {
    //   this.productos = prods;
    //   this.spinner.hide();
    // });
    if(this.auth.UsuarioEnSesion?.rol == 'cliente'){
      this.cliente = this.auth.UsuarioEnSesion as Cliente;
      db.traerDoc<Mesa>(Colecciones.Mesas, this.cliente.idMesa!).then( mesa => {
        this.mesa = mesa;
      });
    }
    addIcons({ receiptOutline, addCircleOutline, removeCircleOutline, chatboxEllipsesOutline });
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
  
  manejarProdCant(prod: Producto, inputEv: CustomEvent) {
    const cant: number = Number(inputEv.detail.value ?? '');
    if (cant === 0)
      delete this.productosElegidos[prod.id];
    else
      this.productosElegidos[prod.id] = cant;
  }
  restarProd(idProd: string) {
    if(this.productosElegidos[idProd]) 
      this.precio -= this.precio > 0 ? this.productos.filter( e => { return e.id == idProd })[0].precio:0; 
    
    if (this.productosElegidos[idProd] > 1)
      this.productosElegidos[idProd]--;
    else
      delete this.productosElegidos[idProd];
    
  }

  sumarProd(idProd: string) {
    this.productosElegidos[idProd] = (this.productosElegidos[idProd] || 0) + 1;
    if(this.productosElegidos[idProd]) 
      this.precio += this.productos.filter( e => { return e.id == idProd })[0].precio; 
  }
  async mostrarProd() {
    const modal = await this.modalCtrl.create({
      component: PedidoComponent,
      id: 'pedido-modal',
      componentProps: { productos: this.productos, prodCant: this.productosElegidos, mesa: this.mesa},
    });
    modal.present();
  }

  consultar(){}
}