# FreeWheels
FreeWheels -- A roadtrip POI app built on Google Places API
====================================

## DEVELOPER TEAM

* Abhishek Raj
* Anuj Iravane
* Sam Cohen
* Matt Jaffe

## DESCRIPTION

FreeWheels is an iOS app to tell you about awesome places nearby when on a roadtrip. 

FreeWheels can show you the cool nearby:
* Amusement Park
* Art Gallery
* Bowling Alley
* Casino
* Movie Theater
* Museum
* Night Club
* Park
* Place of Worship
* Restaurant
* Spa
* Stadium
* Store
* University
* Zoo

So you can focus on the road.

## VIEW A DEMO

The app is built via the AppGyver Cloud Share service. Follow [this link](https://share.appgyver.com/?id=91332&hash=f309fba9033c55ed8aed34c65decaac4aed8f1dd4a3cfe9169fce11e52bc54a5) to view it in a browser emulator or find out how to view it on your iOS device. Android devices are not supported.

## SYSTEM REQUIREMENTS

- [AppGyver Supersonic](http://www.appgyver.io/supersonic/)
- Node.js 0.10.x+ 
- NPM   

## RUNNING

To build FreeWheels, simply fork the repository, and run:

```bash
$ steroids update
$ steroids connect
```

## CODE
FreeWheels is built using AppGyver’s Supersonic framework. The app is coded in AngularJS. 

## API KEY

For further development on this app, developers will need to get their own Google Maps JavaScript API Key. Free keys can be obtained from this link: https://developers.google.com/maps/documentation/javascript/get-api-key

You will then need to modify the key in the layout.html file. It is located in "app/common/views/layout.html". You will need to put the key you obtained from Google two places in this file (designated by "#PLACE_KEY_HERE#"):

```bash
<script
   src="https://maps.googleapis.com/maps/api/js?key=#PLACE_KEY_HERE#">
   </script>
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=#PLACE_KEY_HERE#&libraries=places,geometry"></script>
```
## KNOWN ISSUES

* There is a timing issue involving the calls to Google Places API. In poor internet connection, the calls will take too long and the update will timeout when the app opens.
* When the app is on auto-refresh mode, when the places list changes, it will trigger an update notification. However, there is a known bug that the API call will timeout before it is finished. This will cause it to pull and incomplete list and trigger an update notification even when the places list has not actually changed.
