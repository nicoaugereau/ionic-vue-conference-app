/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const fs = require("fs-extra");
const path = require("path");
const downloadPath = path.join(__dirname, "..", "downloads");

// Chrome options
const options = [
  /* TODO : https://peter.sh/experiments/chromium-command-line-switches/
    there is still a whole bunch of stuff to disable
  */
  //'--crash-test', // Causes the browser process to crash on startup, useful to see if we catch that correctly
  // not idea if those 2 aa options are usefull with disable gl thingy
  //'--disable-canvas-aa', // Disable antialiasing on 2d canvas
  //'--disable-2d-canvas-clip-aa', // Disable antialiasing on 2d canvas clips
  //'--disable-gl-drawing-for-tests', // BEST OPTION EVER! Disables GL drawing operations which produce pixel output. With this the GL output will not be correct but tests will run faster.
  "--disable-dev-shm-usage", // ???
  //'--no-zygote', // wtf does that mean ?
  //'--use-gl=swiftshader', // better cpu usage with --use-gl=desktop rather than --use-gl=swiftshader, still needs more testing.
  //'--enable-webgl',
  //'--hide-scrollbars',
  //'--mute-audio',
  //'--no-first-run',
  //'--disable-infobars',
  //'--disable-breakpad',
  ////'--ignore-gpu-blacklist',
  "--headless",
  //'--disable-gpu',
  "--start-maximized", //, '--start-maximized','--window-size=1280,900', // see defaultViewport
  //'--user-data-dir=./chromeData', // created in index.js, guess cache folder ends up inside too.
  "--no-sandbox", // meh but better resource comsuption
  "--disable-setuid-sandbox", // same
  // '--proxy-server=socks5://127.0.0.1:9050'] // tor if needed
  "--ignore-certificate-errors",
  "--noerrdialogs", // Suppresses all error dialogs when present
  "--disable-popup-blocking",
  "--disable-password-generation",
  "--disable-save-password-bubble",
  "--disable-translate",
  "--allow-insecure-localhost", // Enables TLS/SSL errors on localhost to be ignored (no interstitial, no blocking of requests).
  //'--reduce-security-for-testing',
  //'--enable-automation',
];

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  if (config.testingType === "component") {
    const { startDevServer } = require("@cypress/webpack-dev-server");

    // Vue's Webpack configuration
    const webpackConfig = require("@vue/cli-service/webpack.config.js");

    on("dev-server:start", (options) =>
      startDevServer({ options, webpackConfig })
    );
  }
  // use without typescript
  // const cucumber = require("cypress-cucumber-preprocessor").default;
  // on("file:preprocessor", cucumber());
  // use with typescript
  // https://github.com/TheBrainFamily/cypress-cucumber-webpack-typescript-example
  // Erreur import et export
  // https://www.it-swarm-fr.com/fr/javascript/cypress-parseerror-import-et-export-peuvent-apparaitre-uniquement-avec-sourcetype-module/807823180/
  const webpack = require("@cypress/webpack-preprocessor");
  const options = {
    webpackOptions: require("../webpack.config.js"),
  };
  on("file:preprocessor", webpack(options));

  // Cypress visual testing
  const getCompareSnapshotsPlugin = require("cypress-visual-regression/dist/plugin");
  getCompareSnapshotsPlugin(on, config);

  // Add custom browsers to Cypress
  //const addCustomBrowsers = require('../config/cypress-custom-browsers')
  //addCustomBrowsers(config)

  on("before:browser:launch", (browser = {}, launchOptions) => {
    console.log(
      "launching browser %s is headless? %s",
      browser.name,
      browser.isHeadless
    );

    console.log(
      "the viewport size is %d x %d",
      config.viewportWidth,
      config.viewportHeight
    );
    const width = 1440;
    const height = 900;
    console.log("setting the browser window size to %d x %d", width, height);

    if (browser.family === "chromium" && browser.name !== "electron") {
      // auto open devtools
      //launchOptions.args.push('--auto-open-devtools-for-tabs')
      //launchOptions.args.push('--start-fullscreen')
      //launchOptions.args.push('--cast-initial-screen-width=' + width)
      //launchOptions.args.push('--cast-initial-screen-height=' + height)
      launchOptions.args.push(`--window-size=${width},${height}`);
      launchOptions.args.push("--force-device-scale-factor=1");
      launchOptions.args.push(options);
      // change download directory
      // https://docs.cypress.io/api/plugins/browser-launch-api.html#Change-download-directory
      // https://github.com/cypress-io/cypress/issues/949
      // répertoire de téléchargement par défaut
      launchOptions.preferences.default.profile = {
        default_content_settings: { popups: 0 },
        default_content_setting_values: { automatic_downloads: 1 },
      };
      launchOptions.preferences.default["download"] = {
        default_directory: downloadPath,
      };

      return launchOptions;
    }

    if (browser.family === "firefox") {
      // auto open devtools
      //launchOptions.args.push('-devtools')
      launchOptions.args.push(`--width=${width}`);
      launchOptions.args.push(`--height=${height}`);
      launchOptions.preferences["browser.download.dir"] = downloadPath;
      launchOptions.preferences["browser.download.folderList"] = 2;
      // needed to prevent download prompt for text/csv files.
      launchOptions.preferences["browser.helperApps.neverAsk.saveToDisk"] =
        "text/csv";

      return launchOptions;
    }
    if (browser.name === "electron") {
      // launchOptions.preferences is a `BrowserWindow` `options` object
      launchOptions.preferences.width = width;
      launchOptions.preferences.height = height;
      //launchOptions.preferences.frame = false
      launchOptions.preferences.useContentSize = true;
      launchOptions.preferences.fullscreen = false;
      //launchOptions.preferences.darkTheme = true

      launchOptions.preferences.webPreferences.session = {
        downloaditem: downloadPath,
      };

      return launchOptions;
    }
  });

  on("after:screenshot", (details) => {
    // /!\ Le nom doit être identique avec celui défini dans support/index.js pour l'inclure dans le rapport de tests
    // /!\ Doit aussi être identique à la regex cucumber-report.js pour les tests feature

    // Type de spec (fichier) : .js ou .feature
    // var specType = details.specName.split('.').pop()
    // Nom de la spec
    var newSpecName = details.specName
      .replace(/^.*[\\\/]/, "")
      .split(".")
      .slice(0, -1);
    // Nom du projet (sesame / b2c / odisea)
    //var app = details.specName.match(/^.*?[^\/]*/)

    // Renomme Screenshot si test non Visual Testing
    // Take snapshots : type=base
    // Test regression : type=actual
    //if (config.env.type == undefined || config.env.hasOwnProperty('type') == false) {
    // Pour tout test failed, renomme le screenshot
    if (details.path.includes("(failed)")) {
      // var newPath = `${config.screenshotsFolder}/${details.specName}/failedTest.png`
      var newPath = `${config.screenshotsFolder}/${details.specName}/${newSpecName[0]} (failed).png`;
      newPath = newPath.replace(/\\/g, "/");

      return new Promise((resolve, reject) => {
        fs.rename(details.path, newPath, (err) => {
          if (err) return reject(err);
          resolve({ path: newPath });
        });
      });
    }
  });

  on("task", {
    getConfiguration(environment) {
      const environments = JSON.parse(
        fs.readFileSync(`./cypress/config/environments.json`)
      );
      config.env.backendUrl = environments[environment].backendUrl;
      config.env.frontendUrl = environments[environment].frontendUrl;

      return config.env;
    },
  });

  on("task", {
    screen({ device, mode }) {
      const devices = JSON.parse(
        fs.readFileSync("./cypress/config/devices.json")
      );
      let d = devices.sizes.hasOwnProperty(device);
      let configOptions =
        d == true
          ? mode != ""
            ? mode == "paysage" && device.includes("iphone")
              ? {
                  viewportWidth: devices.sizes[device].viewportHeight,
                  viewportHeight: devices.sizes[device].viewportWidth,
                  userAgent: devices.sizes[device].useragent,
                }
              : mode == "portrait" && !device.includes("iphone")
              ? {
                  viewportWidth: devices.sizes[device].viewportHeight,
                  viewportHeight: devices.sizes[device].viewportWidth,
                  userAgent: devices.sizes[device].useragent,
                }
              : {
                  viewportWidth: devices.sizes[device].viewportWidth,
                  viewportHeight: devices.sizes[device].viewportHeight,
                  userAgent: devices.sizes[device].useragent,
                }
            : // si viewport trouvé mais sans mode, mode par défaut du device
              {
                viewportWidth: devices.sizes[device].viewportWidth,
                viewportHeight: devices.sizes[device].viewportHeight,
              }
          : // si viewport non trouvé ou non renseigné, mode par défaut
            { viewportWidth: 1280, viewportHeight: 720 };

      config.viewportHeight = configOptions.viewportHeight;
      config.viewportWidth = configOptions.viewportWidth;
      config.userAgent = configOptions.userAgent;

      return config;
    },
  });

  let shouldSkip = false;
  on("task", {
    resetShouldSkipFlag() {
      shouldSkip = false;
      return null;
    },
    shouldSkip(value) {
      if (value != null) shouldSkip = value;
      return shouldSkip;
    },
  });

  on("task", {
    clearFolder(folder) {
      const opsys = process.platform;
      fs.emptyDirSync(folder);
      return [opsys, folder];
    },
  });

  on("task", {
    "db:seed"() {
      const dbSeed = path.join(__dirname, "../../db", "db-seed.json");
      const filePath = path.join(__dirname, "../../db", "db.json");

      return new Promise((resolve, reject) => {
        fs.copyFile(dbSeed, filePath, (err) => {
          if (err) return reject(err);
          resolve("db-seed.json was copied to db.json");
          console.log("db-seed.json was copied to db.json");
        });
      });
    },
  });

  return config;
};
