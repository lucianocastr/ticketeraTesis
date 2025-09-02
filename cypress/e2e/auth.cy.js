// cypress/e2e/auth.cy.js 
describe('Auth: login OK e inválido', () => {
  it('login correcto redirige a /catalogo', () => {
    cy.readFile('src/data/usuarios.json').then(({ 0: u }) => {
      cy.visit('/login')
            cy.get('.bg-blue-600').click()

      cy.get('[data-testid="input-email"]').type(u.email)         // Login.jsx
      cy.get('[data-testid="input-password"]').type(u.password)   // Login.jsx
      cy.get('[data-testid="btn-login"]').click()                 // Login.jsx
      cy.url().should('include', '/catalogo')                     // navigate('/catalogo')
    })
  })

  it('login inválido muestra error y no redirige', () => {
    cy.visit('/login')
          cy.get('.bg-blue-600').click()

    cy.get('[data-testid="input-email"]').type('no@existe.com')
    cy.get('[data-testid="input-password"]').type('xxx')
    cy.get('[data-testid="btn-login"]').click()
    cy.get('[data-testid="login-error"]').should('contain', 'Credenciales inválidas')
    cy.url().should('include', '/login')                          // se queda en login
  })
})
