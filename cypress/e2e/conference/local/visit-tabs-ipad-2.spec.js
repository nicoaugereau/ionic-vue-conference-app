/// <reference types="cypress" />

let msTimeout = Cypress.config('requestTimeout')

//** INPUTS du cas de test **//
//** -_-_-_-_-_-_-_-_-_-_- **//
const environment = 'local'
//** -_-_-_-_-_-_-_-_-_-_- **//

const openMenuList = () => {
    cy.wait(500)
    cy.get('ion-header', { timeout: msTimeout }).should('be.visible')
    // burger menu
    cy.get('ion-header ion-toolbar').then($el => {
        if (!$el.is('ion-title:visible')) {
            cy.get('ion-header ion-toolbar ion-menu-button', { timeout: msTimeout }).click({ multiple: true })
            cy.wait(500)
        }
    })
}

describe(`Controles des éléments`, () => {
    beforeEach(function() {
        cy.viewport('ipad-2')
        cy.environnement(environment).then(url => {
            cy.visit(url)
        })
    })

    it('Contrôles des onglets', function() {
        // Tab Schedule
        cy.get('[data-testid="tab-bar-schedule"]').should('have.class', 'tab-selected')
        cy.get('[data-testid="tab-bar-schedule"]').should('be.visible')
        cy.get('[data-testid="tab-bar-schedule"]').should('have.text', 'Schedule')
        cy.get('[value="all"]').should('be.visible')
        cy.get('[value="all"]').should('not.be.checked')
        cy.get('[value="favorites"]').should('be.visible')
        cy.get('[value="favorites"]').should('not.be.checked')

        // Tab Speakers
        cy.get('[data-testid="tab-bar-speakers"] > .sc-ion-label-md-h').click()
        cy.get('[data-testid="tab-bar-speakers"]').should('have.class', 'tab-selected')
        cy.get('[data-testid="tab-bar-speakers"]').should('be.visible')
        cy.get('[data-testid="tab-bar-speakers"]').should('have.text', 'Speakers')
        cy.get('[data-testid="title-speakers"]').should('have.text', 'Speakers')
        cy.get('[align-items-stretch=""] > :nth-child(1)').should('be.visible')

        // Tab Map
        cy.get('[data-testid="tab-bar-map"] > ion-icon.hydrated').click()
        cy.get('[data-testid="tab-bar-map"]').should('have.class', 'tab-selected')
        cy.get('[data-testid="tab-bar-map"]').should('be.visible')
        cy.get('[data-testid="tab-bar-map"]').should('have.text', 'Map')
        cy.get('[data-testid="title-map"]').should('have.text', 'Map')

        // Tab About
        cy.get('[data-testid="tab-bar-about"]').click()
        cy.get('[data-testid="tab-bar-about"]').should('have.class', 'tab-selected')
        cy.get('[data-testid="tab-bar-about"]').should('be.visible')
        cy.get('[data-testid="tab-bar-about"]').should('have.text', 'About')
        cy.get('[data-testid="title-about"]').should('have.text', 'About')
        cy.get('h4').should('have.text', 'Ionic Conference')
    })

    it(`Test navigation gauche`, () => {
        openMenuList()
        cy.get('[data-testid="nav-list"]', { timeout: msTimeout })
            .contains('ion-label', 'Speakers')
            .click({ multiple: true })
        cy.get('[data-testid="title-speakers"]', { timeout: msTimeout })
            .should('be.visible')
            .should('have.text', 'Speakers')

        openMenuList()
        cy.get('[data-testid="nav-list"]', { timeout: msTimeout })
            .contains('ion-label', 'Map')
            .click({ multiple: true })
        cy.get('[data-testid="title-map"]', { timeout: msTimeout })
            .should('be.visible')
            .should('have.text', 'Map')

        openMenuList()
        cy.get('[data-testid="nav-list"]', { timeout: msTimeout })
            .contains('ion-label', 'About')
            .click({ multiple: true })
        cy.get('[data-testid="title-about"]', { timeout: msTimeout })
            .should('be.visible')
            .should('have.text', 'About')

        openMenuList()
        cy.get('[data-testid="nav-list"]', { timeout: msTimeout })
            .contains('ion-label', 'Schedule')
            .click({ multiple: true })
        cy.get('ion-segment-button', { timeout: msTimeout })
            .should('be.visible')
            .should('have.lengthOf', 2)
    })

    it(`Filtrer sur un évenement`, () => {
        cy.get('.searchbar-input').clear()
        cy.get('.searchbar-input').type('migrating')

        cy.get('h3').should('have.text', 'Migrating to Ionic2')
        cy.get('ion-item-sliding.hydrated > .in-list > .sc-ion-label-md-h').should('be.visible')

        cy.get('h3').click()
        cy.get('h1').should('have.text', 'Migrating to Ionic2')
        cy.get('.icon-heart-empty').should('have.class', 'icon-heart-empty')
    })
})
