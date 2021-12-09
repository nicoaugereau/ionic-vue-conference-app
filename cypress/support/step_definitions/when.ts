// Cypress reference
/// <reference types="cypress" />

import { When } from 'cypress-cucumber-preprocessor/steps'
//import { getVar } from '../commands' // js
const {getVar} = require('../commands.js') // typescript

import { clic, tab, conference, conferencier } from '../conf/common'

When(/^(l'utilisateur|je) recherche la conférence "(.*?)"$/, (a, name) => {
    //cy.get('[data-testid="username"]').scrollIntoView().type(name)
    conference({ conf: name })
    //conference.client = name
})
When(/^(l'utilisateur|je) clique sur "(.*?)"$/, (a, clicAction) => {
    //cy.contains(clicAction).click()
    clic({ text: clicAction })
    //clic.bouton = clicAction
})
When(/^(l'utilisateur|je) clique sur la conférence$/, () => {
    clic({ conf: getVar.conference })
})
When(/^(l'utilisateur|je) clique sur l'onglet (Conférences|Conférenciers|Carte|A propos)$/, (a, tabBar) => {
    tab({ tab: tabBar })
})
When(/^(l'utilisateur|je) clique sur le conférencier "(.*?)"$/, (a, name) => {
    conferencier({ speaker: name })
})
