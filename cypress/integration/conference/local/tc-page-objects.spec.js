/// <reference types="cypress" />

//import { clic, tabbar, conference, conferencier } from '../pages/common'
const { clic, tabbar, conference, conferencier } = require('../pages/common')

//** INPUTS du cas de test **//
//** -_-_-_-_-_-_-_-_-_-_- **//
const environment = 'local'
const scheduleName = 'The evolution of Ionicons'
const speakerName = 'Burt Bear'
//** -_-_-_-_-_-_-_-_-_-_- **//

describe(`Recherches`, () => {
    beforeEach(function() {
        cy.viewport('iphone-x')
        cy.environnement(environment).then(url => {
            cy.visit(url)
        })
        tabbar.tab = 'Conférences'
    })

    it('Rechercher un évenement', function() {
        conference.recherche = scheduleName
        conference.controle
        conference.titre = scheduleName
        clic.tab = scheduleName
        conference.detail = scheduleName
    })

    it(`Rechercher un conférencier`, () => {
        tabbar.tab = 'Conférenciers'
        conferencier.conferencier = speakerName
        conferencier.titre = speakerName
    })
})
