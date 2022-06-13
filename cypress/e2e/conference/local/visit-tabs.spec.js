/// <reference types="cypress" />

let msTimeout = Cypress.config("requestTimeout");

//** INPUTS du cas de test **//
//** -_-_-_-_-_-_-_-_-_-_- **//
const environment = "local";
//** -_-_-_-_-_-_-_-_-_-_- **//

describe(`Controles des éléments`, () => {
  beforeEach(function () {
    cy.environnement(environment).then((url) => {
      cy.visit(url.frontendUrl);
    });
  });

  it("Contrôles des onglets", function () {
    // Tab Schedule
    cy.get('[data-testid="tab-bar-schedule"]').should(
      "have.class",
      "tab-selected"
    );
    cy.get('[data-testid="tab-bar-schedule"]').should("be.visible");
    cy.get('[data-testid="tab-bar-schedule"]').should("have.text", "Schedule");
    cy.get('[value="all"]').should("be.visible");
    cy.get('[value="all"]').should("not.be.checked");
    cy.get('[value="favorites"]').should("be.visible");
    cy.get('[value="favorites"]').should("not.be.checked");

    // Tab Speakers
    cy.get('[data-testid="tab-bar-speakers"] > .sc-ion-label-md-h').click();
    cy.get('[data-testid="tab-bar-speakers"]').should(
      "have.class",
      "tab-selected"
    );
    cy.get('[data-testid="tab-bar-speakers"]').should("be.visible");
    cy.get('[data-testid="tab-bar-speakers"]').should("have.text", "Speakers");
    cy.get('[data-testid="title-speakers"]').should("have.text", "Speakers");
    cy.get('[align-items-stretch=""] > :nth-child(1)').should("be.visible");

    // Tab Map
    cy.get('[data-testid="tab-bar-map"] > ion-icon.hydrated').click();
    cy.get('[data-testid="tab-bar-map"]').should("have.class", "tab-selected");
    cy.get('[data-testid="tab-bar-map"]').should("be.visible");
    cy.get('[data-testid="tab-bar-map"]').should("have.text", "Map");
    cy.get('[data-testid="title-map"]').should("have.text", "Map");

    // Tab About
    cy.get('[data-testid="tab-bar-about"]').click();
    cy.get('[data-testid="tab-bar-about"]').should(
      "have.class",
      "tab-selected"
    );
    cy.get('[data-testid="tab-bar-about"]').should("be.visible");
    cy.get('[data-testid="tab-bar-about"]').should("have.text", "About");
    cy.get('[data-testid="title-about"]').should("have.text", "About");
    cy.get("h4").should("have.text", "Ionic Conference");
  });

  it(`Filtrer sur un évenement`, () => {
    cy.get(".searchbar-input").clear();
    cy.get(".searchbar-input").type("migrating");

    cy.get("h3").should("have.text", "Migrating to Ionic2");
    cy.get("ion-item-sliding.hydrated > .in-list > .sc-ion-label-md-h").should(
      "be.visible"
    );

    cy.get("h3").click();
    cy.get("h1").should("have.text", "Migrating to Ionic2");
    cy.get(".icon-heart-empty").should("have.class", "icon-heart-empty");
  });
});
