import { Component, NgZone, OnDestroy } from '@angular/core';
import { FormControl } from "@angular/forms";
import { GMapsService } from '../../../meta/googleMapService';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
declare var google;

@Component({
  selector: 'map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss']
})

export class MapPageComponent implements OnDestroy {

  private address: string = "";
  private googleAddress: string = "";
  private locationResults: boolean = false;
  private searchResults: boolean = false;
  private pointOfInterest: string = "";
  private parsedPointOfInterest: string = "";
  private label: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private pointsOfInterest: Array<any> = [{ lat: 43.653226, lng: -79.38318429999998 }];
  private lat: number = undefined;
  private lng: number = undefined;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private googleMapService: GMapsService,
    private zone: NgZone
  ) {}

  public ngOnDestroy() {
    this.ngUnsubscribe.complete();
  }

  private searchByAddress(): void {
    if (this.address.length > 0) {
      this.googleMapService.getLatLan(this.address).takeUntil(this.ngUnsubscribe).subscribe(
        onNext => {
          this.zone.run(() => {
            this.clearPoints();
            this.locationResults = true;
            this.googleAddress = onNext[0].formatted_address;
            this.pointsOfInterest[0].lat = onNext[0].geometry.location.lat();
            this.pointsOfInterest[0].lng = onNext[0].geometry.location.lng();
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

  private geoLocate(): void {
    this.googleMapService.geolocate().takeUntil(this.ngUnsubscribe).subscribe(
      onNext => {
        this.zone.run(() => {
          this.clearPoints();
          this.locationResults = true;
          this.googleAddress = "Geolocation";
          this.pointsOfInterest[0].lat = onNext.coords.latitude;
          this.pointsOfInterest[0].lng = onNext.coords.longitude;
        });
      },
      onError => {
        console.log(onError);
      },
      () => {
        // onCompleted.
      });
  }

  private getPointsOfInterest(place: string): void {
    if (place && place.length > 0) {
      this.clearPoints();
      this.googleMapService.getTextSearch(this.pointsOfInterest[0].lat, this.pointsOfInterest[0].lng, this.address, place).takeUntil(this.ngUnsubscribe).subscribe(
        onNext => {
          this.zone.run(() => {
            this.addPoint(onNext);
          });
        },
        onError => {
          console.log(onError);
        },
        () => {
          this.parsedPointOfInterest = place;
          this.searchResults = true;
        }
      );
    }
  }

  private clearPoints(): void {
    this.pointOfInterest = "";
    this.parsedPointOfInterest = "";
    this.lat = undefined;
    this.lng = undefined;
    this.searchResults = false;
    while (this.pointsOfInterest.length > 1) {
      this.pointsOfInterest.pop();
    }
  }

  private addPoint(place: any): void {
    if (this.pointsOfInterest.length <= this.label.length) {
      this.pointsOfInterest.push({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        label: this.label[this.pointsOfInterest.length - 1],
        name: place.name,
        address: place.formatted_address,
        rating: place.rating,
        photo: place.photos && place.photos.length > 0 ? place.photos[0].getUrl({maxWidth:250, maxHeight: 250}) : undefined,
        open: place.opening_hours ? place.opening_hours.open_now : undefined
      });
    }
  }

  private focusMarker(place: any): void {
    this.lat = place.lat;
    this.lng = place.lng;
  }
}
