/// <reference types="cypress" />
/// <reference path="../../cypress/support/component.ts" />

import LoginForm from "./LoginForm.vue";

describe("LoginForm", () => {
  it("should mount the component", () => {
    cy.mount(LoginForm);
  });

  it("should have password input of type password", () => {
    cy.mount(LoginForm);
    cy.contains("Password")
      .find("input")
      .should("have.attr", "type", "password");
  });

  it("should render title with default text", () => {
    cy.mount(LoginForm);
    cy.get("h2").should("have.text", "Log In");
  });

  it("should render title with specified text", () => {
    const title = "Please Authenticate";
    cy.mount(LoginForm, {
      propsData: {
        title,
      },
    });
    cy.get("h2").should("have.text", title);
  });

  describe("form tests", () => {
    const username = "testuser123";
    const password = "s3cret";

    beforeEach(() => {
      const onLoginSpy = cy.spy().as("onLoginSpy");
      const EventEmitter = require("events");
      const onLogin = new EventEmitter();
      onLogin.on("click", () => {});
      cy.wrap(onLogin.eventNames()).as("onLogin");

      cy.mount(LoginForm, {
        propsData: {
          onLogin: onLoginSpy,
        },
      });

      cy.contains("Username").find("input").as("usernameInput");
      cy.contains("Password").find("input").as("passwordInput");
      cy.get("button").contains("Login").as("loginButton");
    });

    it("should call onLogin with username and password when the Login button is clicked", () => {
      cy.get("@usernameInput").type(username);
      cy.get("@passwordInput").type(password);
      cy.get("@loginButton").click();
      cy.get("@onLogin").then((res) => {
        console.log(res);
        expect(res).have.length(1);
      });
      cy.get("@onLoginSpy").should("have.been.calledWith", {
        username,
        password,
      });
    });

    it("should call onLogin with username and password when enter is pressed in an input", () => {
      cy.get("@usernameInput").type(username);
      cy.get("@passwordInput").type(password).type("{enter}");
      cy.get("@onLogin").then((res) => {
        console.log(res);
        expect(res).have.length(1);
      });
      cy.get("@onLoginSpy").should("have.been.calledWith", {
        username,
        password,
      });
    });

    it("should show both validation errors if login is attempted without entering username or password", () => {
      cy.get("@loginButton").click();
      cy.contains("Username is required");
      cy.contains("Password is required");
      cy.get("@onLogin").then((res) => {
        console.log(res);
        expect(res).have.length(1);
      });
      cy.get("@onLoginSpy").should("not.have.been.called");
    });

    it("should only show password validation error if login is attempted without entering password", () => {
      cy.get("@usernameInput").type(username);
      cy.get("@loginButton").click();
      cy.contains("Username is required").should("not.exist");
      cy.contains("Password is required");
      cy.get("@onLogin").then((res) => {
        console.log(res);
        expect(res).have.length(1);
      });
      cy.get("@onLoginSpy").should("not.have.been.called");
    });

    it("should only show username validation error if login is attempted without entering username", () => {
      cy.get("@passwordInput").type(password);
      cy.get("@loginButton").click();
      cy.contains("Username is required");
      cy.contains("Password is required").should("not.exist");
      cy.get("@onLogin").then((res) => {
        console.log(res);
        expect(res).have.length(1);
      });
      cy.get("@onLoginSpy").should("not.have.been.called");
    });

    it("should not show any validation errors before login is attempted", () => {
      cy.contains("Username is required").should("not.exist");
      cy.contains("Password is required").should("not.exist");
    });
  });
});
