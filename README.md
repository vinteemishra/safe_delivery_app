# Safe delivery Mobile App

This directory contains the Safe Delivery mobile app

## Installing

### Requirements:

-   Node
-   XCode (for iOS build)
-   Android SDK Build­tools version 28.0.3
-   Android 9.0 (API 28)
-   Android Support Repository 28.0.0

### Install node dependencies

```
npm install
```

### Install iOS Cocoa Pods

```
cd ios && pod install
```

## Running

Run TypeScript:

```
npm run dev
```

Start React Native JS bundler:

```
npm start
```

Run on iOS:

```
npm run ios
```

Run on Android:

```
npm run android
```

See additional available scripts in `package.json`

## Publish to App Store

Change bundle to com.visikon.safedelivery. Increment version and build.

## Publish to Google Play

Increment versionCode and VersionName in android/app/build.gradle
