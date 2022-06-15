/// <reference types="cypress" />
/// <reference path="../../cypress/support/component.ts" />
import Button from "./Button.vue";

describe("Button", () => {
  it("should mount", () => {
    cy.mount(Button, {
      slots: {
        default: "Click Me",
      },
    });

    cy.get("button").contains("Click Me");
  });

  it("when button is clicked, should call onClick", () => {
    cy.mount(Button, {
      // propsData: {
      //   onClick: cy.spy().as("onClick"),
      // },
      slots: {
        default: "Click Me",
      },
    });
    //const spy = cy.spy(eventNames);
    //Cypress.vue.$on("click", spy);
    const EventEmitter = require("events");
    const myEE = new EventEmitter();
    myEE.on("click", () => {});

    cy.get("button")
      .contains("Click Me")
      .click()
      .then(() => {
        expect(myEE.eventNames()).to.have.length(1);
        //expect(spy).to.be.calledOnce;
      });
    // cy.get('@wrapper').invoke('emitted', 'click').should('have.length', 1)
    // cy.get('@click').should('have.been.called');
  });
});
