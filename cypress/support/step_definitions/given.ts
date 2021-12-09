// Cypress reference
/// <reference types="cypress" />

// Typescript & webpack config
// https://github.com/TheBrainFamily/cypress-cucumber-webpack-typescript-example

import { Given } from 'cypress-cucumber-preprocessor/steps'
import { tab } from '../conf/common'
//import { getVar } from '../commands'
const {getVar} = require('../commands.js')

// Définition des conditions de test
Given(/^le navigateur est paramétré pour "(.*?)"$/, d => {
    cy.screen(d).then(() => {
        cy.viewport(Cypress.config('viewportWidth'), Cypress.config('viewportHeight'))
    })
})
Given(/^le navigateur est paramétré pour "(.*?)" en mode "(portrait|paysage)"$/, (d, m) => {
    cy.screen(d, m).then(() => {
        cy.viewport(Cypress.config('viewportWidth'), Cypress.config('viewportHeight'))
    })
})
Given(/^(l'utilisateur|je) teste sur l'environnement (local|internet)$/, (a, environment) => {
    cy.setVar('env', environment)
})

Given(/^(l'utilisateur ouvre|j'ouvre) l'application "(.*?)"$/, (a, website) => {
    cy.environnement(getVar.env).then(url => {
        cy.visit(url)
    })
})
Given(/^(l'utilisateur est|je suis) sur l'onglet "(.*?)"$/, (a, conf) => {
    //cy.get('[data-testid="page-title"]').scrollIntoView().should('have.text', title)
    tab({ title: conf })
    //tab.texte = title
})
