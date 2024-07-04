import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonIcon, IonCardContent, IonCardHeader, IonButton, IonLabel, IonList, IonItem, IonCardTitle } from '@ionic/angular/standalone';
import { EstadoPedido, Pedido } from 'src/app/utils/classes/pedido';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { Cliente } from 'src/app/utils/classes/usuarios/cliente';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, receiptOutline, removeCircleOutline } from 'ionicons/icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { delay } from 'src/main';
import { EstadoMesa, Mesa } from 'src/app/utils/classes/mesa';
import { ModalController } from '@ionic/angular/standalone';
import { PedidoComponent } from 'src/app/components/pedido/pedido.component';
import { PedidoProd } from 'src/app/utils/classes/pedido';
import { Producto } from 'src/app/utils/classes/producto';
import { ToastSuccess } from 'src/app/utils/alerts';
import { AuthService } from 'src/app/services/auth.service';
import { Empleado } from 'src/app/utils/classes/usuarios/empleado';
import { ErrorCodes, Exception } from 'src/app/utils/classes/exception';

@Component({
  selector: 'app-lista-pedidos-pendiente',
  templateUrl: './lista-pedidos-pendiente.page.html',
  styleUrls: ['./lista-pedidos-pendiente.page.scss'],
  standalone: true,
  imports: [IonCardTitle, IonItem, IonList, IonLabel, IonButton, IonCardHeader, IonCardContent, IonIcon, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
  providers: [ModalController]
})
export class ListaPedidosPendientePage implements OnInit {
  /* 
    protected pedidos: Pedido[] = [
      {
        "confirmaciones": {
          "cocina": false,
          "barra": false,
        },
        "pedidoProd": [
          {
            "sector": "barra",
            "nombre": "Agua con Gas",
            "tiempoEstimado": 5,
            "cantidad": 2
          },
          {
            "cantidad": 2,
            "tiempoEstimado": 10,
            "nombre": "Ensalada César",
            "sector": "cocina"
          }
        ],
        "id": "2Ue0d4IYMgE9ukxoqMy7",
        "tiempoEstimado": 10,
        "estado": "pendiente",
        "precio": 6044.5,
        "idCliente": "iFHMlgOm9QkCpJOpb651"
      },
      {
        "confirmaciones": {
          "cocina": false,
          "barra": false,
        },
        "pedidoProd": [
          {
            "sector": "barra",
            "nombre": "Agua con Gas",
            "tiempoEstimado": 5,
            "cantidad": 2
          },
          {
            "cantidad": 2,
            "tiempoEstimado": 10,
            "nombre": "Ensalada César",
            "sector": "cocina"
          }
        ],
        "id": "2Ue0d4IYMgE9ukxoqMy7",
        "tiempoEstimado": 10,
        "estado": "listo",
        "precio": 6044.5,
        "idCliente": "iFHMlgOm9QkCpJOpb651"
      },
      {
        "confirmaciones": {
          "cocina": false,
          "barra": false,
        },
        "pedidoProd": [
          {
            "sector": "barra",
            "nombre": "Agua con Gas",
            "tiempoEstimado": 5,
            "cantidad": 2
          },
          {
            "cantidad": 2,
            "tiempoEstimado": 10,
            "nombre": "Ensalada César",
            "sector": "cocina"
          }
        ],
        "id": "2Ue0d4IYMgE9ukxoqMy7",
        "tiempoEstimado": 10,
        "estado": "pendiente",
        "precio": 6044.5,
        "idCliente": "iFHMlgOm9QkCpJOpb651"
      },
    ];
    protected mesas: Mesa[] = [
      {
        "codigoQr": [
          "mesa-6JSkAmkz3oFcA1UYh045"
        ],
        "tipo": "VIP",
        "id": "6JSkAmkz3oFcA1UYh045",
        "nroMesa": 3,
        "estado": 3,
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/mesas%2Fmesa-3?alt=media&token=11584005-85ef-4dfc-927e-3985f813eb12",
        "cantComensales": 6
      },
      {
        "id": "DLDy65F46o10UeAQVcyG",
        "codigoQr": [
          "mesa-DLDy65F46o10UeAQVcyG"
        ],
        "cantComensales": 4,
        "tipo": "estandar",
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/mesas%2Fmesa-1?alt=media&token=0869af3f-ea01-4155-9220-274520ab6209",
        "nroMesa": 1,
        "estado": 0
      },
      {
        "id": "KyVbah5riER9KbhFpeF0",
        "nroMesa": 2,
        "cantComensales": 4,
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/mesas%2Fmesa-2?alt=media&token=e98ec7a0-ea47-4241-99b6-8aada6792005",
        "estado": 4,
        "tipo": "estandar",
        "codigoQr": [
          "mesa-KyVbah5riER9KbhFpeF0"
        ]
      }
    ];
    protected productos: Producto[] = [
      {
        "sector": "cocina",
        "id": "5UfZO7OOyvg59sBEYWhu",
        "nombre": "Hamburguesa Clásica",
        "fotosUrl": [
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FHamburguesa%20Cl%C3%A1sica-foto-1?alt=media&token=7041f329-78c7-47f4-bd5c-fdf8b0309672",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FHamburguesa%20Cl%C3%A1sica-foto-2?alt=media&token=e48e5cd8-6bee-4043-b30d-0590d723a739",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FHamburguesa%20Cl%C3%A1sica-foto-3?alt=media&token=baeff1d0-1113-4cbe-9ccf-ebc6209266dc"
        ],
        "descripcion": "Carne de res, lechuga, tomate, cebolla, queso cheddar y salsa especial",
        "precio": 3437.5,
        "tiempoElab": 15
      },
      {
        "sector": "cocina",
        "tiempoElab": 20,
        "precio": 1650,
        "nombre": "Pastel de Chocolate",
        "descripcion": "Pastel de chocolate oscuro con glaseado de chocolate",
        "fotosUrl": [
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FPastel%20de%20Chocolate-foto-1?alt=media&token=cf62a84a-5fcc-4052-8a70-c38eaade673a",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FPastel%20de%20Chocolate-foto-2?alt=media&token=98afd067-dc43-4954-bde4-347ee8022939",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FPastel%20de%20Chocolate-foto-3?alt=media&token=4d0aed07-9a4b-4d66-a710-632039c91f18"
        ],
        "id": "9rPeIJOSX3EYFHqZyiqd"
      },
      {
        "tiempoElab": 20,
        "nombre": "Panna Cotta de Vainilla",
        "descripcion": "Panna cotta suave con esencia de vainilla y frutas frescas",
        "fotosUrl": [
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FPanna%20Cotta%20de%20Vainilla-foto-1?alt=media&token=2b624c9e-8b18-4e9b-9bc4-2fe3dcdba87d",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FPanna%20Cotta%20de%20Vainilla-foto-2?alt=media&token=2fb8d479-4a6c-44be-9671-012cd5031024",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FPanna%20Cotta%20de%20Vainilla-foto-3?alt=media&token=d7e20c2d-3672-4595-b5d1-54db426f121f"
        ],
        "precio": 1581.25,
        "sector": "cocina",
        "id": "E2HETxpWMntmUERPlxAz"
      },
      {
        "tiempoElab": 5,
        "id": "Kg5esbYIw1Qcce9j0HyU",
        "precio": 687.5,
        "descripcion": "Café negro recién hecho, perfecto para cualquier momento del día",
        "nombre": "Café Americano",
        "fotosUrl": [
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FCaf%C3%A9%20Americano-foto-1?alt=media&token=25cb332e-d7be-4eb6-9465-fa35cba95d03",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FCaf%C3%A9%20Americano-foto-2?alt=media&token=6a8bd089-5e10-42f1-b235-3a5664d4a7fb",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FCaf%C3%A9%20Americano-foto-3?alt=media&token=96fe39dc-e3fa-4557-9e1f-464fb399636c"
        ],
        "sector": "barra"
      },
      {
        "id": "PqDFaXDUj5Zub4IX0qj6",
        "nombre": "Agua con Gas",
        "sector": "barra",
        "fotosUrl": [
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FAgua%20con%20Gas-foto-1?alt=media&token=17e59dea-d1b3-4e85-9446-bcc90e3b55ba",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FAgua%20con%20Gas-foto-2?alt=media&token=7b85294d-1840-445a-a6cf-172e04f75532",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FAgua%20con%20Gas-foto-3?alt=media&token=2baf3e4c-cfb2-450e-a953-a1bccb835ba7"
        ],
        "tiempoElab": 5,
        "precio": 550,
        "descripcion": "Agua con gas embotellada, ideal para acompañar tus comidas"
      },
      {
        "tiempoElab": 5,
        "sector": "barra",
        "id": "RL0zU61fs4r5bNkYKjQC",
        "nombre": "Gaseosa Cola",
        "precio": 687.5,
        "descripcion": "Refresco de cola con gas, servido bien frío",
        "fotosUrl": [
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FGaseosa%20Cola-foto-1?alt=media&token=7153e1d7-9e5b-4dec-980e-da310b2e2c9c",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FGaseosa%20Cola-foto-2?alt=media&token=831325e7-825e-445d-bede-15b1eb947c2f",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FGaseosa%20Cola-foto-3?alt=media&token=807dd6bd-6ca3-46c8-9834-86dd94a9d4ca"
        ]
      },
      {
        "tiempoElab": 5,
        "nombre": "Agua Mineral",
        "descripcion": "Agua mineral embotellada, refrescante y pura",
        "precio": 412.5,
        "fotosUrl": [
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FAgua%20Mineral-foto-1?alt=media&token=596e44cd-26f7-4148-8166-81eaf06980f8",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FAgua%20Mineral-foto-2?alt=media&token=6cdb2a5b-45e8-452f-bd75-186b6256e5d6",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FAgua%20Mineral-foto-3?alt=media&token=3a6f955f-f5c8-44d4-b081-6cdfbff9a960"
        ],
        "id": "hYLQOG5oqCGRdMeaZ9Vj",
        "sector": "barra"
      },
      {
        "sector": "cocina",
        "precio": 2472.25,
        "id": "jCAUCPCiYIle4rBfmSlw",
        "tiempoElab": 10,
        "fotosUrl": [
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FEnsalada%20C%C3%A9sar-foto-1?alt=media&token=919d6ca2-7fc1-41fc-824a-134dc946a0c6",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FEnsalada%20C%C3%A9sar-foto-2?alt=media&token=5421dadb-dd0d-4800-b9ac-3ab7eb447972",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FEnsalada%20C%C3%A9sar-foto-3?alt=media&token=f1248ebc-9c37-49b4-97f5-e165a0639ed0"
        ],
        "nombre": "Ensalada César",
        "descripcion": "Lechuga romana con crutones, parmesano y aderezo César"
      },
      {
        "precio": 1100,
        "tiempoElab": 10,
        "descripcion": "Helado de vainilla artesanal con trocitos de vainilla",
        "id": "tB0jxi4OuCC4t8L57lKo",
        "fotosUrl": [
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FHelado%20de%20Vainilla-foto-1?alt=media&token=001db075-fdac-48dc-88e1-ee56fc7b491e",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FHelado%20de%20Vainilla-foto-2?alt=media&token=b4497aae-7f7f-4063-8f96-0160722ec7a5",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FHelado%20de%20Vainilla-foto-3?alt=media&token=5ab35aed-0c88-428a-a14a-e5a1e7f40d91"
        ],
        "nombre": "Helado de Vainilla",
        "sector": "cocina"
      },
      {
        "fotosUrl": [
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FSpaghetti%20Bolognese-foto-1?alt=media&token=af212fcf-d2ee-4916-8c4c-d9f67d04ace4",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FSpaghetti%20Bolognese-foto-2?alt=media&token=d963eb92-7719-48b5-87c6-7e2507f87360",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FSpaghetti%20Bolognese-foto-3?alt=media&token=42e0322a-45e7-43ad-ad79-559dbc27416c"
        ],
        "sector": "cocina",
        "id": "yBf1kmmSgBY4P12mxYhA",
        "nombre": "Spaghetti Bolognese",
        "tiempoElab": 15,
        "descripcion": "Pasta spaghetti con salsa bolognesa casera",
        "precio": 3025
      },
      {
        "precio": 3850,
        "tiempoElab": 20,
        "descripcion": "Base de tomate, mozzarella fresca, albahaca y aceite de oliva",
        "id": "z3cqNjUXTFc9arvFt1tr",
        "fotosUrl": [
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FPizza%20Margarita-foto-1?alt=media&token=c01ec5e6-6306-4e72-b489-787e1aaa5df9",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FPizza%20Margarita-foto-2?alt=media&token=99395f84-29a3-4cd9-bc6c-9bf895d89cca",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FPizza%20Margarita-foto-3?alt=media&token=b7f4aeae-ccd1-4256-80fa-e3bd8b606570"
        ],
        "sector": "cocina",
        "nombre": "Pizza Margarita"
      },
      {
        "id": "zQMhtGWenp7cr9fiqtax",
        "precio": 1512.5,
        "tiempoElab": 15,
        "fotosUrl": [
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FBrownie%20con%20Helado-foto-1?alt=media&token=8af0e80a-992b-4f0a-a029-c6ae3d91fa58",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FBrownie%20con%20Helado-foto-2?alt=media&token=3f8b8fa1-283b-4992-831d-1989df44a59a",
          "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/productos%2FBrownie%20con%20Helado-foto-3?alt=media&token=c3231e43-f3cd-4dbf-a491-e580cbdd2b81"
        ],
        "descripcion": "Brownie de chocolate con una bola de helado de vainilla",
        "sector": "cocina",
        "nombre": "Brownie con Helado"
      }
    ];
    protected clientes: Cliente[] = [
      {
        "tipo": "registrado",
        "rol": "cliente",
        "estadoCliente": "aceptado",
        "idMesa": null,
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/users%2Fcliente-43628819?alt=media&token=390171c1-43f9-4224-98b6-3765cc5042d4",
        "correo": "jacoluna01@gmail.com",
        "nombre": "Jaco",
        "dni": 43628819,
        "apellido": "Luna",
        "id": "CNaDUWpOrgXKexsRLjPF"
      },
      {
        "nombre": "Artu",
        "estadoCliente": "no necesita",
        "tipo": "anonimo",
        "dni": 0,
        "id": "S4O8fynqF0FC7r8Y5awk",
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/users%2Fcliente-anon-Artu?alt=media&token=2f2f8d4b-1766-4411-b61c-f17e5fecd2b3",
        "correo": "",
        "rol": "cliente",
        "idMesa": "6JSkAmkz3oFcA1UYh045",
        "apellido": ""
      },
      {
        "rol": "cliente",
        "nombre": "Jaco",
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/users%2Fcliente-43628818?alt=media&token=cd593061-61c9-42f1-9084-e34833c26e1b",
        "apellido": "Luna",
        "id": "TGTP3dWwktYeE9moCstH",
        "estadoCliente": "aceptado",
        "idMesa": "KyVbah5riER9KbhFpeF0",
        "tipo": "registrado",
        "correo": "jacoluna02@gmail.com",
        "dni": 43628818
      },
      {
        "estadoCliente": "pendiente",
        "correo": "",
        "nombre": "test",
        "apellido": "",
        "dni": 0,
        "rol": "cliente",
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/users%2Fcliente-anon-test?alt=media&token=505841d1-547e-4d8a-ac2a-f1c4789f9f11",
        "tipo": "anonimo",
        "idMesa": null,
        "id": "UT4Q6548RHDTaA5tDSHG"
      },
      {
        "dni": 44816742,
        "nombre": "Marcos",
        "correo": "marcoslaporte2015@gmail.com",
        "apellido": "Laporte",
        "idMesa": null,
        "tipo": "registrado",
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/users%2Fcliente-44816742?alt=media&token=693ebbdf-a6fe-4712-a7b8-50a12d874f23",
        "rol": "cliente",
        "estadoCliente": "aceptado",
        "id": "i9X1UBv5P34s0xPxkg1T"
      },
      {
        "estadoCliente": "aceptado",
        "id": "iFHMlgOm9QkCpJOpb651",
        "tipo": "registrado",
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/users%2Fcliente-34549760?alt=media&token=19047d5b-8dad-4a42-9067-7900d79893db",
        "nombre": "Cliente",
        "dni": 34549760,
        "apellido": "Registrado",
        "correo": "registrado@cliente.com",
        "idMesa": "DLDy65F46o10UeAQVcyG",
        "rol": "cliente"
      },
      {
        "tipo": "registrado",
        "rol": "cliente",
        "id": "lQ5o37oI388IaXdLbwfs",
        "apellido": "Sanchez",
        "correo": "roberto@gmail.com",
        "nombre": "Roberto",
        "idMesa": null,
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/users%2Fcliente-78945610?alt=media&token=f6be38e0-625c-4290-ab65-069eb427c39f",
        "dni": 78945610,
        "estadoCliente": "pendiente"
      },
      {
        "idMesa": null,
        "estadoCliente": "rechazado",
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/users%2Fcliente-44600354?alt=media&token=f13e18ea-0ea8-4213-b2ab-6a2f93879c0b",
        "rol": "cliente",
        "id": "s7qnN7pAtC7rhs55kWc7",
        "apellido": "santos",
        "correo": "romoesantos@gmail.com",
        "tipo": "registrado",
        "nombre": "romeo",
        "dni": 44600354
      }
    ];
   */ //FIXME: TEST
  protected pedidos: Pedido[] = [];
  protected mesas: Mesa[] = [];
  protected clientes: Cliente[] = [];
  protected productos: Producto[] = [];
  protected empleado!: Empleado;

  constructor(private db: DatabaseService, private spinner: NgxSpinnerService,
    private modalCtrl: ModalController, private auth: AuthService) {
    this.empleado = <Empleado>this.auth.UsuarioEnSesion;
    console.log(this.empleado);

    addIcons({ checkmarkCircleOutline, removeCircleOutline, receiptOutline });
  }

  async ngOnInit() {
    this.spinner.show();

    [this.productos, this.mesas, this.clientes] = await Promise.all([
      this.db.traerColeccion<Producto>(Colecciones.Productos),
      this.db.traerColeccion<Mesa>(Colecciones.Mesas),
      this.db.traerCoincidencias<Cliente>(Colecciones.Usuarios, { campo: 'rol', operacion: '==', valor: 'cliente' })
    ]);

    this.db.escucharColeccion<Pedido>(
      Colecciones.Pedidos,
      this.pedidos,
      (item) => {
        if (this.empleado.tipo === 'mozo')
          return item.estado === 'pendiente' || item.estado === 'listo';
        else {
          const sector = this.empleado.tipo === 'cocinero' ? 'cocina' : 'barra';
          return item.estado === 'en proceso' && !item.confirmaciones[sector];
        }
      }
    );

    this.spinner.hide();
  }

  async manejarEstadoPedido(pedido: Pedido) {
    this.spinner.show();
    let nuevoEstado: EstadoPedido;
    let nuevaConfirm: {
      cocina: boolean,
      barra: boolean
    } = pedido.confirmaciones;
    let msj: string;

    if (this.empleado.tipo === 'mozo') {
      [nuevoEstado, msj] = pedido.estado === 'pendiente' ?
        ['en proceso', 'Pedido en preparación.'] : ['entregado', 'Pedido listo!'];
    } else {
      const sector = this.empleado.tipo === 'cocinero' ? 'cocina' : 'barra';
      nuevaConfirm[sector] = true;
      nuevoEstado = 'en proceso';
      msj = `Pedido en ${sector} listo!`;
      if (pedido.confirmaciones.cocina && pedido.confirmaciones.barra) {
        nuevoEstado = 'listo';
        msj = 'Pedido listo para entrega!';
      }
    }

    await this.db.actualizarDoc(Colecciones.Pedidos, pedido.id, { confirmaciones: nuevaConfirm, estado: nuevoEstado });

    this.spinner.hide();
    ToastSuccess.fire(msj);
  }

  readonly accionPedido = (pedido: Pedido) => {
    if (this.empleado.tipo === 'mozo') {
      if (pedido.estado === 'pendiente')
        return 'Enviar pedido a preparar';
      else if (pedido.estado === 'listo')
        return 'Llevar pedido a la mesa';

      return;
    } else {
      return 'Pedido listo?';
    }
  }

  async mostrarPedido(pedido: Pedido) {
    let productosCant: PedidoProd[] = [];

    pedido.pedidoProd.forEach(pedidoProd => {
      this.productos.forEach(prod => {
        if (prod.nombre === pedidoProd.nombre) {
          if ((this.empleado.tipo === 'bartender' && prod.sector !== 'barra') ||
            (this.empleado.tipo === 'cocinero' && prod.sector !== 'cocina'))
            return;

          let prodPed: PedidoProd = {
            producto: prod,
            cantidad: pedidoProd.cantidad
          }
          productosCant.push(prodPed);
        }
      })
    });

    const modal = await this.modalCtrl.create({
      component: PedidoComponent,
      id: 'pedido-modal',
      componentProps: { pedido: productosCant },
    });
    await modal.present();
  }
}
