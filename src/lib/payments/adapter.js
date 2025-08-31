// Contrato que cualquier procesador debe cumplir
export class PaymentsAdapter {
  /**
   * @param {{ amount:number, email:string, token:string, name:string, dni:string }} payload
   * @returns {Promise<{status:'approved'|'declined', authCode?:string, reason?:string}>}
   */
  async charge(_payload) { throw new Error("not implemented"); }
}

