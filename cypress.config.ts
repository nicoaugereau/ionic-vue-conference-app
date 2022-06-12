import { defineConfig } from "cypress";
import webpackConfig from "./cypress/webpack.config";

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
      framework: "vue",
      bundler: "webpack",
      webpackConfig,
    },
    setupNodeEvents(on, config) {},
    specPattern: "src/**/*.spec.ct.{js,ts,jsx,tsx}",
  },
});
