/**
 * Created by anatale on 10/28/2016.
 */
import { StaticNavBar } from '../static-nav/static-nav.component';
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FooterBarComponent } from '../footer-bar/footer-bar.component';
declare var google: any;

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  private SelectedSchool: string = "Please select your school";
  private CurrentTab: string = "TabMap";
  private _slideWidth: string;
  private _slideLeft: string;

  ngOnInit() {
    this.openNav();
  }

  public geoFindMe() {
    var location = document.getElementById("location");
    var options = document.getElementById("options");

    if (!navigator.geolocation) {
      location.innerHTML = "<p>Geolocation is not supported by your browser</p>";
      return;
    }

    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var labelIndex = 0;
    var map;
    var service;
    var whereAmI;
    var marker;
    var infowindow;
    function success(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;

      location.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

      whereAmI = new google.maps.LatLng(latitude, longitude);
      var mapProp = {
        center: whereAmI,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      map = new google.maps.Map(document.getElementById("map"), mapProp);

      var request = {
        location: whereAmI,
        radius: '2000',
        types: ['food']
      }

      marker = new google.maps.Marker({
        position: whereAmI,
        map: map,
        title: 'Hello World!',
        //label: 'YOU',
        draggable: true,
        animation: google.maps.Animation.DROP,
        icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
      });
      marker.addListener('click', toggleBounce);
      marker.setMap(map);

      infowindow = new google.maps.InfoWindow();
      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);
    };

    function callback(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }
      }
    }

    function createMarker(place) {
      var placeLoc = place.geometry.location;
      var label = labels[labelIndex++ % labels.length];
      var marker = new google.maps.Marker({
        map: map,
        label: label,
        position: place.geometry.location
      });

      options.innerHTML += '<p>' + label + ' => ' + place.name + '. cost: ' + place.price_level + '. rating:  ' + place.rating + '</p>';

      google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
      });
    }

    function toggleBounce() {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    }

    function error() {
      location.innerHTML = "Unable to retrieve your location";
    };

    location.innerHTML = "<p>Locating…</p>";

    navigator.geolocation.getCurrentPosition(success, error);
  }

  constructor(private _router: Router) {
  }

  public navigateToLoginPage() {
    this._router.navigate(['/login']);
  }

  public selectUofT() {
    this.SelectedSchool = "University of Toronto";
  }

  public selectSheridan() {
    this.SelectedSchool = "Sheridan College";
  }

  public selectNoSchool() {
    this.SelectedSchool = "Ain't got no time for that";
  }

  public openNav() {
    this._slideWidth = '250px';
    this._slideLeft = '250px';
  }

  public closeNav() {
    this._slideWidth = '0px';
    this._slideLeft = '0px';
  }

  public selectTabCalendar() {
    this.CurrentTab = "TabCalendar";
  }

  public selectTabCalculator() {
    this.CurrentTab = "TabCalculator";
  }

  public selectTabCourses() {
    this.CurrentTab = "TabCourses";
  }

  public selectTabReminders() {
    this.CurrentTab = "TabReminders";
  }

  public selectTabFiles() {
    this.CurrentTab = "TabFiles";
  }

  public selectTabHelp() {
    this.CurrentTab = "TabHelp";
  }

  public selectTabMap() {
    this.CurrentTab = "TabMap";
  }

  public selectTabDefault() {
    this.CurrentTab = "DefaultTab";
  }
}
