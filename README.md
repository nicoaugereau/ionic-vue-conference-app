# Ionic Vue Conference Application with Cypress framework

This application is purely a kitchen-sink demo of the Ionic Framework and Vue with Cypress framework for End-to-End and Component testing.

**There is not an actual Ionic Conference at this time.** This project is just to show off Ionic components in a real-world application.

From [Ionic Team](https://github.com/ionic-team)

## React and Angular versions

We've built versions of this Conference app in React and Angular for developers that would prefer to use one of those framework options:

https://github.com/ionic-team/ionic-react-conference-app

https://github.com/ionic-team/ionic-conference-app

## Table of Contents

- [Getting Started](#getting-started)
- [Build the mobile app](#build-the-mobile-app)
- [App Preview](#app-preview)

## Getting Started

- [Download the installer](https://nodejs.org/) for Node LTS.
- Install the ionic CLI globally: `npm install -g ionic`
- Clone this repository: `git clone https://github.com/ionic-team/ionic-vue-conference-app.git`.
- Run `npm install` from the project root.
- Run `npm run start` in a terminal from the project root.
- Profit. :tada:

## Build the mobile app

- You probably need to install CocoaPods
- Run `ionic capacitor add ios` or `ionic capacitor add android` in a terminal from the project root.
- Run Cocoapods and open the `Podfile`in the `ios` directory
- If Cocoapods < v 1.6 then comment the line`install! 'cocoapods', :disable_input_output_paths => true` and click Install
- Run `ionic capacitor open ios` or `ionic capacitor open android`
- If you make changes, update the app: Run `ionic capacitor copy ios` or `ionic capacitor open android`

### Errors

- Cycle in dependencies (XCode), run in terminal:

```
  cd Library/Developer/Xcode/
  rm -r DerivedData/
```

## App Preview

### [Menu](https://github.com/ionic-team/ionic-conference-app/blob/master/src/app/pages/menu/menu.html)

| Material Design                                          | iOS                                              |
| -------------------------------------------------------- | ------------------------------------------------ |
| ![Android Menu](/resources/screenshots/android-menu.png) | ![iOS Menu](/resources/screenshots/ios-menu.png) |

### [Schedule Page](https://github.com/ionic-team/ionic-conference-app/blob/master/src/app/pages/schedule/schedule.html)

| Material Design                                                  | iOS                                                      |
| ---------------------------------------------------------------- | -------------------------------------------------------- |
| ![Android Schedule](/resources/screenshots/android-schedule.png) | ![iOS Schedule](/resources/screenshots/ios-schedule.png) |

### [Speakers Page](https://github.com/ionic-team/ionic-conference-app/blob/master/src/app/pages/speaker-list/speaker-list.html)

| Material Design                                                  | iOS                                                      |
| ---------------------------------------------------------------- | -------------------------------------------------------- |
| ![Android Speakers](/resources/screenshots/android-speakers.png) | ![iOS Speakers](/resources/screenshots/ios-speakers.png) |

### [Speaker Detail Page](https://github.com/ionic-team/ionic-conference-app/blob/master/src/app/pages/speaker-detail/speaker-detail.html)

| Material Design                                                              | iOS                                                                  |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| ![Android Speaker Detail](/resources/screenshots/android-speaker-detail.png) | ![iOS Speaker Detail](/resources/screenshots/ios-speaker-detail.png) |

### [About Page](https://github.com/ionic-team/ionic-conference-app/blob/master/src/app/pages/about/about.html)

| Material Design                                            | iOS                                                |
| ---------------------------------------------------------- | -------------------------------------------------- |
| ![Android About](/resources/screenshots/android-about.png) | ![iOS About](/resources/screenshots/ios-about.png) |
