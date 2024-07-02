import { Component, Input, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonRadio, IonRadioGroup, IonCardContent, IonButton, IonText, IonChip } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { EncuestaEmpleado } from 'src/app/utils/classes/encuestas/encuesta-empleado';
import { Empleado } from 'src/app/utils/classes/usuarios/empleado';
import { RangeEstrellasComponent } from '../range-estrellas/range-estrellas.component';

@Component({
  selector: 'app-encuesta-empleado',
  templateUrl: './encuesta-empleado.component.html',
  styleUrls: ['./encuesta-empleado.component.scss'],
  standalone: true,
  imports: [IonChip, IonText, IonButton, IonCardContent, IonRadioGroup, IonRadio, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, RangeEstrellasComponent],
})
export class EncuestaEmpleadoComponent implements OnInit {
  @Input() encuesta!: EncuestaEmpleado;
  protected empleado!: Empleado;
  constructor() { }

  ngOnInit() {
    if (!this.encuesta) throw new Error('Campo `encuesta` no existe.');
    this.empleado = <Empleado>this.encuesta.autor;
  }
}
