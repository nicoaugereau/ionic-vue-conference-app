// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
        environnement(env: string): Chainable<any>
        screen(device: string, mode?: string): Chainable<any>
        setVar(variable:string, value:string):Chainable<any>
    }
}
