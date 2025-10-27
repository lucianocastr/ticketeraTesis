// cypress/e2e/session.expire.cy.js
describe('Sesión expira y recuperación desde catálogo', () => {
  it('redirige a login al expirar y permite continuar desde el catálogo', () => {
    cy.readFile('src/data/usuarios.json').then((users) => {
      const { email, password } = users[0];
      let savedSession;

      // === LOGIN INICIAL ===
                  

      cy.visit('/login');
      cy.get('.bg-blue-600').click()
      cy.get('[data-testid="input-email"]').type(email);
      cy.get('[data-testid="input-password"]').type(password);
      cy.get('[data-testid="btn-login"]').click();

      // Confirmar acceso al catálogo
      cy.url().should('include', '/catalogo');
      cy.contains('h1', 'Catálogo').should('be.visible');

      // === AGREGAR PRODUCTO ===
      cy.get('[data-testid^="card-"]').should('have.length.at.least', 1).first().within(() => {
        cy.contains('Agregar al carrito').click();
      });
      cy.get('[data-testid="toast-added"]').should('be.visible');

      // Guardar sesión actual
      cy.window().then(win => {
        savedSession = win.localStorage.getItem('sessionUser');
      });

      // === IR A CHECKOUT ===
      cy.contains('a', 'Checkout').click();
      cy.url().should('include', '/checkout');
      cy.get('[data-testid^="checkout"]').should('exist');

      // === FORZAR EXPIRACIÓN DE SESIÓN ===
      cy.window().then((win) => {
        const u = JSON.parse(win.localStorage.getItem('sessionUser') || '{}');
        u.loginAt = 0;
        win.localStorage.setItem('sessionUser', JSON.stringify(u));
      });

      // === REINTENTAR ACCESO AL CHECKOUT ===
      cy.visit('/checkout', {
        onBeforeLoad(win) {
          if (savedSession) {
            win.localStorage.setItem('sessionUser', savedSession);
          }
        },
      });

      // Validar redirección automática a login
                  cy.get('.bg-blue-600').click()

      cy.url().should('include', '/login');
      cy.get('[data-testid="login-form"]').should('be.visible');

      // === REINICIAR SESIÓN ===
      cy.get('[data-testid="input-email"]').type(email);
      cy.get('[data-testid="input-password"]').type(password);
      cy.get('[data-testid="btn-login"]').click();

      // === VALIDAR REDIRECCIÓN AL CATÁLOGO ===
      cy.url().should('include', '/catalogo');
      cy.contains('h1', 'Catálogo').should('be.visible');

      // === CONTINUAR MANUALMENTE AL CHECKOUT ===
      cy.contains('a', 'Checkout').click();
      cy.url().should('include', '/checkout');
      cy.get('[data-testid^="checkout"]').should('be.visible');

      // === VALIDAR QUE EL CARRITO SE CONSERVA ===
cy.get('aside').should('contain', 'Entrada General');
cy.get('aside').invoke('text').should('match', /5\.000/);

    });
  });
});
