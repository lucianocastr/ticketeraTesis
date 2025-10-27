// cypress/e2e/payment.decline-retry.cy.js
describe('Pago: rechazado → reintento aprobado (flujo por UI)', () => {
  it('login → catálogo → carrito → checkout: decline y reintento ok', () => {
    // === LOGIN === (usa usuario real del proyecto)
    cy.readFile('src/data/usuarios.json').then(({ 0: { email, password } }) => {
      cy.visit('/login');
                  cy.get('.bg-blue-600').click()

      cy.get('[data-testid="input-email"]').type(email);        // Login.jsx
      cy.get('[data-testid="input-password"]').type(password);  // Login.jsx
      cy.get('[data-testid="btn-login"]').click();              // Login.jsx
      cy.url().should('include', '/catalogo');                  // redirige al catálogo

      // === STUB de pagos: 1° declined, 2° approved (usa hook de Checkout.jsx) ===
      cy.window().then((win) => {
        win.__TEST_PAY__ = {
          charge: cy.stub()
            .onFirstCall().resolves({ status: 'declined', reason: 'card_declined' })
            .onSecondCall().resolves({ status: 'approved', id: 'pay_123' }),
        };
      });

      // === CATÁLOGO: guardar nombre del primer ticket y agregarlo ===
      cy.contains('h1', 'Catálogo').should('be.visible');       // Catalogo.jsx
      cy.get('[data-testid^="card-"]').first().within(() => {
        cy.get('h3').invoke('text').then((t) => cy.wrap(t.trim()).as('ticketName'));
        cy.get('button[data-testid^="btn-add-"]').click();      // solo el botón
      });
      cy.get('[data-testid="toast-added"]').should('be.visible'); // toast de agregado

      // === IR A CARRITO (link del menú/layout) y validar producto ===
      cy.get('a[href="/carrito"]').click();                     // Carrito.jsx
      cy.get('[data-testid="carrito-page"]').should('be.visible');
      cy.get('@ticketName').then((name) => {
        cy.get('[data-testid="carrito-lista"]').should('contain', name);
      });

      // === IR A CHECKOUT (link "Ir a checkout") ===
      cy.contains('a', 'Ir a checkout').click();                // Carrito.jsx
      cy.get('[data-testid="checkout-form"]').should('be.visible'); // Checkout.jsx
      cy.get('@ticketName').then((name) => {
        cy.contains('aside', 'Resumen').should('contain', name); // nombre en el resumen
      });

      // === CHECKOUT: completar datos ===
      cy.get('[data-testid="inp-nombre"]').type('Luciano QA');
      cy.get('[data-testid="inp-email"]').type('luciano.qa@example.com');
      cy.get('[data-testid="inp-dni"]').type('30123456');
    // NÚMERO (AHORA): válido por Luhn
    cy.get('[data-testid="inp-card"]').type('4242 4242 4242 4242')

    // asegurate que el botón esté habilitado
    //cy.get('[data-testid="btn-pay"]').should('not.be.disabled').click()
      cy.get('[data-testid="inp-exp"]').type('12/30');
      cy.get('[data-testid="inp-cvc"]').type('123');

      // PRIMER INTENTO → debe RECHAZAR y quedarse en checkout
      cy.get('[data-testid="btn-pay"]').click();
      cy.location('pathname').should('include', '/checkout');
      cy.get('[role="alert"]').should('be.visible').and('contain', 'Pago rechazado'); // Checkout.jsx

      // REINTENTO → APRUEBA
      cy.get('[data-testid="inp-card"]').clear().type('4242 4242 4242 4242');
      cy.get('[data-testid="btn-pay"]').click();

      // === CONFIRMACIÓN: textos e ítems ===
      cy.location('pathname').should('include', '/confirmacion'); // Confirmacion.jsx
      cy.get('[data-testid="confirmacion-page"]').should('be.visible');
      cy.contains('¡Compra confirmada!').should('be.visible');
      cy.contains('Tu orden fue registrada correctamente. Abajo están los detalles.').should('be.visible');
      cy.get('@ticketName').then((name) => {
        cy.get('[data-testid="orden-items"]').should('contain', name);
      });
    });
  });
});
