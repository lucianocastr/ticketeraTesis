describe('Valida que luego del login encuentre el catalogo disponible', () => {
it('Catalogo disponible luego de login', () => {
   // === LOGIN ===
    cy.readFile('src/data/usuarios.json').then((users) => {
      const { email, password } = users[0];

      cy.visit('/login');
                      cy.get('.bg-blue-600').click()
cy.wait(1000)
      cy.get('[data-testid="input-email"]').type(email);        // Login.jsx
      cy.get('[data-testid="input-password"]').type(password);  // Login.jsx
      cy.get('[data-testid="btn-login"]').click();              // Login.jsx

      // Redirección a Catálogo confirmada por URL o título
      cy.url().should('include', '/catalogo');                  // Catalogo.jsx
      cy.contains('h1', 'Catálogo').should('be.visible');
      });

  cy.get('button[data-testid^="btn-add-"]').first().click()
  cy.get('[data-testid="toast-added"][role="status"]').should('be.visible')
})
});