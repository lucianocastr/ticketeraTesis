// cypress/e2e/confirmacion.guard.cy.js
describe('Valida que la confirmación sólo sea accesible luego de comprar', () => {
  it('Confirmación NO accesible sin comprar (redirige a /catalogo)', () => {
    // No hace falta login
    cy.visit('/confirmacion');
    cy.url().should('include', '/catalogo'); // Confirmacion.jsx redirige si no hay orden fresca
  });

  it('Confirmación accesible LUEGO de comprar (y muestra detalles)', () => {
    // Login con usuario real del proyecto
    cy.readFile('src/data/usuarios.json').then(({ 0: { email, password } }) => {
      cy.visit('/login');
      cy.get('[data-testid="input-email"]').type(email);
      cy.get('[data-testid="input-password"]').type(password);
      cy.get('[data-testid="btn-login"]').click();
      cy.url().should('include', '/catalogo');
    });

    // Agregar un ítem al carrito en Catálogo
    cy.get('[data-testid^="card-"]').first().within(() => {
      cy.get('h3').invoke('text').then(t => cy.wrap(t.trim()).as('ticketName'));
      cy.get('button[data-testid^="btn-add-"]').click();
    });
    cy.get('[data-testid="toast-added"]').should('be.visible'); // Catalogo.jsx

    // Ir a Carrito y luego a Checkout
    cy.get('a[href="/carrito"]').click();                       // Carrito.jsx
    cy.get('[data-testid="carrito-page"]').should('be.visible');
    cy.contains('a', 'Ir a checkout').click();                  // Carrito.jsx

    // Completar Checkout y confirmar
    cy.get('[data-testid="checkout-form"]').should('be.visible'); // Checkout.jsx
    cy.get('[data-testid="inp-nombre"]').type('Luciano QA');
    cy.get('[data-testid="inp-email"]').type('luciano.qa@example.com');
    cy.get('[data-testid="inp-dni"]').type('30123456');
    cy.get('[data-testid="inp-card"]').type('4242 4242 4242 4242'); // Luhn OK
    cy.get('[data-testid="inp-exp"]').type('12/30');
    cy.get('[data-testid="inp-cvc"]').type('123');
    cy.get('[data-testid="btn-pay"]').should('not.be.disabled').click();

    // Ahora SÍ debe entrar a Confirmación y mostrar los detalles
    cy.location('pathname').should('include', '/confirmacion'); // Confirmacion.jsx
    cy.get('[data-testid="confirmacion-page"]').should('be.visible');
    cy.contains('¡Compra confirmada!').should('be.visible');
    cy.contains('Tu orden fue registrada correctamente. Abajo están los detalles.').should('be.visible');
    cy.get('@ticketName').then(name => {
      cy.get('[data-testid="orden-items"]').should('contain', name);
    });
  });
});
