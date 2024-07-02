import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MesasDisponiblesComponent } from './mesas-disponibles.component';

describe('MesasDisponiblesComponent', () => {
  let component: MesasDisponiblesComponent;
  let fixture: ComponentFixture<MesasDisponiblesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MesasDisponiblesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MesasDisponiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
