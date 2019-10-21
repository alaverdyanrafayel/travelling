import params from '../configs/params';
import { Pin } from '../lib/pin';
import Utils from './utils';

const pin = Pin({
    key: params.pinPayment.secretKey,
    apiUrl: params.pinPayment.apiUrl
});

export class PinPayment {
    
    constructor() {}
    
    /**
     * Create card token
     *
     * @param source
     * @return {Promise.<card>}
     */
    static createCard(source) {
        return pin.createCard(source)
                .then((card) => card.response)
                .catch((err) => err);
    }
    
    /**
     * Create customer
     *
     * @param email
     * @param card | cardId
     * @return {Promise.<Customer>}
     */
    static createCustomer(email, card) {
        return pin.createCustomer(email, card)
                .then((customer) => customer.response)
                .catch((err) => err);
    }
    
    /**
     * Returns the details of a customer.
     *
     * @param customerId
     * @return {Promise.<Customer>}
     */
    static getCustomer(customerId) {
        return pin.retrieveCustomer(customerId)
                .then((customer) => customer.response)
                .catch((err) => err);
    }
    
    /**
     * Delete customer card
     * @param customerId
     * @param cardId
     * @return {Promise.<Card>}
     */
    static deleteCustomerCard(customerId, cardId) {
        return pin.deleteCustomerCard(customerId, cardId)
                .catch((err) => err);
    }
    
    /**
     * Create cart for customer
     *
     * @param customerId
     * @param card
     * @return {Promise.<Card>}
     */
    static createCustomerCard(customerId, card) {
        return pin.createCustomerCard(customerId, card)
                .then((card) => card.response)
                .catch((err) => err);
    }
    
    /**
     * Return card list for customer
     *
     * @param customerId
     * @return {Promise.<Card>}
     */
    static getCustomerCards(customerId) {
        return pin.retrieveCustomerCards(customerId)
                .then((cards) => {
                    return {
                        cards: cards.response,
                        count: cards.count
                    };
                })
                .catch((err) => err);
    }
    
    /**
     * Return card list for customer
     *
     * @param customerId
     * @param cardId
     * @return {Promise.<Card>}
     */
    static getCustomerCard(customerId, cardId) {
        return pin.retrieveCustomerCards(customerId)
                .then((cards) => {
                    return cards.response.filter((card) => {
                        return card.token === cardId;
                    })[0];
                })
                .catch((err) => err);
    }
    
    /**
     * Set default card for customer
     *
     * @param customerId
     * @param cardId
     * @return {Promise.<Card>}
     */
    static setDefaultCard(customerId, cardId) {
        return pin.updateCustomer(customerId, cardId)
                .then((card) => card.response)
                .catch((err) => err);
    }

    static setPrimaryCard(customerId, cardId) {
        return pin.updateCustomer(customerId, cardId, true)
                .then((card) => {
                    return card.response.card;
                })
                .catch((err) => err);
    }

    static retrieveCharge(chargeId) {
        return pin.retrieveCharge(chargeId)
                .then((charge) => charge.response)
                .catch((err) => err);
    }
    
    static createCharge(charge, card) {
        return pin.createCharge(Object.assign({}, charge,
            {
                amount: Utils.toCent(charge.amount)
            }), card)
                .then((charge) => {
                    return Object.assign({}, charge.response, {
                        amount: Utils.toAcre(charge.response.amount),
                        amount_refunded: Utils.toAcre(charge.response.amount_refunded),
                        total_fees: Utils.toAcre(charge.response.total_fees),
                    });
                })
                .catch((err) => err);
    }
    
    static captureCharge(nonCapturedToken, amount = null) {
        return pin.captureCharge(nonCapturedToken, amount)
                .then((charge) => charge.response)
                .catch((err) => err);
    }

    static deleteCustomer(token) {
        return pin.deleteCustomer(token);
    }
    
    static async deleteCustomerCardsWithout(customerId, cardId) {
        let cards = (await PinPayment.getCustomerCards(customerId)).cards;

        return cards.forEach((card) => {
            if(card.token !== cardId) {
                pin.deleteCustomerCard(customerId, card.token);
            }
        });
    }
    static getPlansList() {
        return pin.retrievePlanList()
                .then((plans) => {
                    return {
                        plans: plans.response,
                        pagination: plans.pagination
                    };
                })
                .catch((err) => err);
    }
    
    static createPlan(plan) {
        return pin.createPlan(Object.assign({}, plan,
            {
                amount: Utils.toCent(plan.amount),
                setup_amount: Utils.toCent(plan.setup_amount),
            }))
                .then((plan) => {
                    return Object.assign({}, plan.response,
                        {
                            amount: Utils.toAcre(plan.amount),
                            trial_amount: Utils.toAcre(plan.trial_amount),
                            setup_amount: Utils.toAcre(plan.setup_amount),
                        });
                })
                .catch((err) => err);
    }
    
    static createChargeRefund(chargeId, amount = null) {
        return pin.createChargeRefund(chargeId, amount)
                .then((refund) => refund.response)
                .catch((err) => err);
    }
    
    static getPlan(token) {
        return pin.retrievePlan(token)
                .then((plan) => plan.response)
                .catch((err) => err);
    }

    static deletePlan(token) {
        return pin.deletePlan(token)
                .catch((err) => err);
    }
    
    static createSubscription(planId, cusId, cardId = null) {
        return pin.createSubscription(planId, cusId, cardId)
                .then((subscription) => subscription.response)
                .catch((err) => err);
    }
    
    static getSubscription(subId) {
        return pin.retrieveSubscription(subId)
                .then((subscription) => subscription.response)
                .catch((err) => err);
    }

    static getBalance() {
        return pin.retrieveBalance()
                .then((balance) => balance.response)
                .catch((err) => err);
    }
}
