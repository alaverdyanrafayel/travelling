import moment from 'moment';
import {
    CC_VALID_COUNTRY_CODE,
    CARD_NOT_FOUND,
    INVALID_CARD_COUNTRY,
    INVALID_CARD_EXPIRE_DATE,
    NOT_EXISTS,
    PAYMENT_CUSTOMER_NOT_FOUND,
    SOMETHING_WENT_WRONG,
    CARD_UPDATE_ERROR,
    INVALID_REQUEST_PARAMS, MAX_CARDS_LIMIT
} from '../../configs/messages';
import {
    BadRequest,
    Conflict
} from '../../errors';
import { SUCCESS_CODE } from '../../configs/status-codes';
import {
    UserService,
    PaymentService,
    CardService
} from '../../services';
import { Customer } from '../../../models';

export class CardController {
    /**
     * Create payment customer in third party payment service
     * and create cards for it.
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async addCard(req, res, next) {
        if (!req.body || !req.body.tokenId) {
            return next(new BadRequest());
        }

        const { tokenId } = req.body;

        let paymentCustomer, paymentSource, customer, card;
        try {
            customer = await UserService.getCustomerByUser(req.user);

            if (!customer || !(customer instanceof Customer)) {
                return next(new BadRequest(NOT_EXISTS('Customer')));
            }

            if(customer.payment_customer_id) {
                paymentCustomer = await PaymentService.getCustomerSources(customer.payment_customer_id);
                
                if(paymentCustomer.count >= 5) {
                    throw new BadRequest(MAX_CARDS_LIMIT);
                }
                // Check if customer already exists
                paymentSource = await PaymentService.createCustomerSource(customer.payment_customer_id, tokenId);
            } else {
                // Create new customer to third party payment service
                paymentCustomer = await PaymentService.createCustomer(req.user.email, tokenId);

                if (!paymentCustomer) {
                    throw new BadRequest(SOMETHING_WENT_WRONG);
                }

                // Get created card data from third party payment service
                paymentSource = paymentCustomer.card;

                // Add customer id into "customers" table
                customer = await UserService.patchAndFetchCustomer(customer, {
                    payment_customer_id: paymentCustomer.token
                });
                
                if (!customer || !(customer instanceof Customer)) {
                    throw new BadRequest(SOMETHING_WENT_WRONG);
                }
            }

            if (!paymentSource) {
                throw new BadRequest(SOMETHING_WENT_WRONG);
            }

            // Check if the card is australian
            if (paymentSource.address_country !== CC_VALID_COUNTRY_CODE) {
                throw new BadRequest(INVALID_CARD_COUNTRY);
            }

            // Set date 12 weeks later
            const comparedDate = moment().add(12, 'week')
                        .add(1, 'month')
                        .date(1),
                expDate = moment().year(paymentSource.expiry_year)
                        .month(paymentSource.expiry_month - 1);

            // Check if the card expiration date is more then 12 weeks (3 months)
            if (expDate < comparedDate) {
                throw new BadRequest(INVALID_CARD_EXPIRE_DATE);
            }

            // Save the card data into "cards" table
            card = await CardService.insertAndFetchCard(req.user, {
                card_id: paymentSource.token,
                user_id: req.user.id,
                is_verified: true
            });

            if(!card) {
                throw new BadRequest(SOMETHING_WENT_WRONG);
            }

            return res.status(SUCCESS_CODE).json({
                customerId: paymentSource.customer_token,
                cardId: paymentSource.token,
                expMonth: paymentSource.expiry_month,
                expYear: paymentSource.expiry_year,
                addressLine1: paymentSource.address_line1,
                addressCity: paymentSource.address_city,
                displayNumber: paymentSource.display_number,
                primary: paymentSource.primary
            });
        } catch (err) {
            if (paymentSource && customer && customer.payment_customer_id) {
                // Remove card from third party payment service in case there was validation error
                // during changes in our database
                await PaymentService.deleteCustomerSource(customer.payment_customer_id, paymentSource.token);
            }

            next(err);
        }
    }

    /**
     * Retrieve all available cards from third party payment service by having customer id in customer.
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async getCards(req, res, next) {

        if (!req) {
            return next(new BadRequest(INVALID_REQUEST_PARAMS));
        }

        let paymentCustomer, customer, returnData = [];

        try {

            customer = await UserService.getCustomerByUser(req.user);

            if (!customer || !(customer instanceof Customer)) {
                throw new BadRequest(NOT_EXISTS('Customer'));
            }

            if(customer.payment_customer_id) {
                // Get customer from third party payment service
                paymentCustomer = await PaymentService.getCustomerSources(customer.payment_customer_id);
            }

            if(paymentCustomer && paymentCustomer.count) {
                paymentCustomer.cards.forEach((card) => {
                    returnData.push({
                        cardId: card.token,
                        expMonth: card.expiry_month,
                        expYear: card.expiry_year,
                        addressLine1: card.address_line1,
                        addressCity: card.address_city,
                        displayNumber: card.display_number,
                        primary: card.primary
                    });
                });
            }

            return res.status(SUCCESS_CODE).json(returnData);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Update card with the following process:
     *  1. Create new one in third party payment service
     *  2. Update existing card with new data in "cards" table
     *  3. Delete existing card from third party payment service
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async updateCard(req, res, next) {
        if (!req.body || !req.body.tokenId) {
            return next(new BadRequest());
        }

        const cardId = req.params.id;

        const { tokenId } = req.body;

        let paymentSource, customer, card;
        try {
            customer = await UserService.getCustomerByUser(req.user);

            if (!customer || !(customer instanceof Customer)) {
                return next(new BadRequest(NOT_EXISTS('Customer')));
            }

            if(!customer.payment_customer_id) {
                throw new BadRequest(NOT_EXISTS('Payment customer'));
            }

            paymentSource = await PaymentService.createCustomerSource(customer.payment_customer_id, tokenId);

            if (!paymentSource) {
                throw new BadRequest(SOMETHING_WENT_WRONG);
            }

            // Check if the card is australian
            if (paymentSource.address_country !== CC_VALID_COUNTRY_CODE) {
                throw new BadRequest(INVALID_CARD_COUNTRY);
            }

            // Set date 12 weeks later
            const comparedDate = moment().add(12, 'week')
                        .add(1, 'month')
                        .date(1),
                expDate = moment().year(paymentSource.expiry_year)
                        .month(paymentSource.expiry_month - 1);

            // Check if the card expiration date is more then 12 weeks (3 months)
            if (expDate < comparedDate) {
                throw new BadRequest(INVALID_CARD_EXPIRE_DATE);
            }

            card = await CardService.getCardByUser(req.user, cardId);

            if(!card) {
                throw new BadRequest(CARD_NOT_FOUND);
            }

            let removableCard = await PaymentService.getCustomerSource(customer.payment_customer_id, cardId);

            if (!removableCard) {
                throw new BadRequest(CARD_NOT_FOUND);
            }
    
            if (removableCard.primary) {
                let paymentCard = await PaymentService.setPrimarySource(customer.payment_customer_id, paymentSource.token);
        
                if(!paymentCard) {
                    throw new Conflict(CARD_UPDATE_ERROR);
                }
        
                paymentSource.primary = paymentCard.primary;
        
            } else {
                await PaymentService.deleteCustomerSource(customer.payment_customer_id, cardId);
            }

            // Update data of this card in "cards" table
            card = await CardService.patchAndFetchCard(card, {
                card_id: paymentSource.token,
                user_id: req.user.id,
                is_verified: true
            });

            if(!card) {
                throw new Conflict(CARD_UPDATE_ERROR);
            }

            return res.status(SUCCESS_CODE).json({
                cardId: paymentSource.token,
                expMonth: paymentSource.expiry_month,
                expYear: paymentSource.expiry_year,
                addressLine1: paymentSource.address_line1,
                addressCity: paymentSource.address_city,
                displayNumber: paymentSource.display_number,
                primary: paymentSource.primary
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Delete card from cards table and from third party payment service
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async deleteCard(req, res, next) {
        const cardId = req.params.id;

        let paymentCustomer, customer, card, cardCustomer, returnData = [];
        try {
            customer = await UserService.getCustomerByUser(req.user);

            if (!customer || !(customer instanceof Customer)) {
                throw new BadRequest(NOT_EXISTS('Customer'));
            }

            if (!customer.payment_customer_id) {
                throw new BadRequest(PAYMENT_CUSTOMER_NOT_FOUND);
            }

            // Get customer source(card data) by ID from third party payment service
            paymentCustomer = await PaymentService.getCustomerSource(customer.payment_customer_id, cardId);

            if (!paymentCustomer) {
                throw new BadRequest(CARD_NOT_FOUND);
            }

            // Get user's cards
            card = await CardService.getCardByUser(req.user, cardId);

            if (!card) {
                throw new BadRequest(CARD_NOT_FOUND);
            }

            // Delete customer source from third party payment service
            let removableCard = await PaymentService.deleteCustomerSource(customer.payment_customer_id, cardId);

            if (removableCard && removableCard.error) {
                throw new BadRequest(removableCard.error, removableCard);
            }
            // Delete customer source related row from "cards" table
            card = await CardService.deleteCardByUser(req.user, paymentCustomer.token);

            if (!card) {
                throw new BadRequest(SOMETHING_WENT_WRONG);
            }

            cardCustomer = await PaymentService.getCustomerSources(customer.payment_customer_id);

            if (!cardCustomer) {
                throw new BadRequest(PAYMENT_CUSTOMER_NOT_FOUND);
            }

            if(cardCustomer.count) {
                cardCustomer.cards.forEach((card) => {
                    returnData.push({
                        cardId: card.token,
                        expMonth: card.expiry_month,
                        expYear: card.expiry_year,
                        addressLine1: card.address_line1,
                        addressCity: card.address_city,
                        displayNumber: card.display_number,
                        primary: card.primary
                    });
                });
            }

            return res.status(SUCCESS_CODE).json(returnData);
        } catch (err) {
            next(err);
        }
    }

    /**
     * This function is used to set the default card for the customer.
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async defaultCard(req, res, next) {
        const cardId = req.params.id;

        let paymentCustomer, customer, card, returnData = [];
        try {
            customer = await UserService.getCustomerByUser(req.user);

            if (!customer || !(customer instanceof Customer)) {
                throw new BadRequest(NOT_EXISTS('Customer'));
            }

            if (!customer.payment_customer_id) {
                throw new BadRequest(PAYMENT_CUSTOMER_NOT_FOUND);
            }

            // Set the default source for the customer
            card = await PaymentService.setDefaultSource(customer.payment_customer_id, cardId);

            if (!card) {
                throw new BadRequest(SOMETHING_WENT_WRONG);
            }

            paymentCustomer = await PaymentService.getCustomerSources(customer.payment_customer_id);

            if (!paymentCustomer) {
                throw new BadRequest(PAYMENT_CUSTOMER_NOT_FOUND);
            }

            if(paymentCustomer.count) {
                paymentCustomer.cards.forEach((card) => {
                    returnData.push({
                        cardId: card.token,
                        scheme: card.scheme,
                        expMonth: card.expiry_month,
                        expYear: card.expiry_year,
                        addressLine1: card.address_line1,
                        addressCity: card.address_city,
                        displayNumber: card.display_number,
                        primary: card.primary
                    });
                });
            }

            return res.status(SUCCESS_CODE).json(returnData);
        } catch (err) {
            next(err);
        }
    }
}
