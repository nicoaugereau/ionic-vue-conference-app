/// <reference types="cypress" />
/// <reference path="../../cypress/support/component.ts" />
//import { mount } from "@cypress/vue";
import { props } from "cypress/types/bluebird";
import TableList from "./TableList.vue";

describe("Contact form test", () => {
  it("Show the Contact Form", () => {
    cy.mount(TableList, { props: { title: "Table list" } });
    cy.get("h2").contains("Table list");
  });

  it("shows the header", () => {
    cy.mount(TableList);
    cy.get('[placeholder="name"]').type("Peter");
    cy.get('[placeholder="phone number"]').type("Parker");
    cy.get(".bg-gray-800").click();

    cy.get(".bg-gray-800").should("be.visible");
    cy.get(".text-blue-600").should("contain", "Peter");
    cy.get(".text-blue-700").should("contain", "Parker");
  });
});
