import VersionNumber from 'react-native-version-number';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

class SdaAnalytics {
  private pendingEvents;
  private gettingLocation;
  public appId;
  private sessId;
  private lastKnownLocation = {};
  private positionListner;
  private analyticsDocumentInUse = false;

  public async init() {
    this.pendingEvents = [];
    this.gettingLocation = false;

    this.appId = '';
    await this.getAppId();

    const uuid = require('react-native-uuid');
    this.sessId = uuid.v1();
    const hasPermission =
      Platform.OS === 'android'
        ? await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          )
        : true;
    if (hasPermission) {
      const geoOptions = {
        enableHighAccuracy: false,
        useSignificantChanges: true,
        timeout: 15000
      } as any;
      this.positionListner = Geolocation.watchPosition(
        (newLocation) => this.geoLocationSuccess(newLocation),
        (error) => this.geoLocationError(error),
        geoOptions
      );
    }
  }

  private geoLocationSuccess(newLocation) {
    if (!(newLocation && newLocation.coords)) {
      console.log('New location does not have coordinates. Ignore it');
    } else {
      this.lastKnownLocation = {
        lat: newLocation.coords.latitude,
        lon: newLocation.coords.longitude
      };
    }
  }

  private geoLocationError(error) {
    console.warn('position not found', error);
  }

  public destroy() {
    Geolocation.clearWatch(this.positionListner);
  }

  public async event(eventType, eventData) {
    let e: any = new Object();
    e.ts = Date.now();
    e.appId = this.appId;
    e.sessId = this.sessId;
    e.eventType = eventType;
    e.eventData = eventData;
    e.location = this.lastKnownLocation;

    // Add app version
    if (VersionNumber.appVersion) {
      e.appVersion = VersionNumber.appVersion;
    }

    // if (__DEV__) {
    console.log('TRACKING:', eventType, eventData, e.location);
    // } else {
    this.pendingEvents.push(e);
    this.savePendingEventsToFile();
    // }
  }

  private savePendingEventsToFile() {
    if (this.analyticsDocumentInUse) {
      return;
    }
    const self = this;
    const fs = require('react-native-fs');
    const fn = fs.DocumentDirectoryPath + '/analytics.json';
    this.analyticsDocumentInUse = true;
    let tempEvents = [];
    fs.readFile(fn)
      .then((content) => {
        const events = JSON.parse(content);

        tempEvents = tempEvents.concat(this.pendingEvents);
        this.pendingEvents = [];

        const eventsToSave = events.concat(tempEvents);
        // events.push(e);
        self.saveEvents(eventsToSave);
      })
      .catch((err) => {
        console.log('savePendingEventsToFile - failedRead', err);

        self.saveEvents(tempEvents); // Start new analytics file with an array including latest event.
        // self.saveEvents([e]); // Start new analytics file with an array including latest event.
      });
  }

  private saveEvents(events) {
    // save the events
    const fs = require('react-native-fs');
    const fn = fs.DocumentDirectoryPath + '/analytics.json';
    const events_json = JSON.stringify(events);

    fs.writeFile(fn, events_json)
      .then(() => {
        console.log('analytics saved analytics.json');
        this.analyticsDocumentInUse = false;

        const areThereMorePendingFiles = this.pendingEvents.length > 0;
        if (areThereMorePendingFiles) {
          this.savePendingEventsToFile();
        }
      })
      .catch((err) => {
        console.log('analytics save error: ' + err);

        //Failed to write to file. Add events back to the front of pendingEvents
        this.pendingEvents = events.concat[this.pendingEvents];
        this.analyticsDocumentInUse = false;
      });
  }

  public async getAppId() {
    const self = this;
    const fs = require('react-native-fs');
    const fn = fs.DocumentDirectoryPath + '/app_id.json';
    await fs
      .readFile(fn)
      .then((content) => {
        this.appId = content;
        // console.log('analytics loaded app_id ' + self.appId + ' from app_id.json');
      })
      .catch((err) => {
        const uuid = require('react-native-uuid');
        this.appId = uuid.v1();
        console.log(
          'analytics app_id not jound (app_id.json) - created new ' +
            self.appId,
          err
        );

        fs.writeFile(fn, this.appId)
          .then(() => {
            console.log('analytics saved app_id.json');
          })
          .catch((error) => {
            console.log('analytics save app_id.json error: ' + error);
          });
      });
  }

  async requestLocationPermission(title, message, buttonPositive) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: title,
          message: message,
          buttonPositive: buttonPositive
        }
      );
      // return granted;
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
        return true;
      } else {
        console.log('Location permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
}

export let analytics = new SdaAnalytics();
