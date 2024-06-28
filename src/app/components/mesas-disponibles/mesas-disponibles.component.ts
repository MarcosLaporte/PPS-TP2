import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { EstadoMesa, Mesa } from 'src/app/utils/classes/mesa';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonRadio, IonRadioGroup, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular';
import { MySwal } from 'src/app/utils/alerts';
import { Cliente } from 'src/app/utils/classes/usuarios/cliente';
@Component({
  selector: 'app-mesas-disponibles',
  templateUrl: './mesas-disponibles.component.html',
  styleUrls: ['./mesas-disponibles.component.scss'],
  standalone: true,
  imports: [IonButton, IonCardContent, IonRadioGroup, IonRadio, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule],
})
export class MesasDisponiblesComponent implements OnInit {
  mesas: Mesa[] = [];
  @Input({ required: true }) cliente!: Cliente;
  constructor(private db: DatabaseService, private spinner: NgxSpinnerService, protected navCtrl: NavController) { }

  async ngOnInit() {
    this.spinner.show();
    if (!this.cliente) throw new Error('Campo `cliente` no existe.');
    this.mesas = (await this.db.traerColeccion<Mesa>(Colecciones.Mesas)).filter((mesa) => mesa.estado === EstadoMesa.Disponible);
    this.spinner.hide();
  }

  selecMesa(mesa: Mesa) {
    MySwal.fire({
      title: `¿Confirmar mesa nro${mesa.nroMesa} para ${this.cliente.nombre}?`,
      imageUrl: mesa.fotoUrl,
      showConfirmButton: true,
      confirmButtonText: 'Confirmar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((res) => {
      if (res.isConfirmed) {
        this.db.actualizarDoc(Colecciones.Mesas, mesa.id, { estado: EstadoMesa.Asignada });
        this.db.actualizarDoc(Colecciones.Usuarios, this.cliente.id, { idMesa: mesa.id });
        this.navCtrl.navigateRoot('lista-espera');
      }
    });
  }

}
