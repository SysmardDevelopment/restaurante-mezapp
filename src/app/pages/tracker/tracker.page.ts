import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UtilService } from 'src/app/services/util.service';
declare var google: any;
@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.page.html',
  styleUrls: ['./tracker.page.scss'],
})
export class TrackerPage implements OnInit {
  @ViewChild('map', { static: true }) mapElement: ElementRef;
  map: any;

  latOri = '';
  longOri = '';

  latDest = '';
  longDest = '';
  id: any = '';

  dName: any = '';
  custAddress: any = '';
  dCover: any = '';
  dId: any;
  phone: any = '';
  status: any = '';
  totalOrders: any = [];
  grandTotal: any;

  driverLat: any;
  driverLng: any;
  interval: any;
  paid: any;
  constructor(
    private route: ActivatedRoute,
    private api: ApisService,
    private adb: AngularFirestore,
    private util: UtilService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(data => {
      console.log('data=>', data);
      if (data.hasOwnProperty('id')) {
        this.id = data.id;
        this.getOrder();
      }
    });

  }
  callDriver() {
    // window.open('tel:' + this.phone);
    window.open('https://api.whatsapp.com/send?phone=91' + this.phone);
  }

  getOrder() {
    this.util.show();
    this.api.getOrderById(this.id).then((data) => {
      this.util.hide();
      console.log(data);
      if (data) {
        this.dName = data.uid.fullname;
        this.dCover = data.vid.cover;
        this.dId = data.dId.id;
        this.custAddress = data.address.address;
        this.phone = data.vid.phone;
        this.status = data.status;
        this.grandTotal = data.grandTotal;
        this.totalOrders = JSON.parse(data.order);
        this.paid = data.paid;
        this.getDriverInfo();
        console.log('Ordenes: ', this.totalOrders);
        this.loadMap(parseFloat(data.vid.lat), parseFloat(data.vid.lng), data.address.address);
      }
    }, error => {
      this.util.hide();
      console.log('Error en ordenes: ', error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log('Error: ', error);
      this.util.hide();
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  getDriverInfo() {
    this.adb.collection('users').doc(this.dId).snapshotChanges().subscribe((data: any) => {
      if (data) {
        this.driverLat = data.payload.data().lat;
        this.driverLng = data.payload.data().lng;
      }
    }, error => {
      console.log(error);
    });
  }

  changeMarkerPosition(marker, map) {
    var latlng = new google.maps.LatLng(this.driverLat, this.driverLng);
    map.setCenter(latlng);
    marker.setPosition(latlng);
    console.log('Actualizando la posición del marcador...');
  }

  loadMap(latOri, lngOri, destinationAddress) {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var destinationGeocoder = new google.maps.Geocoder;

    // Obtener la posición del destino a partir de la dirección
    destinationGeocoder.geocode( { 'address' : destinationAddress }, function( results, status ) {
      if(status == google.maps.GeocoderStatus.OK) {
        this.latDest = results[1].geometry.location.lat();
        this.longDest = results[1].geometry.location.lng();
        
        let custPos = new google.maps.LatLng(this.latDest, this.longDest);

        var markerCust = new google.maps.Marker({
          map: map,
          position: custPos,
          animation: google.maps.Animation.DROP,
        });
        
        map.setCenter(custPos);
        markerCust.setPosition(custPos);
      } else {
          console.log( 'Error de geolocalización: ' + status );
      }
    });

    directionsDisplay = new google.maps.DirectionsRenderer();
    var bounds = new google.maps.LatLngBounds;

    var origin1 = { lat: parseFloat(latOri), lng: parseFloat(lngOri) };
    var destinationA = { lat: this.latDest, lng: this.longDest };

    var destinationIcon = 'https://chart.googleapis.com/chart?' + 'chst=d_map_pin_letter&chld=D|FF0000|000000';
    var originIcon = 'https://chart.googleapis.com/chart?' + 'chst=d_map_pin_letter&chld=O|FFFF00|000000';
    var map = new google.maps.Map(this.mapElement.nativeElement, {
      center: { lat: this.latDest, lng: this.longDest },
      disableDefaultUI: true,
      zoom: 100
    });

    const restPos = new google.maps.LatLng(latOri, lngOri);

    const icon = {
      url: 'assets/icon.png',
      scaledSize: new google.maps.Size(50, 50), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };

    var marker = new google.maps.Marker({
      map: map,
      position: restPos,
      animation: google.maps.Animation.DROP,
      icon: icon,
    });

    directionsDisplay.setMap(map);
    directionsDisplay.setOptions({
      polylineOptions: { strokeWeight: 4, strokeOpacity: 1, strokeColor: 'red' },
      suppressMarkers: false
    });

    var geocoder = new google.maps.Geocoder;

    var service = new google.maps.DistanceMatrixService;
    service.getDistanceMatrix({
      origins: [origin1],
      destinations: [destinationA],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, (response, status) => {
      console.log(status);
      if (status !== 'OK') {
        alert('Error was: ' + status);
      } else {
        var originList = response.originAddresses;
        var destinationList = response.destinationAddresses;

        var showGeocodedAddressOnMap = function (asDestination) {
          var icon = asDestination ? destinationIcon : originIcon;
          return function (results, status) {
            if (status === 'OK') {
              map.fitBounds(bounds.extend(results[0].geometry.location));
            } else {
              console.log('Geocode was not successful due to: ', status);
            }
          };
        };

        directionsService.route({
          origin: origin1,
          destination: destinationA,
          travelMode: 'DRIVING'
        }, function (response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });

        for (var i = 0; i < originList.length; i++) {
          var results = response.rows[i].elements;
          geocoder.geocode({ 'address': originList[i] },
            showGeocodedAddressOnMap(false));
          for (var j = 0; j < results.length; j++) {
            geocoder.geocode({ 'address': destinationList[j] },
              showGeocodedAddressOnMap(true));
          }
        }
      }
    });
    this.interval = setInterval(() => {
      this.changeMarkerPosition(marker, map);
    }, 12000);
  }

  ionViewDidLeave() {
    clearInterval(this.interval);
  }

  getCurrency() {
    return this.util.getCurrecySymbol();
  }
}
