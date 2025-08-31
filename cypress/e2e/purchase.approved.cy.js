describe('Compra aprobada', () => {
  it('flujo completo', () => {
    cy.visit('/catalogo')
    cy.get('[data-testid="card-product"]').first().contains('Agregar al carrito').click()
    cy.visit('/carrito')
    cy.get('[data-testid="btn-go-checkout"]').click()
    cy.url().should('include', '/checkout')
    cy.get('[data-testid="checkout-form"]').within(() => {
      cy.get('input[name="cardNumber"]').type('4242 4242 4242 4242')
      cy.get('input[name="expiry"]').type('12/30')
      cy.get('input[name="cvc"]').type('123')
      cy.get('[data-testid="btn-pay"]').click()
    })
    cy.url().should('include', '/confirmacion')
    cy.get('[data-testid="order-id"]').should('exist')
    cy.get('[data-testid="payment-id"]').should('exist')
  })
})
