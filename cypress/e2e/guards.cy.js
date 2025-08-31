// cypress/e2e/guards.cy.js
describe('Guards de navegación', () => {
  beforeEach(() => {
    // limpiar sesión antes de cada test
    cy.clearLocalStorage()
  })

  it('Carrito requiere sesión: sin sesión redirige a /login', () => {
    cy.visit('/carrito')
    // Carrito.jsx usa isLoggedIn() y navigate('/login') en useEffect
    cy.url().should('include', '/login')
    cy.get('[data-testid="login-form"]').should('be.visible')
  })

  it('Carrito con sesión: permite ver la página', () => {
    cy.readFile('src/data/usuarios.json').then(({ 0: u }) => {
      // simular sesión como lo hace Login.jsx
      window.localStorage.setItem('sessionUser', JSON.stringify({ email: u.email, nombre: u.nombre }))
      cy.visit('/carrito')
      cy.get('[data-testid="carrito-page"]').should('be.visible') // “Carrito de compras”
    })
  })
})
