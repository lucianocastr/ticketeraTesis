describe('Valida que los datos de la compran se vean en el carrito', () => {
it('Agrega ticket y luego vacía el carrito', () => {
   // === LOGIN ===
    cy.readFile('src/data/usuarios.json').then((users) => {
      const { email, password } = users[0];

      cy.visit('/login');
                cy.get('.bg-blue-600').click()

      cy.get('[data-testid="input-email"]').type(email);        // Login.jsx
      cy.get('[data-testid="input-password"]').type(password);  // Login.jsx
      cy.get('[data-testid="btn-login"]').click();              // Login.jsx

      // Redirección a Catálogo confirmada por URL o título
      cy.url().should('include', '/catalogo');                  // Catalogo.jsx
      cy.contains('h1', 'Catálogo').should('be.visible');

      // === CATÁLOGO: tomar nombre del primer ticket y agregarlo ===
      cy.get('[data-testid^="card-"]').first().within(() => {
        cy.get('h3')
          .should('be.visible')
          .invoke('text')
          .then((t) => cy.wrap(t.trim()).as('ticketName'));
        cy.get('button[data-testid^="btn-add-"]').click();      // solo el botón
      });

      // toast de agregado
      cy.get('[data-testid="toast-added"]').should('be.visible'); // Catalogo.jsx

      // === MENÚ: ir a CARRITO (sin visit) ===
      cy.get('a[href="/carrito"]').first().click();             // link del layout

      // === CARRITO: validar que está el producto ===
      cy.get('[data-testid="carrito-page"]').should('be.visible');      // Carrito.jsx
      cy.get('@ticketName').then((name) => {
        cy.get('[data-testid="carrito-lista"]').should('contain', name);
      });


    })
  cy.get('a[href="/carrito"]').click()
  cy.get('[data-testid="carrito-lista"]').should('contain', 'Entrada') // nombre capturado antes
  cy.get('[data-testid="carrito-limpiar"]').click()
  cy.get('[data-testid="carrito-vacio"]').should('be.visible')
})
});