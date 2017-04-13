import { Injectable, NgZone, Directive, Input, OnChanges } from '@angular/core';
import { GoogleMapsAPIWrapper, MapsAPILoader } from 'angular2-google-maps/core';
import { Observable, Observer } from 'rxjs';
import { Subject } from 'rxjs/Subject';
declare var google;

@Injectable()
export class GMapsService extends GoogleMapsAPIWrapper {

    constructor(
      private loader: MapsAPILoader,
      private zone: NgZone
    ) {
      super(loader, zone);
    }

    // Gets bunch of places around location. (Doesnt seem to matter much
    // what place you specify - better to use getTextSearch)
    public getPointsOfInterest(lat: number, lng: number, place: string): any {
      let map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(lat, lng),
        zoom: 15
      });
      var service = new google.maps.places.PlacesService(map);
      return Observable.create(observer => {
        service.nearbySearch({
          location: {lat: lat, lng: lng},
          radius: '1000',
          types: [place]
        }, function(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              observer.next(results[i]);
            }
            observer.complete();
          } else {
            observer.error('No points of interest found.');
            observer.complete();
          }
        });
      });
    }

    // Good search if you have an address and point of interest in mind.
    // i.e Food near Square One Mississauga
    public getTextSearch(lat: number, lng: number, address: string, place: string): any {
      let map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(lat, lng),
        zoom: 15
      });
      var service = new google.maps.places.PlacesService(map);
      return Observable.create(observer => {
        service.textSearch({
          location: {lat: lat, lng: lng},
          radius: '1000',
          query: place + ' near ' + address
        }, function(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              observer.next(results[i]);
            }
            observer.complete();
          } else {
            observer.error('No points of interest found.');
            observer.complete();
          }
        });
      });
    }

    // Using placeId you can get extra details about that place.
    public getPlaceDetails(lat: number, lng: number, placeId: string): any {
      let map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(lat, lng),
        zoom: 15
      });
      var service = new google.maps.places.PlacesService(map);
      return Observable.create(observer => {
        service.getDetails({
            placeId: placeId
          }, function(place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              observer.next(place);
              observer.complete();
            } else {
              observer.error('No place details found.');
              observer.complete();
            }
        });
      });
    }

    public getLatLan(address: string): any {
      let geocoder = new google.maps.Geocoder();
      return Observable.create(observer => {
        geocoder.geocode({'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            observer.next(results);
            observer.complete();
          } else {
            observer.error('No results for ' + address + '.');
            observer.complete();
          }
        });
      });
    }

    public geolocate(): any {
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

@Directive({
  selector: 'sebm-google-map-directions'
})
export class DirectionsMapDirective {

  private directionsDisplay: any;

  @Input()
  public origin: any;

  @Input()
  public destination: any;

  constructor (
    private gmapsApi: GoogleMapsAPIWrapper,
  ) {}

  public ngOnChanges() {
    this.gmapsApi.getNativeMap().then(map => {
      if (!this.origin || !this.destination) {
        return;
      }

      var me = this;
      var directionsService = new google.maps.DirectionsService;
      if (me.directionsDisplay) {
        me.directionsDisplay.setMap(null);
      }

      if (!this.destination.lat || !this.destination.lng) {
        me.directionsDisplay = new google.maps.DirectionsRenderer({
          suppressMarkers: true,
          suppressPolylines: true
        });
        me.directionsDisplay.setMap(map);
        return;
      }

      me.directionsDisplay = new google.maps.DirectionsRenderer({
        suppressMarkers: true
      });
      me.directionsDisplay.setMap(map);
      directionsService.route({
          origin: {lat: this.origin.lat, lng: this.origin.lng},
          destination: {lat: this.destination.lat, lng: this.destination.lng},
          travelMode: google.maps.DirectionsTravelMode.DRIVING
        }, function(response, status) {
          if (status === 'OK') {
            me.directionsDisplay.setDirections(response);
          } else {
            console.log('Directions request failed due to ' + status);
          }
      });
    });
  }
}
