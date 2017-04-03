import { Component, OnInit, NgZone } from '@angular/core';
import { GMapsService } from '../../../meta/googleMapService';
declare var google;

@Component({
  selector: 'map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss']
})

export class MapPageComponent implements OnInit {

  private address: string = "";
  private googleAddress: string = "";
  private results: any = null;
  private lat: number = 51.678418;
  private lng: number = 7.809007;

  constructor(
    private googleMapService: GMapsService,
    private zone: NgZone
  ) { }

  public ngOnInit() { }

  private searchByAddress() {
    this.googleMapService.getLatLan(this.address).subscribe(
      onNext => {
        this.zone.run(() => {
          this.results = true;
          this.googleAddress = onNext[0].formatted_address;
          this.lat = onNext[0].geometry.location.lat();
          this.lng = onNext[0].geometry.location.lng();
        });
      },
      onError => {
        console.log(onError);
      },
      () => {
        // onCompleted.
      });
  }

  private geoLocate() {
    this.googleMapService.geolocate().subscribe(
      onNext => {
        this.zone.run(() => {
          this.results = true;
          this.googleAddress = "Geolocation";
          this.lat = onNext.coords.latitude;
          this.lng = onNext.coords.longitude;
        });
      },
      onError => {
        console.log(onError);
      },
      () => {
        // onCompleted.
      });
  }

}
