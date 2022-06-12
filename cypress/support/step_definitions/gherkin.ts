// Cypress reference
/// <reference types="cypress" />

// Typescript & webpack config
// https://github.com/TheBrainFamily/cypress-cucumber-webpack-typescript-example

import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import { clic, conference, conferencier, tab, titre } from "../conf/common";

//import { getVar } from '../commands'
const { getVar } = require("../commands.ts");

// Définition des conditions de test
Given(/^le navigateur est paramétré pour "(.*?)"$/, (d) => {
  cy.screen(d).then(() => {
    cy.viewport(
      Cypress.config("viewportWidth"),
      Cypress.config("viewportHeight")
    );
  });
});
Given(
  /^le navigateur est paramétré pour "(.*?)" en mode "(portrait|paysage)"$/,
  (d, m) => {
    cy.screen(d, m).then(() => {
      cy.viewport(
        Cypress.config("viewportWidth"),
        Cypress.config("viewportHeight")
      );
    });
  }
);
Given(
  /^(l'utilisateur|je) teste sur l'environnement (local|internet)$/,
  (a, environment) => {
    cy.setVar("env", environment);
  }
);

Given(/^(l'utilisateur ouvre|j'ouvre) l'application "(.*?)"$/, (a, website) => {
  cy.environnement(getVar.env).then((websiteUrl) => {
    cy.visit(websiteUrl);
  });
});
Given(/^(l'utilisateur est|je suis) sur l'onglet "(.*?)"$/, (a, conf) => {
  //cy.get('[data-testid="page-title"]').scrollIntoView().should('have.text', title)
  tab({ title: conf });
  //tab.texte = title
});

/**
 * When
 */
When(/^(l'utilisateur|je) recherche la conférence "(.*?)"$/, (a, name) => {
  //cy.get('[data-testid="username"]').scrollIntoView().type(name)
  conference({ conf: name });
  //conference.client = name
});
When(/^(l'utilisateur|je) clique sur "(.*?)"$/, (a, clicAction) => {
  //cy.contains(clicAction).click()
  clic({ text: clicAction });
  //clic.bouton = clicAction
});
When(/^(l'utilisateur|je) clique sur la conférence$/, () => {
  clic({ conf: getVar.conference });
});
When(
  /^(l'utilisateur|je) clique sur l'onglet (Conférences|Conférenciers|Carte|A propos)$/,
  (a, tabBar) => {
    tab({ tab: tabBar });
  }
);
When(/^(l'utilisateur|je) clique sur le conférencier "(.*?)"$/, (a, name) => {
  conferencier({ speaker: name });
});

/**
 * Then
 */
Then(/^l'application redirige vers l'onglet "(.*?)"$/, (title) => {
  //cy.get('[data-testid="title-tab"]').scrollIntoView().should('have.text', title)
  titre(title);
  //titre.texte = title
});
Then(/^la conférence est affichée dans le résultat de recherches$/, () => {
  // cy.setVar('orderName', orderName)
  // cy.get('[data-testid="table"]').should('contain', orderName)
  conference({ title: getVar.conference, control: true });
  //conferences.nom = orderName
});
Then(/^le détail de la conférence est affiché$/, () => {
  // cy.setVar('orderName', orderName)
  // cy.get('[data-testid="table"]').should('contain', orderName)
  conference({ detail: getVar.conference, control: true });
  //conferences.nom = orderName
});
Then(/^le profil du conférencier est affiché$/, () => {
  conferencier({ profil: getVar.conferencier, control: true });
});
