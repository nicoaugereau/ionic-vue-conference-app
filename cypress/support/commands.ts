/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
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
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

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

declare global {
  namespace Cypress {
    interface Chainable {
      environnement(env: string): Chainable<void>;
      screen(device: string, mode?: string): Chainable<any>;
      setVar(name: string, value: string): Chainable<any>;
      setElement(value: string, propName: string): Chainable<any>;
    }
  }
}

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
export const getVar: any = {};
Cypress.Commands.add("setVar", (name: string, value) => {
  if (value) {
    getVar[name] = value;
  }
  return getVar[name];
});
// Sauve les données d'un élément
export const getElement: any = {};
Cypress.Commands.add("setElement", { prevSubject: true }, (value, propName) => {
  console.log("setElement", value, propName);
  getElement[propName] = value;
  return value;
});

/**
 * Configuration de l'environnement de test
 */
Cypress.Commands.add("environnement", (env) => {
  cy.task("getConfiguration", env).then((c: any) => {
    cy.setVar("env", c.env);
    cy.setVar("backendUrl", c.backendUrl);
    cy.setVar("frontendUrl", c.frontendUrl);
  });
});
/**
 * Configuration du navigateur en mode mobile
 */
Cypress.Commands.add("screen", (device, mode: any = null) => {
  return cy.task("screen", { device: device, mode: mode }).then((d: any) => {
    Cypress.config("viewportHeight", d.viewportHeight);
    Cypress.config("viewportWidth", d.viewportWidth);
    //Cypress.config("userAgent", d.userAgent);
    return d;
  });
});
