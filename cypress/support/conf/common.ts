/// <reference types="cypress" />

let msTimeout = Cypress.config('requestTimeout')

const tabs = {
    translate: [
        { title: 'Conférences', tab: 'Schedule', id: 'schedule' },
        { title: 'Conférenciers', tab: 'Speakers', id: 'speakers' },
        { title: 'Carte', tab: 'Map', id: 'map' },
        { title: 'A propos', tab: 'About', id: 'about' }
    ]
}

/**
 * Gestion des titres
 * @param {*} options
 */
export const titre = (options:any) =>{
    // 
}

/**
 * Gestion des clics
 * @param {*} options
 */
export const clic = (options:any) => {
    if (options.conf) {
        cy.get('ion-list', { timeout: msTimeout })
            .contains('ion-label', options.conf)
            .click({ multiple: true })
    }
    if (options.text) cy.contains(options).click()
}

/**
 * Gestion des tabs
 * @param {*} options
 */
export const tab = (options:any) => {
    if (options.title) {
        let d = tabs.translate.find(p => p.title === options.title)
        cy.get(`[data-testid="tab-bar-${d.id}"] ion-label`).should('have.text', d.tab)
    }
    if (options.tab) {
        let d = tabs.translate.find(p => p.title === options.tab)
        cy.get('ion-tab-button', { timeout: msTimeout })
            .contains('ion-label', d.tab)
            .click({ multiple: true })
    }
}

/**
 * Onglet Conférences
 * @param {*} options
 */
export const conference = (options:any) => {
    if (options.conf) {
        cy.setVar('conference', options.conf)
        cy.get('.searchbar-input').clear()
        cy.get('.searchbar-input').type(options.conf)
    }
    if (options.control) {
        if (options.title) cy.get('ion-item ion-label h3').should('have.text', options.title)
        if (options.detail) cy.get('h1').should('have.text', options.detail)
    }
}

/**
 * Onglet conférenciers
 */
export const conferencier = (options:any) => {
    if (options.control) cy.get('[data-testid="tabs"] ion-toolbar > ion-title.title-md', { timeout: msTimeout }).should('have.text', options.profil)
    if (options.speaker) {
        cy.setVar('conferencier', options.speaker)
        cy.get('ion-card-header', { timeout: msTimeout })
            .contains('ion-item', options.speaker)
            .should('be.visible')
            .scrollIntoView()
            .then($el=>{
                cy.wait(500)
                cy.wrap($el).click({ multiple: true, force:true })
            })
    }
}
