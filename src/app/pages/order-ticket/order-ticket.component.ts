import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from "@ionic/angular";
import { ApisService } from "src/app/services/apis.service";
import { UtilService } from "src/app/services/util.service";

/**
 * Componente para mostrar los detalles de pago de una orden
 */
@Component({
  selector: 'app-order-ticket',
  templateUrl: './order-ticket.component.html',
  styleUrls: ['./order-ticket.component.scss'],
})
export class OrderTicketComponent implements OnInit {
  loaded: boolean;

  // Información de la orden
  paymentId: string = ""; // Identificador Stripe de la transacción
  payMethod: string = ""; // Método de pago
  serviceTax: string = ""; // Método de pago
  transactionTime: string = ""; // Método de pago
  foodPrice: string = ""; // Precio de la comida
  deliveryTotal: string = ""; // Cargo de envío de YoChiVoy
  paidTotal: string = ""; // Cargo total de la orden
  item: any; // Elemento en la orden, conteniendo el precio

  /**
   * Constructor
   */
  constructor(
    private navCtrl: NavController, // Controlador para la navegación entre páginas
    private util: UtilService, // Controlador de utilidades
    private api: ApisService, // Controlador de API
    private route: ActivatedRoute,
  ) { }

  /**
   * Inicializa los datos usados del componente
   */
  ngOnInit() {
    // Obtener los datos de los parametros de consulta
    this.route.queryParams.subscribe(data => {
      console.log(data.id);
      // Asignar los datos de la orden.
      this.getPayDetails(data.id);
    });
  }

  /**
   * Retorna de la pagina de ticket
   */
  back = () => this.navCtrl.back(); // Vuelve a la pagina de navegación anterior

  /**
   * Envía el ticket a impresión
   */
  printTicket() {};

  /**
   * Escribe una cantidad en formato de moneda ($)
   */
  getCurrency = () => this.util.getCurrecySymbol();

  /**
   * Obtiene los datos de pago
   * @param id Identificador de los datos de consulta del pago
   */
  getPayDetails(id: string) {
    this.api
      .getOrderById(id)
      .then(
        data => {
          this.loaded = true;
          if (data) {
            const formatTime = new Date(Date.parse(data.time));
            console.log(data);
            this.paidTotal = data.grandTotal;
            this.transactionTime = data.time;
            this.paymentId = data.paykey;
            this.serviceTax = data.serviceTax;
            this.deliveryTotal = data.deliveryCharge;
            this.transactionTime = `${formatTime.toLocaleString('es-MX', {timeZone: 'UTC'})}`;
            this.foodPrice = data.total;
            this.payMethod = data.paid;
          }
        },
        error => {
          this.loaded = true;
          this.util.errorToast(this.util.translate("Something went wrong"));
          console.log("Error al obtenr los datos de pago", error);
        }
      )
      .catch(error => {
        this.loaded = true;
        this.util.errorToast(this.util.translate("Something went wrong"));
        console.log("Error al obtener los datos de pago", error);
      });
  }
}
