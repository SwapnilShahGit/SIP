import { Injectable, NgZone } from '@angular/core';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { Observable, Observer } from 'rxjs';
import { Subject } from 'rxjs/Subject';
declare var google;

@Injectable()
export class GMapsService extends GoogleMapsAPIWrapper {

    constructor(private __loader: MapsAPILoader, private __zone: NgZone) {
      super(__loader, __zone);
    }

    public getLatLan(address: string) {
      let geocoder = new google.maps.Geocoder();
      return Observable.create(observer => {
        geocoder.geocode({'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            observer.next(results);
            observer.complete();
          } else {
            observer.error('No results for ' + address);
            observer.complete();
          }
        });
      });
    }

    public geolocate() {
      return Observable.create(observer => {
        if (!navigator.geolocation) {
          observer.error('Geolocation is not supported by your browser.');
          observer.complete();
          return;
        }
        function success(position) {
          observer.next(position);
          observer.complete();
        }
        function error() {
          observer.error('Error during Geolocation.');
          observer.complete();
        }
        navigator.geolocation.getCurrentPosition(success, error, {
          maximumAge: Infinity,
          timeout: 5000
        });
      });
    }
}
