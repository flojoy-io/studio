/// <reference types="cypress" />

describe("Verify Keyboard shortcut modal", () => {
  // The interactions use typical Cypress calls,
  // but the verifications use one-line snapshot calls with Applitools Eyes.
  // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
  // Traditional assertions that scrape the page for text values are not needed here.

  it("keyboard shortcut test", () => {
    cy.visit("/").wait(1000);

    // Click settings button
    cy.get('[data-testid="settings-btn"]').click();

    // Select Keyboard shortcut option
    cy.get('[data-testid="btn-keyboardshortcut"]').click();

    cy.percySnapshot("dark flow page with keyboardshorcut modal");

    cy.get('button:contains("x")').click({ force: true });

    // Switch to light mode and test the same thing
    cy.get('[data-testid="darkmode-toggle"]').click();

    cy.get('[data-testid="settings-btn"]').click();

    cy.get('[data-testid="btn-keyboardshortcut"]').click();

    cy.percySnapshot("light flow page with keyboardshorcut modal");
  });
});
