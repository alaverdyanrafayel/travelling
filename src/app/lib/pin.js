import request from 'request';

class Pin {
    options = {
        production: true,
        url: '',
        key: ''
    };

    constructor(options) {
        this.options.key = options.key;
        this.options.url = options.apiUrl;
    }
    
    generateRequest(req) {
        req.auth(this.options.key, '');
    }
    
    /**
     * Securely stores a card’s details and returns its token and other information.
     *
     * @param source
     * @returns {Promise}
     */
    createCard(source) {
        return new Promise((resolve, reject) => {
            let req = request.post({ url: `${this.options.url}/1/cards`, body: source, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
        
    }
    
    /**
     * Creates a new customer and returns its details.
     *
     * @param email
     * @param card | card_token
     * @returns {Promise}
     */
    createCustomer(email, card) {
        let body = {
            email: email,
            card: card,
            card_token: card,
        };
        if(typeof card === 'object') {
            delete body.card_token;
        } else {
            delete body.card;
        }

        return new Promise((resolve, reject) => {
            let req = request.post({ url: `${this.options.url}/1/customers`, body: body, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
    
    /**
     * Returns a paginated list of all customers.
     *
     * @returns {Promise}
     */
    retrieveCustomersList() {
        return new Promise((resolve, reject) => {
            let req = request.get({ url: `${this.options.url}/1/customers`, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
    
    /**
     * Returns the details of a customer.
     *
     * @param customerToken
     * @returns {Promise}
     */
    retrieveCustomer(customerToken) {
        return new Promise((resolve, reject) => {
            let req = request.get({ url: `${this.options.url}/1/customers/${customerToken}`, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
    
    /**
     * Updates the details of a customer and returns the updated details.
     * You can update the customer’s cards in one of four ways:
     *
     *  1)You can use the card[...] parameters to store a new card that will replace
     *      the customer’s primary card. The customer’s current primary card will be removed
     *      from storage and you will not be able to recover it.
     *
     *  2) You can use the card_token parameter to replace the customer’s primary card with a previously stored card.
     *      The card token must either be already associated with this customer record or unused.
     *      The customer’s current primary card will be removed from storage and you will not be able to recover it.
     *
     *  3) You can use the primary_card_token parameter to switch the customer’s primary card
     *      to a previously stored card. The card token must either be already associated with this customer record or unused.
     *      The current primary card will become a non-primary card of the customer.
     *
     *  4) You can use none of the above parameters. The customer’s cards will not change.
     *
     * In addition, you can update the customer’s email address.
     *
     * @param customerToken
     * @param card
     * @param removePrimary
     * @param email
     * @returns {Promise}
     */
    updateCustomer(customerToken, card, removePrimary = false, email = '') {
        let body = {};
        if (email) {
            body.email = email;
        }
        if(typeof card === 'object') {
            body.card = card;
        } else if(removePrimary) {
            body.card_token = card;
        } else {
            body.primary_card_token = card;
        }
        
        return new Promise((resolve, reject) => {
            let req = request.put({ url: `${this.options.url}/1/customers/${customerToken}`, body: body, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
    
    /**
     * Deletes a customer and all of its cards. You will not be able to recover them.
     *
     * @param token
     * @returns {Promise}
     */
    deleteCustomer(token) {
        return new Promise((resolve, reject) => {
            let req = request.delete({ url: `${this.options.url}/1/customers/${token}`, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
    
    /**
     * Returns a paginated list of a customer’s charges.
     *
     * @param token
     * @returns {Promise}
     */
    retrieveCustomerCharges(token) {
        return new Promise((resolve, reject) => {
            let req = request.get({ url: `${this.options.url}/1/customers/${token}/charges`, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
    
    /**
     * Returns a paginated list of a customer’s cards.
     *
     * @param customerToken
     * @returns {Promise}
     */
    retrieveCustomerCards(customerToken) {
        return new Promise((resolve, reject) => {
            let req = request.get({ url: `${this.options.url}/1/customers/${customerToken}/cards`, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
    
    /**
     * Creates an additional card for the specified customer and returns its details.
     * The customer’s primary card will not be changed by this operation.
     *
     * @param customerToken
     * @param card | card_token
     * @returns {Promise}
     */
    createCustomerCard(customerToken, card) {
        let body;
        if(typeof card === 'object') {
            body = card;
        } else {
            body = { card_token: card };
        }

        return new Promise((resolve, reject) => {
            let req = request.post({ url: `${this.options.url}/1/customers/${customerToken}/cards`, body: body, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
    
    /**
     * Deletes a customer’s non-primary card. You will not be able to recover it.
     *
     * @param customerToken
     * @param cardToken
     * @returns {Promise}
     */
    deleteCustomerCard(customerToken, cardToken) {
        return new Promise((resolve, reject) => {
            let req = request.delete({ url: `${this.options.url}/1/customers/${customerToken}/cards/${cardToken}`, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
    
    /**
     * Retrieves the specified customer's subscriptions.
     *
     * @version(Beta)
     *
     * @param token
     * @returns {Promise}
     */
    retrieveCustomerSubscriptions(token) {
        return new Promise((resolve, reject) => {
            let req = request.get({ url: `${this.options.url}/1/customers/${token}/subscriptions`, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }

    createChargeRefund(chargeId, amount = null) {
        let body;
        
        if(amount) {
            body = {
                amount: amount
            };
        }
        
        return new Promise((resolve, reject) => {
            let req = request.post({ url: `${this.options.url}/1/charges/${chargeId}/refunds`, body: body, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }

    retrieveCharge(chargeId) {
        return new Promise((resolve, reject) => {
            let req = request.get({ url: `${this.options.url}/1/charges/${chargeId}`, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }

    createCharge(charge, card) {
        let body = {
            email: charge.email,
            description: charge.description,
            amount: charge.amount,
            ip_address: charge.ip_address,
            currency: charge.currency,
            capture: charge.capture,
            metadata: charge.metadata,
            card_token: card
        };

        return new Promise((resolve, reject) => {
            let req = request.post({ url: `${this.options.url}/1/charges`, body: body, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
    
    createRecipient(fields) {
        return new Promise((resolve, reject) => {
            let req = request.post({ url: `${this.options.url}/1/recipients`, body: fields, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
    
    getRecipientsList() {
        return new Promise((resolve, reject) => {
            let req = request.get({ url: `${this.options.url}/1/recipients`, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
    
    getRecipientData(token) {
        return new Promise((resolve, reject) => {
            let req = request.get({ url: `${this.options.url}/1/recipients/${token}`, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
    
    updateRecipientData(token, fields) {
        return new Promise((resolve, reject) => {
            let req = request.put({ url: `${this.options.url}/1/recipients/${token}`, body: fields, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
    
    getRecipientTransfers(token) {
        return new Promise((resolve, reject) => {
            let req = request.get({ url: `${this.options.url}/1/recipients/${token}/transfers`, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
    
    createTransfer(fields) {
        return new Promise((resolve, reject) => {
            let req = request.post({ url: `${this.options.url}/1/transfers`, body: fields, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
    
    getTransferLineItems(transferToken) {
        return new Promise((resolve, reject) => {
            let req = request.get({ url: `${this.options.url}/1/transfers${transferToken}/line_items`, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
    
    captureCharge(nonCapturedToken, amount = null) {
        let body = {};
        
        if(amount) {
            body = {
                amount: amount
            };
        }

        return new Promise((resolve, reject) => {
            let req = request.put({ url: `${this.options.url}/1/charges/${nonCapturedToken}/capture`, body: body, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
    
    retrievePlan(token) {
        return new Promise((resolve, reject) => {
            let req = request.get({ url: `${this.options.url}/1/plans/${token}`, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
    
    retrievePlanList() {
        return new Promise((resolve, reject) => {
            let req = request.get({ url: `${this.options.url}/1/plans/`, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }

    createPlanSubscription(planToken, subscription) {
        return new Promise((resolve, reject) => {
            let req = request.post({ url: `${this.options.url}/1/plans/${planToken}/subscriptions`, body: subscription, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }

    retrievePlanSubscriptions(planToken) {
        return new Promise((resolve, reject) => {
            let req = request.get({ url: `${this.options.url}/1/plans/${planToken}/subscriptions`, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }

    createPlan(plan) {
        return new Promise((resolve, reject) => {
            let req = request.post({ url: `${this.options.url}/1/plans/`, body: plan, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }

    deletePlan(planToken) {
        return new Promise((resolve, reject) => {
            let req = request.delete({ url: `${this.options.url}/1/plans/${planToken}`, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
    
    createSubscription(planToken, customerToken, cardToken, includeSetupFee) {
        let body = {
            plan_token: planToken,
            customer_token: customerToken
        };
        
        if(cardToken) {
            body.card_token = cardToken;
        }
        
        if(typeof includeSetupFee === 'boolean') {
            body.include_setup_fee = includeSetupFee;
        }
        
        return new Promise((resolve, reject) => {
            let req = request.post({ url: `${this.options.url}/1/subscriptions`, body: body, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
    
    retrieveSubscriptionList() {
        return new Promise((resolve, reject) => {
            let req = request.get({ url: `${this.options.url}/1/subscriptions`, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
    
    retrieveSubscription(subToken) {
        return new Promise((resolve, reject) => {
            let req = request.get({ url: `${this.options.url}/1/subscriptions/${subToken}`, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
    
    retrieveBalance() {
        return new Promise((resolve, reject) => {
            let req = request.get({ url: `${this.options.url}/1/balance`, json: true }, (err, res) => {
                if(res && res.statusCode >= 400) {
                    reject(res.body);
                } else {
                    resolve(res.body);
                }
                reject(err);
            });
            this.generateRequest(req);
        });
    }
}

exports.Pin = (options) => new Pin(options);
