describe('Stock', () => {
  it('impide confirmar cuando no alcanza', () => {
    cy.visit('/catalogo')
    for (let i=0; i<100; i++) {
      cy.get('[data-testid="card-product"]').first().contains('Agregar al carrito').click()
    }
    cy.visit('/checkout')
    cy.get('[data-testid="checkout-form"]').within(() => {
      cy.get('input[name="cardNumber"]').type('4242 4242 4242 4242')
      cy.get('input[name="expiry"]').type('12/30')
      cy.get('input[name="cvc"]').type('123')
      cy.get('[data-testid="btn-pay"]').click()
    })
    cy.contains(/stock/i)
  })
})
