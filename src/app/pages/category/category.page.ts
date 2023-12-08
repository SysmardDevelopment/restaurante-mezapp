import { Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { AlertController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  categories: any = [];
  dummy = Array(50);
  constructor(
    private api: ApisService,
    private alertController: AlertController,
    private util: UtilService,
    private router: Router,
  ) {
    this.getCategories();
  }

  getCategories() {
    this.api.getVenueCategories(localStorage.getItem('uid')).then((data) => {
      this.dummy = [];
      console.log(data);
      if (data) {
        this.categories = data;
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.dummy = [];
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }
  ngOnInit() {
  }
  async addNewCat() {
    const alert = await this.alertController.create({
      header: this.util.translate('Add New!'),
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: this.util.translate('Category Name'),
        },
      ],
      buttons: [
        {
          text: this.util.translate('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.util.translate('Ok'),
          handler: (data) => {
            console.log('Confirm Ok', data);
            if (data && data.name1 !== '') {
              console.log('add new');
              const ids = this.util.makeid(10);
              const param = {
                uid: localStorage.getItem('uid'),
                name: data.name1,
                id: ids
              };
              this.util.show();
              this.api.addVenueCategoies(localStorage.getItem('uid'), ids, param).then((data) => {
                this.util.hide();
                console.log(data);
                this.getCategories();
              }).catch(error => {
                this.util.hide();
                this.util.errorToast(this.util.translate('Something went wrong'));
                console.log(error);
              });
            }
          }
        }
      ]
    });

    await alert.present();

    // this.router.navigate(['/add-category'])
  }
  async edit(item) {
    // console.log(item);
    const alert = await this.alertController.create({
      header: this.util.translate('Edit'),
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: this.util.translate('Category Name'),
          value: item.name
        },
      ],
      buttons: [
        {
          text: this.util.translate('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.util.translate('Ok'),
          handler: (data) => {
            console.log('Confirm Ok', data);
            if (data && data.name1 !== '') {
              console.log('add new');

              const param = {
                uid: localStorage.getItem('uid'),
                name: data.name1,
                id: item.id
              };
              this.util.show();
              this.api.updateVenueCategoies(localStorage.getItem('uid'), item.id, param).then((data) => {
                this.util.hide();
                console.log(data);
                this.getCategories();
              }).catch(error => {
                this.util.hide();
                this.util.errorToast(this.util.translate('Something went wrong'));
                console.log(error);
              });
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async delete(item){
    Swal.fire({
      title: this.util.translate('Are you sure?'),
      text: this.util.translate("You won't be able to revert this!"),
      icon: this.util.translate('warning'),
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: "Cancelar",
      confirmButtonText: this.util.translate('Delete')
    }).then((result) => {
      if (result.value) {
        this.api.deleteCategory(localStorage.getItem('uid'), item.id).then((data) => {
          console.log(data);
          Swal.fire({
            title: this.util.translate('Deleted!'),
            text: this.util.translate('Your record has been deleted.'),
            confirmButtonText: this.util.translate('Ok'),
            icon: "success"
          })
          this.getCategories();
        }).catch(error => {
          alert("error")
          this.util.errorToast(this.util.translate('Something went wrong'));
          console.log(error);
        });
        
      }
    })
    
  }
}
