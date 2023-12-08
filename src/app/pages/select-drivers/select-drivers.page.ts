import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApisService } from 'src/app/services/apis.service';

@Component({
  selector: 'app-select-drivers',
  templateUrl: './select-drivers.page.html',
  styleUrls: ['./select-drivers.page.scss'],
})
export class SelectDriversPage implements OnInit {
  drivers: any = [];
  selectedDriver: any = '';
  constructor(
    private api: ApisService,
    private modalController: ModalController
  ) {
    this.getDrivers();
    if (this.drivers.length && this.drivers.length > 0) {
      this.selectedDriver = this.drivers[0].id;
    }
  }

  ngOnInit() {}

  getDrivers() {
    this.api.getDrivers().then(
      data => {
        console.log('Drivers fetched from DB: ', data);
        this.drivers = data;
    });
    console.log('Drivers', this.drivers);
  }

  select() {
    console.log(this.selectedDriver);
    if(this.selectedDriver!='') {
      let driver = this.drivers.filter(x => x.id === this.selectedDriver);
      console.log(driver);
      this.modalController.dismiss(driver, 'selected');
    } else {
      alert("Espera a que un repartidor este disponible para aceptar")
    }  
  }

  close() {
    this.modalController.dismiss([], 'close');
  }
}
