import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { OrderTicketComponent } from './order-ticket.component';
import { OrderTicketPageRoutingModule } from './order-ticket-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    OrderTicketPageRoutingModule,
  ],
  declarations: [OrderTicketComponent]
})
export class OrderTicketPageModule {}
