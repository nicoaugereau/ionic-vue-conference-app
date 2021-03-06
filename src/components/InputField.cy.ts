/// <reference types="cypress" />
/// <reference path="../../cypress/support/component.ts" />
import InputField from "./InputField.vue";

describe("InputField", () => {
  it("should mount with label", () => {
    cy.mount(InputField, {
      propsData: {
        name: "name",
        label: "Name",
        requiredMessage: "Name is required",
        submitted: false,
      },
    });
    cy.get("label").contains("Name");
  });

  it("when there is no value and form is submitted, should show a required message", () => {
    cy.mount(InputField, {
      propsData: {
        name: "name",
        label: "Name",
        value: "",
        requiredMessage: "Name is required",
        submitted: true,
      },
    });
    cy.contains("Name is required");
  });
});
