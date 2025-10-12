//Valida que el campo checkout este deshabilitado hasta cumplir el completamiento de los campos
describe('Valida que el botón Confirmar comprae ste deshabilitado', () => {
it('deshabilita/habilita Confirmar compra según validaciones', () => {
   // === LOGIN ===
    cy.readFile('src/data/usuarios.json').then((users) => {
      const { email, password } = users[0];

      cy.visit('/login');
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
    })
  cy.get('[data-testid="btn-pay"]').should('be.disabled')
  cy.get('[data-testid="inp-nombre"]').type('QA')
  cy.get('[data-testid="inp-email"]').type('qa@example.com')
  cy.get('[data-testid="inp-dni"]').type('30123456')
  cy.get('[data-testid="inp-card"]').type('4242 4242 4242 4242') // Luhn OK
  cy.get('[data-testid="inp-exp"]').type('12/30')
  cy.get('[data-testid="inp-cvc"]').type('123')
  cy.get('[data-testid="btn-pay"]').should('not.be.disabled')
})
});



