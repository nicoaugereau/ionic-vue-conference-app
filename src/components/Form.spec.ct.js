import { mount } from '@cypress/vue'
import Form from './Form.vue'

describe("Contact form test", () => {

    it('Show the Contact Form', () => {
        mount(Form)
        cy.get('h2').contains('Contact form')
    })

    it('shows the header', () => {
        mount(Form)
        cy.get('[placeholder="name"]').type('Peter')
        cy.get('[placeholder="phone number"]').type('Parker')
        cy.get('.bg-gray-800').click()

        cy.get('.bg-gray-800').should('be.visible')
        cy.get('.text-blue-600').should('contain', 'Peter')
        cy.get('.text-blue-700').should('contain', 'Parker')
    })
})