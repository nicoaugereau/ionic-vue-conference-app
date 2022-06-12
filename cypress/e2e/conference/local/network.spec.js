/// <reference types="cypress" />

import { getVar } from '../../../support/commands'

describe('Mock et erreurs réseau', () => {
    const environment = 'local'
    const errorMsg = 'Oops! Notre site est momentanément indisponible. Revenez un peu plus tard.'

    it('Le site est en ligne', () => {
        cy.environnement(environment).then(url => {
            cy.setVar('url', url)
            cy.visit(url)
        })
        cy.get('[data-testid="tab-schedule"]').should('be.visible')
    })

    it('Le site est en ligne mais avec des lenteurs réseau', () => {
        /**
         * Preset,download(kb/s),upload(kb/s),RTT(ms)
         * GPRS,50,20,500
         * Regular 2G,250,50,300
         * Good 2G,450,150,150
         * Regular 3G,750,250,100
         * Good 3G, 1000,750,40
         * Regular 4G, 4000,3000,20
         * DSL 2000, 1000,5
         * WiFi 30000,15000,2
         */
        cy.intercept('GET', '/data/*', req => {
            req.reply({ delay: 500, throttleKbps: 50 }) // milliseconds // to simulate a GPRS connection
        }).as('slowNetwork')

        cy.visit(getVar.url)

        cy.wait('@slowNetwork')
        cy.get('[data-testid="tab-schedule"]').should('be.visible')
    })

    it('Simuler une erreur serveur', () => {
        cy.intercept('GET', '/data/*', { statusCode: 500, body: 'Server error', headers: { 'x-not-found': 'true' } }).as('getServerFailure')

        cy.visit(getVar.url)

        cy.wait('@getServerFailure')
        cy.get('@getServerFailure').then(res=>{
            expect(res.response.statusCode).eq(500)
        })
    })

    it('Simuler une erreur réseau', () => {
        cy.intercept('GET', '/data/*', { forceNetworkError: true }).as('getNetworkFailure')

        cy.visit(getVar.url)

        cy.wait('@getNetworkFailure')
        cy.wait('@getNetworkFailure').then(res=>{
            expect(res.error.name).eq('Error')
        })
    })

    it('Mock des données Schedules et Speakers', () => {
        // Schedule Tab
        cy.intercept('GET', '/data/sessions*', { fixture: 'mock-sessions.json' }).as('mockSessionList')
        cy.intercept('GET', '/data/speakers*', { fixture: 'mock-speakers.json' }).as('mockSpeakersList')
        cy.visit(getVar.url)

        cy.wait('@mockSessionList')

        //cy.contains('Speakers').click()
        cy.wait(5000)

        // Speakers Tab
        cy.get('[data-testid="tab-bar-speakers"] > .sc-ion-label-md-h').click()
        cy.wait('@mockSpeakersList')

        cy.contains('Speakers').click()
    })
})
