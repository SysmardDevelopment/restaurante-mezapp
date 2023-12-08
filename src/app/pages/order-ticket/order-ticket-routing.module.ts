import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderTicketComponent } from './order-ticket.component';

const routes: Routes = [
  {
    path: '',
    component: OrderTicketComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderTicketPageRoutingModule {}
