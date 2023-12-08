import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApisService } from "src/app/services/apis.service";
import { NavController } from "@ionic/angular";
import { UtilService } from "src/app/services/util.service";
import * as moment from "moment";
@Component({
  selector: "app-account",
  templateUrl: "./account.page.html",
  styleUrls: ["./account.page.scss"]
})
export class AccountPage implements OnInit {
  seg_id = 1;
  reviews: any = [];
  name: any = "";
  images: any = [];
  cover: any = "";
  address: any = "";
  open: any = "";
  close: any = "";
  descriptions : any =""
  status: any = '';
  constructor(
    private router: Router,
    private api: ApisService,
    private navCtrl: NavController,
    private util: UtilService
  ) {
    this.util.obserProfile().subscribe(data => {
      this.getProfile();
    });
  }

  ngOnInit() {
    this.getReviews();
  }
  closeIt() {
    const param = {
      uid: localStorage.getItem('uid'),
      status: 'close',
    };
    this.util.show();
    this.api.updateVenue(param).then((data) => {
      this.util.hide();
      console.log(data);
      this.util.showToast(this.util.translate('Restaurant updated successfully'), 'success', 'bottom');
      this.util.publishProfile('update');
      this.navCtrl.back();
    }, error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(error);
    }).catch(error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(error);
    });
  }

  openIt() {
    const param = {
      uid: localStorage.getItem('uid'),
      status: 'open',
    };
    this.util.show();
    this.api.updateVenue(param).then((data) => {
      this.util.hide();
      console.log(data);
      this.util.publishProfile('update');
      this.util.showToast(this.util.translate('Restaurant updated successfully'), 'success', 'bottom');
      this.navCtrl.back();
    }, error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(error);
    }).catch(error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(error);
    });
  }

  getProfile() {
    this.api
      .getVenueDetails(localStorage.getItem("uid"))
      .then(data => {
        console.log("details", data);
        if (!data) {
          console.log("no data");
          this.util.showSimpleAlert(
            this.util.translate("Cree su perfil con el Administrador")
          );
          this.router.navigate(["venue-profile"]);
        } else {
          this.name = data.name;
          this.address = data.address;
          this.cover = data.cover;
          this.images = data.images;
          this.open = data.openTime;
          this.close = data.closeTime;
          this.descriptions = data.descriptions
          this.status = data.status;
          if (this.open === "Invalid date") {
            this.open = "10:00 AM";
          }
          if (this.close === "Invalid date") {
            this.close = "10:00 PM";
          }
        }
      })
      .catch(error => {
        console.log(error);
        this.util.showToast(
          this.util.translate("Something went wrong"),
          "danger",
          "bottom"
        );
      });
  }
  ionViewWillEnter() {
    this.getProfile();
  }

  getReviews() {
    this.api
      .getMyReviews(localStorage.getItem("uid"))
      .then(data => {
        console.log("reviews", data);
        if (data) {
          this.reviews = data;
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  goToAddCategoty() {
    this.router.navigate(["/category"]);
  }

  goToEditProfile() {
    this.router.navigate(["/edit-profile"]);
  }

  goToOrder() {
    this.router.navigate(["/orders"]);
  }

  AddFoods() {
    this.router.navigate(["/foods"]);
  }
  venueDetails() {
    this.router.navigate(["venue-profile"]);
  }

  logout() {
    this.api.logout().then(() => {
      this.navCtrl.navigateRoot(["login"]);
    });
  }

  changeSegment(val) {
    this.seg_id = val;
  }
}
