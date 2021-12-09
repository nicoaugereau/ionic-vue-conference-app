// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// https://css-tricks.com/testing-vue-components-with-cypress/
import { mount } from "@cypress/vue"; // the Cypress mount function, which wraps the vue-test-utils mount function
//import Vue from "vue";
//import Vuetify from 'vuetify/lib/framework'

//Vue.use(Vuetify)

Cypress.Commands.add("mount", (MountedComponent, options) => {
  // get the element that our mounted component will be injected into
  const root = document.getElementById("__cy_root");
  root.setAttribute("style", "display: block");

  // add the v-application class that allows Vuetify styles to work
  if (!root.classList.contains("v-application")) {
    root.classList.add("v-application");
  }

  // add the data-attribute - Vuetify selector used for popup elements to attach to the DOM
  root.setAttribute("data-app", "true");

  return mount(MountedComponent, {
    vuetify: new Vuetify({}),
    ...options,
  });
});

Cypress.Commands.add("vue", () => {
  return cy.wrap(Cypress.vueWrapper);
});

/**
 * Commandes personnalisées
 *
 * Ajouter const { getVar, getElement } = require('support/commands.js')
 *
 * Usage :
 * cy.setVar('nomVariable', valeur)
 * console.log(getVar.nomVariable)
 *
 * cy.title().setElement('nomElement')
 * cy.get('.my-element').constains(getElement.nomElement)
 */
// Sauve une donnée en variable
export const getVar = {};
Cypress.Commands.add("setVar", (name, value) => {
  if (value) {
    getVar[name] = value;
  }
  return getVar[name];
});
// Sauve les données d'un élément
export const getElement = {};
Cypress.Commands.add("setElement", { prevSubject: true }, (value, propName) => {
  console.log("setElement", value, propName);
  getElement[propName] = value;
  return value;
});

const VISIT_DELAY = Cypress.env("VISIT_DELAY") || 0;
if (VISIT_DELAY > 0) {
  Cypress.Commands.overwrite("visit", (originalFn, ...args) => {
    const origVal = originalFn(...args);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(origVal);
      }, VISIT_DELAY);
    });
  });
}
const COMMAND_DELAY = Cypress.env("COMMAND_DELAY") || 0;
if (COMMAND_DELAY > 0) {
  for (const command of [
    "click",
    "trigger",
    "type",
    "clear",
    "reload",
    "contains",
  ]) {
    Cypress.Commands.overwrite(command, (originalFn, ...args) => {
      const origVal = originalFn(...args);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(origVal);
        }, COMMAND_DELAY);
      });
    });
  }
}
/**
 * Configuration de l'environnement de test
 */
Cypress.Commands.add("environnement", (env) => {
  cy.task("getConfiguration", env).then((c) => {
    cy.setVar("env", c.env);
    cy.setVar("backendUrl", c.backendUrl);
    cy.setVar("frontendUrl", c.frontendUrl);
  });
});
/**
 * Configuration du navigateur en mode mobile
 */
Cypress.Commands.add("screen", (device, mode = null) => {
  return cy.task("screen", { device: device, mode: mode }).then((d) => {
    Cypress.config("viewportHeight", d.viewportHeight);
    Cypress.config("viewportWidth", d.viewportWidth);
    Cypress.config("userAgent", d.userAgent);
    return d;
  });
});
