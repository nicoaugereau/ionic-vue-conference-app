/// <reference types="cypress" />

import {
  clic,
  tab,
  conference,
  conferencier,
} from "../../../support/conf/common";

//** INPUTS du cas de test **//
//** -_-_-_-_-_-_-_-_-_-_- **//
const environment = "local";
const scheduleName = "The evolution of Ionicons";
const speakerName = "Burt Bear";
//** -_-_-_-_-_-_-_-_-_-_- **//

describe(`Recherches`, () => {
  beforeEach(function () {
    cy.viewport("iphone-x");
    cy.environnement(environment).then((url) => {
      cy.visit(url.frontendUrl);
    });
    tab({ title: "Conférences" });
  });

  it("Rechercher un évenement", function () {
    conference({ conf: scheduleName });
    conference({ title: scheduleName, control: true });
    clic({ conf: scheduleName });
    conference({ detail: scheduleName, control: true });
  });

  it(`Rechercher un conférencier`, () => {
    tab({ tab: "Conférenciers" });
    conferencier({ speaker: speakerName });
    conferencier({ profil: speakerName, control: true });
  });
});
