import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonLabel } from "@ionic/angular/standalone";

@Component({
  selector: 'app-range-estrellas',
  templateUrl: './range-estrellas.component.html',
  styleUrls: ['./range-estrellas.component.scss'],
  standalone: true,
  imports: [IonLabel]
})
export class RangeEstrellasComponent {
  @Input() titulo: string = 'Puntuación 0-5';
  @Output() cambioValor = new EventEmitter<number>();


  emit($ev: any) {
    this.cambioValor.emit($ev.target.value);
  }
}
