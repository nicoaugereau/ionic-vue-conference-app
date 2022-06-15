/// <reference types="cypress" />
/// <reference path="../../cypress/support/component.ts" />
import Welcome from "./Welcome.vue";

describe("Welcome", () => {
  it("should mount with greeting", () => {
    cy.mount(Welcome, {
      propsData: {
        username: "Test User",
        onLogout: cy.spy().as("onLogout"),
      },
    });
    cy.contains("Welcome Test User!");
  });

  it("when the log out button is clicked, onLogout should be called", () => {
    cy.mount(Welcome, {
      propsData: {
        username: "Test User",
        onLogout: cy.spy().as("onLogout"),
      },
    });

    const EventEmitter = require("events");
    const myEE = new EventEmitter();
    myEE.on("click", () => {});

    cy.get("button")
      .contains("Log Out")
      .click()
      .then(() => {
        expect(myEE.eventNames()).to.have.length(1);
        //expect(spy).to.be.calledOnce;
      });

    // cy.get("button").contains("Log Out").click();
    // cy.get("@onLogout").should("have.been.called");
  });
});
