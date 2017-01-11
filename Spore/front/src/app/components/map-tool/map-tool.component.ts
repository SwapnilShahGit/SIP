import { StaticNavBar } from '../static-nav/static-nav.component';
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FooterBarComponent } from '../footer-bar/footer-bar.component';
import { MapResult } from './mapResult';
declare var google: any;

@Component({
    selector: 'map-tool',
    templateUrl: './map-tool.component.html',
    styleUrls: ['./map-tool.component.scss']
})
export class MapToolComponent implements OnInit {

    private inputLocation: string = 'SOTI';
    private inputPointOfInterest: string = 'food';
    private inputRadius: string = '5000';
    private custom: boolean = false;
    private mapResultList: Array<MapResult> = new Array<MapResult>();
    private map: any;
    private center = { lat: 43.5479, lng: -79.6609 }; //turn this in to custom later on...

    ngOnInit() {
        this.geoLocate();
        this.initMap();

    }

    public initMap() {
        let map = this.map = new google.maps.Map(document.getElementById('map'), {
            center: this.center,
            zoom: 17
        });

        console.log("LOCATION DISPLAYED: " + this.center.lat + " " + this.center.lng);

        var service = new google.maps.places.PlacesService(this.map);
        service.nearbySearch({
            location: this.center,
            radius: this.inputRadius,
            type: [this.inputPointOfInterest]
        }, processResults);

        function processResults(results, status, pagination) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
                return;
            } else {
                createMarkers(results, map);
            }
        }

        function createMarkers(places, map) {
            var bounds = new google.maps.LatLngBounds();
            var placesList = document.getElementById('places');

            for (var i = 0, place; place = places[i]; i++) {
                var image = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                var marker = new google.maps.Marker({
                    map: map,
                    icon: image,
                    title: place.name,
                    position: place.geometry.location
                });

                placesList.innerHTML += '<li>' + place.name + '</li>';
                bounds.extend(place.geometry.location);
            }

            map.fitBounds(bounds);
        }
    }

    public geoLocate() {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        let center = this.center;

        function success(position) {
            center.lat = position.coords.latitude;
            center.lng = position.coords.longitude;

            console.log("GEOLOCATION: " + center.lat + " " + center.lng);
        }

        function error() {
            console.log("GEOLOCATION DID NOT SUCCEED")
        }

        navigator.geolocation.getCurrentPosition(success, error);
    }

    /* For Google GeoLocation */          // -------------------------------------------------------------------------------------------------------------------
    // public geoFindMe() {

    //     var location = document.getElementById("location");

    //     if (!navigator.geolocation) {
    //         location.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    //         return;
    //     }

    //     let mapResultList = this.mapResultList;
    //     let pointOfInterest = this.inputPointOfInterest;
    //     let radius = this.inputRadius;
    //     let locationInput = this.inputLocation;
    //     let custom = this.custom;

    //     var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    //     var labelIndex = 0;
    //     var map;
    //     var service;
    //     var whereAmI;
    //     var marker;
    //     var infowindow;
    //     var geocoder;

    //     function success(position) {
    //         var latitude = position.coords.latitude;
    //         var longitude = position.coords.longitude;

    //         location.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

    //         if (!custom) {
    //             whereAmI = new google.maps.LatLng(latitude, longitude);
    //         }
    //         else {
    //             geocoder = new google.maps.Geocoder();
    //             geocoder.geocode({ 'address': locationInput }, function (results, status) {
    //                 if (status == google.maps.GeocoderStatus.OK) {

    //                     map.setCenter(results[0].geometry.location);
    //                     var infowindow = new google.maps.InfoWindow({
    //                         content: '<b>' + locationInput + '</b>',
    //                         size: new google.maps.Size(150, 50)
    //                     });

    //                     var marker = new google.maps.Marker({
    //                         position: results[0].geometry.location,
    //                         map: map,
    //                         title: locationInput
    //                     });
    //                     google.maps.event.addListener(marker, 'click', function () {
    //                         infowindow.open(map, marker);
    //                     });
    //                 }
    //             });
    //         }
    //         var mapProp = {
    //             center: whereAmI,
    //             zoom: 13,
    //             mapTypeId: google.maps.MapTypeId.ROADMAP
    //         };
    //         map = new google.maps.Map(document.getElementById("map"), mapProp);

    //         var request = {
    //             location: whereAmI,
    //             radius: radius,
    //             types: [pointOfInterest]
    //         }

    //         marker = new google.maps.Marker({
    //             position: whereAmI,
    //             map: map,
    //             title: 'Hello World!',
    //             //label: 'YOU',
    //             draggable: true,
    //             animation: google.maps.Animation.DROP,
    //             icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
    //         });
    //         marker.addListener('click', toggleBounce);
    //         marker.setMap(map);

    //         infowindow = new google.maps.InfoWindow();
    //         var service = new google.maps.places.PlacesService(map);
    //         service.nearbySearch(request, callback);
    //     };

    //     function callback(results, status) {
    //         if (status === google.maps.places.PlacesServiceStatus.OK) {
    //             // for (var i = 0; i < results.length; i++) {
    //             for (var i = 0; i < Math.min(5, results.length); i++) {
    //                 createMarker(results[i], i);
    //             }
    //         }
    //     }

    //     function createMarker(place, i) {
    //         var placeLoc = place.geometry.location;
    //         var label = labels[labelIndex++ % labels.length];
    //         var marker = new google.maps.Marker({
    //             map: map,
    //             label: label,
    //             position: place.geometry.location
    //         });

    //         mapResultList[i] = (new MapResult(place));

    //         google.maps.event.addListener(marker, 'click', function () {
    //             infowindow.setContent(place.name);
    //             infowindow.open(map, this);
    //         });
    //     }

    //     function toggleBounce() {
    //         if (marker.getAnimation() !== null) {
    //             marker.setAnimation(null);
    //         } else {
    //             marker.setAnimation(google.maps.Animation.BOUNCE);
    //         }
    //     }

    //     function error() {
    //         location.innerHTML = "Unable to retrieve your location";
    //     };

    //     location.innerHTML = "<p>Locating…</p>";

    //     navigator.geolocation.getCurrentPosition(success, error);
    // }

    // public setUpAutoFill() {
    //     var placeSearch, autocomplete;
    //     function initAutocomplete() {
    //         autocomplete = new google.maps.places.Autocomplete(
    //             (document.getElementById('autocomplete')),
    //             { types: ['geocode'] });
    //     }

    //     function geolocate() {
    //         if (navigator.geolocation) {
    //             navigator.geolocation.getCurrentPosition(function (position) {
    //                 var geolocation = {
    //                     lat: position.coords.latitude,
    //                     lng: position.coords.longitude
    //                 };
    //                 var circle = new google.maps.Circle({
    //                     center: geolocation,
    //                     radius: position.coords.accuracy
    //                 });
    //                 autocomplete.setBounds(circle.getBounds());
    //             });
    //         }
    //     }

    //     initAutocomplete();
    //     geolocate();
    // }

    /////////------------------------------------------------

    // public geoFindMeCustom() {

    //     var location = document.getElementById("location");
    //     var geocoder;
    //     var map;
    //     var address = this.inputLocation;

    //     function initialize() {
    //         geocoder = new google.maps.Geocoder();
    //         var latlng = new google.maps.LatLng(-34.397, 150.644);
    //         var myOptions = {
    //             zoom: 13,
    //             center: latlng,
    //             mapTypeControl: true,
    //             mapTypeControlOptions: {
    //                 style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    //             },
    //             navigationControl: true,
    //             mapTypeId: google.maps.MapTypeId.ROADMAP
    //         };
    //         map = new google.maps.Map(document.getElementById("map"), myOptions);
    //         if (geocoder) {
    //             location.innerHTML = '<p>Currently locating: ' + address + '</p>';
    //             geocoder.geocode({
    //                 'address': address
    //             }, function (results, status) {
    //                 if (status == google.maps.GeocoderStatus.OK) {
    //                     if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
    //                         map.setCenter(results[0].geometry.location);

    //                         var infowindow = new google.maps.InfoWindow({
    //                             content: '<b>' + address + '</b>',
    //                             size: new google.maps.Size(150, 50)
    //                         });

    //                         var marker = new google.maps.Marker({
    //                             position: results[0].geometry.location,
    //                             map: map,
    //                             title: address
    //                         });
    //                         google.maps.event.addListener(marker, 'click', function () {
    //                             infowindow.open(map, marker);
    //                         });

    //                     } else {
    //                         alert("No results found");
    //                     }
    //                 } else {
    //                     alert("Geocode was not successful for the following reason: " + status);
    //                 }
    //             });
    //         }
    //     }
    //     google.maps.event.addDomListener(window, 'load', initialize);
    //     initialize();
    // }
}
