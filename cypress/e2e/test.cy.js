// cypress/e2e/checkout.happy.cy.js
describe('Happy path: login → catálogo → carrito → checkout → confirmación', () => {
  it('completa una compra aprobada y valida ítems en cada pantalla', () => {
    // LOGIN (usa usuarios reales del proyecto)
    cy.readFile('src/data/usuarios.json').then(({ 0: { email, password } }) => {
      cy.visit('/login');
      cy.get('[data-testid="input-email"]').type(email);        // Login.jsx
      cy.get('[data-testid="input-password"]').type(password);  // Login.jsx
      cy.get('[data-testid="btn-login"]').click();              // Login.jsx
      cy.url().should('include', '/catalogo');                  // redirige
    });

    // CATÁLOGO: tomar nombre del primer ticket y agregarlo
    cy.contains('h1', 'Catálogo').should('be.visible');         // Catalogo.jsx
    cy.get('[data-testid^="card-"]').first().within(() => {
      cy.get('h3').invoke('text').then(t => cy.wrap(t.trim()).as('ticketName'));
      cy.get('button[data-testid^="btn-add-"]').click();        // solo el botón
    });
    cy.get('[data-testid="toast-added"]').should('be.visible'); // Catalogo.jsx

    // CARRITO: ir por menú y validar producto en la lista
    cy.get('a[href="/carrito"]').click();                       // Carrito.jsx
    cy.get('[data-testid="carrito-page"]').should('be.visible');
    cy.get('@ticketName').then(name => {
      cy.get('[data-testid="carrito-lista"]').should('contain', name);
    });

    // Ir a checkout (link “Ir a checkout”)
    cy.contains('a', 'Ir a checkout').click();                  // Carrito.jsx

    // CHECKOUT: validar resumen, completar datos y confirmar
    cy.get('[data-testid="checkout-form"]').should('be.visible'); // Checkout.jsx
    cy.get('@ticketName').then(name => {
      cy.contains('aside', 'Resumen').should('contain', name);
    });

    // Comprador
    cy.get('[data-testid="inp-nombre"]').type('Luciano QA');
    cy.get('[data-testid="inp-email"]').type('luciano.qa@example.com');
    cy.get('[data-testid="inp-dni"]').type('30123456');

    // Tarjeta válida (Luhn) para habilitar el botón
    cy.get('[data-testid="inp-card"]').type('4242 4242 4242 4242');
    cy.get('[data-testid="inp-exp"]').type('12/30');
    cy.get('[data-testid="inp-cvc"]').type('123');

    cy.get('[data-testid="btn-pay"]').should('not.be.disabled').click();

    // CONFIRMACIÓN: textos e ítems
    cy.get('[data-testid="confirmacion-page"]').should('be.visible'); // Confirmacion.jsx
    cy.contains('¡Compra confirmada!').should('be.visible');
    cy.contains('Tu orden fue registrada correctamente. Abajo están los detalles.')
      .should('be.visible');
    cy.get('@ticketName').then(name => {
      cy.get('[data-testid="orden-items"]').should('contain', name);
    });
  });
});

