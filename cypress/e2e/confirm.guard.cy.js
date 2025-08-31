// cypress/e2e/confirmacion.guard.cy.js
describe('Guard de Confirmación', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('sin orden fresca redirige a /catalogo', () => {
    cy.visit('/confirmacion')
    cy.url().should('include', '/catalogo')
  })

  it('con orden fresca muestra la confirmación', () => {
    // simular una orden válida en localStorage
    const fakeOrder = {
      id: 'ord_123',
      nombre: 'Luciano QA',
      email: 'luciano.qa@example.com',
      total: 5000,
      items: [{ id: 1, nombre: 'Entrada General', cantidad: 1, precio: 5000 }],
      createdAt: Date.now()
    }
    window.localStorage.setItem('lastOrder', JSON.stringify(fakeOrder))

    cy.visit('/confirmacion')
    cy.get('[data-testid="confirmacion-page"]').should('be.visible')
    cy.contains('¡Compra confirmada!').should('be.visible')
    cy.get('[data-testid="orden-items"]').should('contain', 'Entrada General')
  })
})
