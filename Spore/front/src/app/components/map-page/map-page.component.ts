import { Component, OnInit } from '@angular/core';
import { MapResult } from '../../../meta/mapResult';
declare var google;

@Component({
  selector: 'map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss']
})

export class MapPageComponent {

  private address: string = "";
  private results: any = null;
  private lat: number = 51.678418;
  private lng: number = 7.809007;

  public ngOnInit() { }

  private searchByAddress() {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': this.address },
      function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          results.forEach(function(loc) {
            //todo need the below values to be actually set so the map changes
            console.log('*** Result found: ' + loc.formatted_address);
            console.log('*** Lat: ' + loc.geometry.location.lat());
            console.log('*** Lng: ' + loc.geometry.location.lng());
          });
        }
      }
    );
  }

  private geoLocateMe() {
    console.log('Geo locate me called');
  }

}
