import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonItem, IonRadio, IonButton } from '@ionic/angular/standalone';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { EncuestaCliente } from 'src/app/utils/classes/EncuestaCliente';
import { Chart  } from 'chart.js/auto';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastError } from 'src/app/utils/alerts';

@Component({
  selector: 'app-grafico-clientes',
  templateUrl: './grafico-clientes.page.html',
  styleUrls: ['./grafico-clientes.page.scss'],
  standalone: true,
  imports: [IonButton, IonRadio, IonItem, IonLabel, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class GraficoClientesPage implements AfterViewInit {

  @ViewChild('pipeChart', { static: false }) pipeChartElement!: ElementRef;
  pipeChart: any;

  mostrarGrafico: string = '';
  encuestas!: EncuestaCliente[];

  constructor(private db: DatabaseService,private spinner: NgxSpinnerService,
  ) { }

  ngAfterViewInit(): void {
    this.traerEncuestas();
  }

  async traerEncuestas() {

    try {
     // this.spinner.show();
      this.encuestas = await this.db.traerColeccion<EncuestaCliente>(Colecciones.EncuestasCliente);
      this.generarGraficoTortaPuntuacion();
    } catch (error:any) {
      ToastError.fire('Ups...', error.message);

    }

  }

  generarGraficoTortaPuntuacion() {

    const puntuacion = this.encuestas.filter((p) => p.puntuacionGeneral);
    const colors = [
      '#ffc409',
      '#eb445a',
      '#3dc2ff',
      '#92949c',
      '#2fdf75',
      '#0044ff',
      '#ee55ff',
    ];
    const photoColors = puntuacion.map(
      (_, index) => colors[index % colors.length]
    );
    const ctx = this.pipeChartElement.nativeElement.getContext('2d');

    this.pipeChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: puntuacion.map((p) => 'Calificación: ' + p.puntuacionGeneral),
        datasets: [{
          label: 'puntuaciones',
          data: puntuacion.map((p) => p.puntuacionGeneral),
          backgroundColor: photoColors,
          borderColor: photoColors,
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: 20,
        },
        plugins: {
          tooltip: {
            usePointStyle: true,
            borderColor: '#ffffff',
            borderWidth: 3,
            boxHeight: 160,
            boxWidth: 160,
            cornerRadius: 20,
            displayColors: true,
            bodyAlign: 'center',
          },
          legend: {
            display: false,
          },
        },
      },
    });
  }

  mostrarGraficoYGenerar(grafico: string) {
    this.mostrarGrafico = grafico;
    if (grafico === 'graph1') {
      setTimeout(() => {
        this.generarGraficoTortaPuntuacion();
      }, 0);
    }
  }
}
