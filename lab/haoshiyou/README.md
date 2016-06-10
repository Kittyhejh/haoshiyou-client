# Haoshiyou project (ionic v2)

This project is a project built with ionic v2

## New Developer 

### Prerequisite
You need to install the following in your computer:

1. NPM
2. Ionic@beta
3. Xcode and Iphone Emulator
4. Android Studio and SDK
5. (Optional)Genymotion for faster Android Emulation

### Quick Start

1. Git clone the repo (contact xinbenlv@ for access.), and then 
switch to branch "lab2"

```bash
git clone git@github.com:xinbenlv/rent.zzn.im.git
cd rent.zzn.im
git checkout -b lab2 origin/lab2 # checkout branch "lab2"

```

2. Install packages and setup ionic 

```bash
cd lab/haoshiyou/
npm install
ionic state restore
```

3. Run the Web

```
ionic serve -l
```

4. Run the ios emulator and android emulator
```bash
ionic emulate ios
ionic emulate android
```

## Note

Most of the packages here are included at the time of 2016-05-22. at the time the ionicv2 is still in it's beta
Angular2 is just moving to to rc1, splitting how packages are included, and ionic@beta has not yet moved to
the angular2 rc. Once ionic@beta is moving to angular2 rc, the following will be refactored accordingly.

* AngularFire2 at alpha14

(AngularFire2)[https://github.com/angular/angularfire2/tree/16c573b0144b3c38165407744b21e504421086d2]

### Install typings definition from DefinitelyTyped

For example

```
typings install dt~firebase --save --global
```

Install 


### Run 

```
ionic run -lcs --debug ios --address=localhost
```


### Release

Follow [Ionic Publishing Guide](http://ionicframework.com/docs/guide/publishing.html)
for publishing.

1. Copy haoshiyou-android.keystore from xinbenlv@'s secret fault

2. Run the following command. You will be prompt for keystore secret, ask xinbenlv@

```
ionic build --release android && jarsigner -verbose \
-sigalg SHA1withRSA -digestalg SHA1 \
-keystore haoshiyou-android.keystore \
platforms/android/build/outputs/apk/android-release-unsigned.apk alias_name
```

3. run

```
alias zipalign=~/Library/Android/sdk/build-tools/23.0.3/zipalign

```

### Resource resolutions for releases

All dimensions are in Pixels, Width X Height

#### Google Play

|------:| -------:
Feature | 1024x500 24bit PNG or JPG
icon    | 512x512 24bit PNG

#### iOS

|----------:| -------:
icon        |  1024x1024 JPG or PNG 72DPI+ RGB 
Screenshot  |  5.5inch(iphone 6/6s Plus), 4.7inch(iphone 6) 4.0 inch, 3.5inch, iPad, iPad Pro

## Road Map
(A task without assignee is xinbenlv@)
 - DONE Create, Save, Update, View, Sort a listing
 - DONE LogIn, LogOut, Password Reset
 - DONE Map Marker Listing Navigation
 - DONE Chat
 - DONE City and Zip Pipe
 - DONE Create chat from listing.
 - DONE Image picker
 - DONE Google Map on Detail Page
 - DONE Handle most frequent bad cases
   -  - DONE No login
   -  - DONE No internet connection
 - Rlease 1: MVP for Early Adopter
   -  - DONE Strip to production credentials
   -  - DONE Turn Off FB and LinkedIn Auth0 signin.
   -  - DONE Disable Web Upload Image, Stop nav-back after upload image failure.
   -  - DONE Add icon, splash screen, webpage icon
   -  - DONE Sanitize
   -  - DONE Publish on Android and iOS for beta testing.
   -  - Bugs
   -  -  - DONE Flash quit when adding picture
   -  -  - DONE Flash quit when registering
   -  -  - Chat Thread shows up for unrelated person
 - Web Release => wrj@
   -  - Large Screen: listing list on left and map on right
   -  - Web image picker in creation page
 - Release 2: MVP for Growth
   -  - Make the detail page editable
   -  - Show image full screen view.
   -  - Push notification
   -  - DONE Facebook and LinkedIn Sign-In Callback Fixing
   -  - Share to WeChat
 - Release 3: Performance and UX tweak
   -  - New message counting
   -  - Update Splash Screen and Logo
   -  - Add performance profiling related logging
   
 - Authentication