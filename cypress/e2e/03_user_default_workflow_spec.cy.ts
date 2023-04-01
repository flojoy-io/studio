/* eslint-disable cypress/no-unnecessary-waiting */
import { matchPlotlyOutput } from "../utils/matchPlotlyOutput";
import { NOISY_SINE } from "@src/data/RECIPES";

const nodes = NOISY_SINE.nodes.map((node) => ({
  selector: node.id,
  name: node.data.label.toLowerCase(),
}));

describe("User default workflow", () => {
  it("Should complete default workflow", () => {
    Cypress.on("uncaught:exception", () => false);
    cy.visit("/", {
      onBeforeLoad(win: any) {
        win.disableIntercom = true;
      },
    }).wait(1000);
    cy.get("[data-testid=react-flow]", { timeout: 20000 });

    cy.get(`[data-cy="app-status"]`).contains("🐢 awaiting a new job", {
      timeout: 120000,
    });

    cy.get(`[data-cy="debug-btn"]`).click();

    cy.get(`[data-cy="btn-play"]`).click();
    cy.get(`[data-cy="btn-cancel"]`, { timeout: 15000 });
    cy.get(`[data-cy="app-status"]`).contains("🐢 awaiting a new job", {
      timeout: 300000, // wait maximum 5 minute to complete the run
    });
    cy.get("[data-testid=result-node]", { timeout: 60000 });
    cy.get(`[data-cy="script-btn"]`).click();
    nodes.forEach((node) => {
      matchPlotlyOutput(`${node.selector}`, "plotlyDefaultOutput");
    });
  });
});
