/// <reference types="cypress" />

describe("studio", () => {
  // This method performs setup before each test.
  beforeEach(() => {
    // Open Eyes to start visual testing.
    // Each test should open its own Eyes for its own snapshots.
    cy.eyesOpen({
      // The name of the application under test.
      // All tests for the same app should share the same app name.
      // Set this name wisely: Applitools features rely on a shared app name across tests.
      appName: "studio",

      // The name of the test case for the given application.
      // Additional unique characteristics of the test may also be specified as part of the test name,
      // such as localization information ("Home Page - EN") or different user permissions ("Login by admin").
      testName: Cypress.currentTest.title,
    });
  });

  // The interactions use typical Cypress calls,
  // but the verifications use one-line snapshot calls with Applitools Eyes.
  // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
  // Traditional assertions that scrape the page for text values are not needed here.

  it("node edit modal/menu test", () => {
    cy.visit("/").wait(1000);

    // Click clear canvas button
    cy.get(
      '[data-testid="rf__node-SINE-2cd08316-0a0c-4c13-9b1d-382ba4d74cbd"]'
    ).click();

    cy.get('[data-testid="node-edit-modal-params"]').should("have.length", 5);

    cy.get('[data-testid="float-input"]').each(($element) => {
      cy.get($element).type(3);
    });

    cy.get('[data-testid="select-input"]').each(($element) => {
      cy.get($element).click();
      cy.contains("div", "square").click();
    });

    cy.get('[data-testid="node-edit-modal-close-btn"]').click();

    cy.get('[data-testid="clear-canvas-button"]').click();

    cy.get('[data-testid="add-node-button"]').click();

    cy.get('[data-testid="sidebar-input"]').type("argrelmax");

    cy.get("button").contains("ARGRELMAX").click();

    cy.get('[data-testid="sidebar-close"]').click();

    cy.get('[data-testid="data-label-design"]').contains("ARGRELMAX").click();

    cy.get('[data-testid="int-input"]').each(($element) => {
      cy.get($element).type(3);
    });

    cy.get('[data-testid="clear-canvas-button"]').click();

    cy.get('[data-testid="add-node-button"]').click();

    cy.get('[data-testid="sidebar-input"]').type("{selectall}{backspace}");

    cy.get('[data-testid="sidebar-input"]').type("open");

    cy.get("button").contains("OPEN_IMAGE").click();

    cy.get('[data-testid="sidebar-close"]').click();

    cy.get('[data-testid="node-wrapper"]').click();

    cy.get('[data-testid="string-input"]').each(($element) => {
      cy.get($element).type("image path");
    });

    cy.get('[data-testid="clear-canvas-button"]').click();

    cy.get('[data-testid="add-node-button"]').click();

    cy.get('[data-testid="sidebar-input"]').type("{selectall}{backspace}");

    cy.get('[data-testid="sidebar-input"]').type("fft");

    cy.get("button").contains("FFT").click();

    cy.get('[data-testid="sidebar-close"]').click();

    cy.get('[data-testid="node-wrapper"]').click();

    cy.get('[data-cy="boolean-input"]').click();

    cy.get('[data-testid="clear-canvas-button"]').click();

    cy.get('[data-testid="add-node-button"]').click();

    cy.get('[data-testid="sidebar-input"]').type("{selectall}{backspace}");

    cy.get('[data-testid="sidebar-input"]').type("extract");

    cy.get("button").contains("EXTRACT_COLUMN").click();

    cy.get('[data-testid="sidebar-close"]').click();

    cy.get('[data-testid="node-wrapper"]').click();

    cy.get('[data-testid="array-input"]').type("[1,2,3,4]");

    cy.get('[data-testid="clear-canvas-button"]').click();

    cy.get('[data-testid="add-node-button"]').click();

    cy.get('[data-testid="sidebar-input"]').type("{selectall}{backspace}");

    cy.get('[data-testid="sidebar-input"]').type("feedback");

    cy.get("button").contains("FEEDBACK").click();

    cy.get('[data-testid="sidebar-input"]').type("{selectall}{backspace}");

    cy.get('[data-testid="sidebar-input"]').type("linspace");

    cy.get("button").contains("LINSPACE").click();

    cy.get('[data-testid="sidebar-close"]').click();

    cy.get('[data-testid="node-wrapper"]').contains("FEEDBACK").click({ multiple: true });

    cy.get('[data-testid="node_reference-input"]').each(($element) => {
      cy.get($element).click();
      cy.get('[data-testid="node-edit-modal-params"]')
        .contains("LINSPACE")
        .click();
    });
  });

  // This method performs cleanup after each test.
  afterEach(() => {
    // Close Eyes to tell the server it should display the results.
    cy.eyesClose();
  });
});
