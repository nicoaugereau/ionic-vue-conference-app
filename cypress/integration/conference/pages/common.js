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

class types {
    /* 
        défini l'action à réaliser : saisie ou controle
    */
    get controle() {
        this._controle = true
        this._saisie = false
    }
    get saisie() {
        this._saisie = true
        this._controle = false
    }
}

class clics {
    set tab(label) {
        cy.get('ion-list', { timeout: msTimeout })
            .contains('ion-label', label)
            .click({ multiple: true })
    }
    set text(label) {
        cy.contains(label).click()
    }
}

class tabsBar extends types {
    set title(label) {
        let d = tabs.translate.find(p => p.title === label)
        cy.get(`[data-testid="tab-bar-${d.id}"] ion-label`).should('have.text', d.tab)
    }
    set tab(label) {
        let d = tabs.translate.find(p => p.title === label)
        cy.get('ion-tab-button', { timeout: msTimeout })
            .contains('ion-label', d.tab)
            .click({ multiple: true })
    }
}

class conferences extends types {
    set titre(label) {
        cy.get('ion-item ion-label h3').should('have.text', label)
    }
    set detail(label) {
        cy.get('h1').should('have.text', label)
    }
    set recherche(label) {
        cy.setVar('conference', label)
        cy.get('.searchbar-input').clear()
        cy.get('.searchbar-input').type(label)
    }
}

class conferenciers extends types {
    set titre(label) {
        cy.get('[data-testid="tabs"] ion-toolbar > ion-title.title-md', { timeout: msTimeout }).should('have.text', label)
    }
    set conferencier(label) {
        cy.setVar('conferencier', label)
        cy.get('ion-card-header', { timeout: msTimeout })
            .contains('ion-item', label, { timeout: msTimeout })
            .scrollIntoView()
            .click({ multiple: true })
    }
}

var clic = new clics()
var tabbar = new tabsBar()
var conference = new conferences()
var conferencier = new conferenciers()

module.exports = { types, clic, tabbar, conference, conferencier }
