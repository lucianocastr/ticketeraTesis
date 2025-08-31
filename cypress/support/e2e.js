// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
// Fuerza cy.visit a NO fallar por 404 de GitHub Pages (SPA fallback)
Cypress.Commands.overwrite('visit', (originalFn, url, options = {}) => {
  return originalFn(url, { failOnStatusCode: false, ...options });
});
