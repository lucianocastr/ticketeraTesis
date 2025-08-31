// cypress/e2e/checkout.flow.cy.js
describe('Flujo completo: login → catálogo → carrito → checkout → confirmación', () => {
  it('valida ítems y completa compra aprobada', () => {
    // === LOGIN ===
    cy.readFile('src/data/usuarios.json').then((users) => {
      const { email, password } = users[0];

      cy.visit('/login');
      cy.get('body').then($body => {
      // ¿ya está el formulario?
      if ($body.find('[data-testid="input-email"]').length === 0) {
        // plan B: click al link de Login en el header (ancla o Link)
        // - intenta selector por href que termina en 'login'
        cy.get('a[href$="login"]').first().click({ force: true });
      }
    });
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

      // Ir a checkout por el link "Ir a checkout"
      cy.contains('a', 'Ir a checkout').click();                // Carrito.jsx

      // === CHECKOUT: validar resumen y completar datos ===
      cy.get('[data-testid="checkout-form"]').should('be.visible');     // Checkout.jsx
      cy.get('@ticketName').then((name) => {
        cy.contains('aside', 'Resumen').should('contain', name);
      });

      // Comprador
      cy.get('[data-testid="inp-nombre"]').type('Luciano QA');
      cy.get('[data-testid="inp-email"]').type('luciano.qa@example.com');
      cy.get('[data-testid="inp-dni"]').type('30123456');

      // Tarjeta (aprobada para llegar a confirmación)
      cy.get('[data-testid="inp-card"]').type('4242 4242 4242 4242');
      cy.get('[data-testid="inp-exp"]').type('12/30');
      cy.get('[data-testid="inp-cvc"]').type('123');

      // Confirmar compra
      cy.get('[data-testid="btn-pay"]').click();

      // === CONFIRMACIÓN: textos y nombre del ticket ===
      cy.get('[data-testid="confirmacion-page"]').should('be.visible');  // Confirmacion.jsx
      cy.contains('¡Compra confirmada!').should('be.visible');
      cy.contains('Tu orden fue registrada correctamente. Abajo están los detalles.')
        .should('be.visible');
      cy.get('@ticketName').then((name) => {
        cy.get('[data-testid="orden-items"]').should('contain', name);
      });
    });
  });
});
