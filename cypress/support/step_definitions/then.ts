// Cypress reference
/// <reference types="cypress" />

import { Then } from 'cypress-cucumber-preprocessor/steps'
//import { getVar } from '../commands' // js
const {getVar} = require('../commands.js') // typescript
import { titre, conference, conferencier } from '../conf/common'

Then(/^l'application redirige vers l'onglet "(.*?)"$/, title => {
    //cy.get('[data-testid="title-tab"]').scrollIntoView().should('have.text', title)
    titre(title)
    //titre.texte = title
})
Then(/^la conférence est affichée dans le résultat de recherches$/, () => {
    // cy.setVar('orderName', orderName)
    // cy.get('[data-testid="table"]').should('contain', orderName)
    conference({ title: getVar.conference, control: true })
    //conferences.nom = orderName
})
Then(/^le détail de la conférence est affiché$/, () => {
    // cy.setVar('orderName', orderName)
    // cy.get('[data-testid="table"]').should('contain', orderName)
    conference({ detail: getVar.conference, control: true })
    //conferences.nom = orderName
})
Then(/^le profil du conférencier est affiché$/, () => {
    conferencier({ profil:getVar.conferencier, control: true })
})
