import { defineConfig } from "cypress";
//import webpackConfig from "./cypress/webpack.config";
//const webpackConfig = require("@vue/cli-service/webpack.config.js");
// const webpack = require("@cypress/webpack-dev-server");
// const webpackConfigOptions = {
//   module: {
//     rules: [
//       {
//         test: /\.vue$/,
//         loader: "vue-loader",
//       },
//     ],
//   },
// };
// const options = {
//   // send in the options from your webpack.config.js, so it works the same
//   // as your app's code
//   webpackConfigOptions,
//   watchOptions: {},
// };

export default defineConfig({
  projectId: "conference-app",
  env: {
    COMMAND_DELAY: 50,
    VISIT_DELAY: 2000,
  },
  defaultCommandTimeout: 4000,
  execTimeout: 60000,
  taskTimeout: 60000,
  pageLoadTimeout: 60000,
  requestTimeout: 5000,
  responseTimeout: 30000,
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    configFile: "reporter-config.json",
  },
  video: false,
  videoUploadOnPasses: false,
  trashAssetsBeforeRuns: true,
  chromeWebSecurity: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx,feature,features}",
  },
  component: {
    devServer: {
      framework: "vue-cli",
      bundler: "webpack",
      //webpackConfig,
    },
    setupNodeEvents(on, config) {
      //on("dev-server:start", webpack(options));
    },
    specPattern: "src/**/*.cy.{js,ts,jsx,tsx}",
  },
});
