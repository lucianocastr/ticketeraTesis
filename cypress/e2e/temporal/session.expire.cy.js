describe('Sesión expira y recupera carrito', () => {
  it('redirige a login y luego vuelve con carrito', () => {
    cy.visit('/catalogo')
    cy.get('[data-testid="card-product"]').first().contains('Agregar al carrito').click()
    cy.visit('/checkout')
    cy.window().then(w => {
      const u = JSON.parse(localStorage.getItem('sessionUser') || '{}')
      if (u.loginAt) { u.loginAt = 0; localStorage.setItem('sessionUser', JSON.stringify(u)); }
    })
    cy.visit('/checkout')
    cy.url().should('include', '/login')
    cy.get('[data-testid="login-form"]').within(() => {
      cy.get('[data-testid="input-email"]').type('user@example.com')
      cy.get('[data-testid="input-pass"]').type('password123')
      cy.get('[data-testid="btn-login"]').click()
    })
    cy.url().should('include', '/checkout')
  })
})
