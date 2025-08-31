describe('Login', () => {
  it('permite iniciar sesión', () => {
    cy.visit('/login')
    cy.get('[data-testid="login-form"]').within(() => {
      cy.get('[data-testid="input-email"]').type('user@test.com')
      cy.get('[data-testid="input-password"]').type('123456')
      cy.get('[data-testid="btn-login"]').click()
    })
    cy.url().should('not.include', '/login')
  })
})
