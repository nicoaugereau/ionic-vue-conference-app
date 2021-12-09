import { mount } from "@cypress/vue";
import PrivacyPolicyNotice from "./PrivacyPolicy.vue";

describe("PrivacyPolicyNotice", () => {
  it("renders the title", () => {
    //cy.mount(PrivacyPolicyNotice)
    mount(PrivacyPolicyNotice, {
      propsData: {
        msg: "Privacy Policy",
      },
    });

    cy.contains("h1", "Privacy Policy").should("be.visible");
  });

  it('emits a "confirm" event once when confirm button is clicked', () => {
    //cy.mount(PrivacyPolicyNotice)
    mount(PrivacyPolicyNotice, {
      propsData: {
        msg: "Privacy Policy",
      },
    });

    cy.contains("button", /^OK/)
      .click()
      .vue()
      .then((wrapper) => {
        expect(wrapper.emitted("confirm")).to.have.length(1);
      });
  });
});
