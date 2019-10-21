import { PinPayment } from '../helpers/pin-payment';

export class PaymentService {

    constructor () {}

    static async createSourceToken(card) {
        return await PinPayment.createCard(card);
    }

    static async getCustomer(customerId) {
        return await PinPayment.getCustomer(customerId);
    }

    static async createCustomer(email, token) {
        return await PinPayment.createCustomer(email, token);
    }
    
    static async deleteCustomer(token) {
        return await PinPayment.deleteCustomer(token);
    }

    static async getCustomerSources(customerId) {
        return await PinPayment.getCustomerCards(customerId);
    }
    
    static async getCustomerSource(customerId, cardId) {
        return await PinPayment.getCustomerCard(customerId, cardId);
    }

    static async createCustomerSource(customerId, token) {
        return await PinPayment.createCustomerCard(customerId, token);
    }

    static async deleteCustomerSource(customerId, cardId) {
        return await PinPayment.deleteCustomerCard(customerId, cardId);
    }

    static async setDefaultSource(customerId, cardId) {
        return await PinPayment.setDefaultCard(customerId, cardId);
    }
    
    static async setPrimarySource(customerId, cardId) {
        return await PinPayment.setPrimaryCard(customerId, cardId);
    }
    
    static async getSubscription(subscriptionId) {
        return await PinPayment.getSubscription(subscriptionId);
    }
    
    static async createCharge(charge, card) {
        return await PinPayment.createCharge(charge, card);
    }
    
    static async captureCharge(chargeId, amount = null) {
        return await PinPayment.captureCharge(chargeId, amount);
    }
    
    static async createChargeRefund(chargeId, amount = null) {
        return await PinPayment.createChargeRefund(chargeId, amount);
    }
    
    static async createBookingPlan(plan) {
        return await PinPayment.createPlan(plan);
    }
    
    static async getPlan(planId) {
        return await PinPayment.getPlan(planId);
    }

    static async createSubscription(planId, cusId, cardId = null) {
        return await PinPayment.createSubscription(planId, cusId, cardId);
    }
}
