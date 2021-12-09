// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.on('test:after:run', (test, runnable) => {
    // Ajoute la capture ecran si failed
    if (test.state === 'failed') {
        const specType = Cypress.spec.name.split('.').pop()
        /**
         * Ajoute le contexte au fichier json de reporting Mochawesome
         */
        if (specType == 'js') {
            const addContext = require('mochawesome/addContext')
            // /!\ Le nom doit être identique avec celui défini dans plugins/index.js pour l'inclure dans le rapport de tests
            // - Nommage du nom par défaut :
            // const screenshot = `${Cypress.config('screenshotsFolder')}/${Cypress.spec.name}/${runnable.parent.title} -- ${test.title} (failed).png`;
            // - Renommange du nom par le nom du test (step)
            // var screenshot = `${Cypress.config('screenshotsFolder')}/${Cypress.spec.name}/${test.title}.png`
            // - Renommange du nom en 'failedTest.png' car nom par défaut pose problème si caractères accentués, spéciaux...
            //var screenshot = `${Cypress.config('screenshotsFolder')}/${Cypress.spec.name}/failedTest.png`
            // - Renommange du nom avec le nom de la spec (fichier)
            var specName = Cypress.spec.name.match(/([^\/]+)(?=\.\w+$)/)[0]
            // var newSpecName = Cypress.spec.name
            //     .replace(/^.*[\\\/]/, '')
            //     .split('.')
            //     .slice(0, -1)

            var screenshot = `${Cypress.config('screenshotsFolder')}/${Cypress.spec.name}/${specName} (failed).png`
            screenshot = screenshot.replace(/\\/g, '/')
            // if (Cypress.env('ci-build-id') != null) {
            //     screenshot =
            //         `https://jenkins.internal.XXX.com/job/TEAM_NAME/job/APP_NAME/job/master/${Cypress.env('ci-build-id')}/artifact/` + screenshot.split('/').slice(6).join('/')
            // }
            addContext({ test }, screenshot)
        }
    }
})
Cypress.on('fail', (error, runnable) => {
    //debugger
    // we now have access to the err instance
    // and the mocha runnable this failed on
    throw error // throw error to have test still fail
})
Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})

/**
 * Arreter ou continuer le test si echec
 * https://stackoverflow.com/questions/58657895/is-there-a-reliable-way-to-have-cypress-exit-as-soon-as-a-test-fails
 */
function abortEarly() {
    if (this.currentTest.state === 'failed') {
        cy.getCookie('shouldSkip').then(cookie => {
            if (cookie == null || cookie.value === 'true') {
                debugger
                return cy.task('shouldSkip', true)
            }
        })
    }
    cy.task('shouldSkip').then(value => {
        if (value) this.skip()
    })
}

/**
 * Voir cette solution si besoin ajout autres spécificités dans beforeEach et afterEach
 * https://medium.com/@rajneesh.m49/skipping-cypress-tests-on-first-failure-and-saving-resources-2c63e3bb0705
 */
beforeEach(abortEarly)
afterEach(abortEarly)

before(() => {
    Cypress.Cookies.debug(true)
    // Preserve cookies in every test
    //Cypress.Cookies.defaults({preserve:  ['shouldSkip', 'heuresMinutes']})
    Cypress.Cookies.defaults({
        preserve: cookie => {
            console.log(cookie)
            return true
        }
    })
    cy.task('resetShouldSkipFlag')
    //Clear downloads folder
    cy.task('clearFolder', 'cypress/downloads')
    //cy.task('db:seed')
})

after(() => {
    cy.clearCookies()
})
