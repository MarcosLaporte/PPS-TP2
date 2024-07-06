import { Component, Input, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonRadio, IonRadioGroup, IonCardContent, IonButton, IonText, IonChip } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RangeEstrellasComponent } from '../range-estrellas/range-estrellas.component';
import { EncuestaCliente } from 'src/app/utils/classes/encuestas/encuesta-cliente';
import { Cliente } from 'src/app/utils/classes/usuarios/cliente';

@Component({
  selector: 'app-encuesta-cliente',
  templateUrl: './encuesta-cliente.component.html',
  styleUrls: ['./encuesta-cliente.component.scss'],
  standalone: true,
  imports: [IonChip, IonText, IonButton, IonCardContent, IonRadioGroup, IonRadio, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, RangeEstrellasComponent],
})
export class EncuestaClienteComponent implements OnInit {
  @Input() encuesta!: EncuestaCliente;
  protected cliente!: Cliente;
  constructor() { }

  ngOnInit() {
    if (!this.encuesta) throw new Error('Campo `encuesta` no existe.');
    this.cliente = <Cliente>this.encuesta.autor;
  }
}
