import params from '../configs/params';
import { EQUIFAX_REQUEST, ACCEPT, DECLINE } from '../configs/messages';
import RestClient from 'node-rest-client';

const equifaxUrl = params.equifax.url;
const equifaxUsername = params.equifax.userName;
const equifaxPassword = params.equifax.password;
const restClient = new RestClient.Client();

class Equifax {

    getRequestData(customer) {
        let vars = {
            EQUIFAX_USERNAME: equifaxUsername,
            EQUIFAX_PASSWORD: equifaxPassword,
            EQUIFAX_CUSTOMER_TITLE: customer.title ? customer.title : '',
            EQUIFAX_CUSTOMER_SURNAME: customer.last_name ? customer.last_name : '',
            EQUIFAX_CUSTOMER_FIRSTNAME: customer.first_name ? customer.first_name : '',
            EQUIFAX_CUSTOMER_OTHERNAME: customer.middle_name ? customer.middle_name : '',
            EQUIFAX_CUSTOMER_ADDRESS_STREET_NUMBER: customer.street_no ? customer.street_no : '',
            EQUIFAX_CUSTOMER_ADDRESS_STREET_NAME: customer.street_name ? customer.street_name : '',
            EQUIFAX_CUSTOMER_ADDRESS_STREET_TYPE: customer.street_type ? customer.street_type : '',
            EQUIFAX_CUSTOMER_ADDRESS_SUBURB: customer.suburb ? customer.suburb : '',
            EQUIFAX_CUSTOMER_ADDRESS_STATE: customer.state ? customer.state : '',
            EQUIFAX_CUSTOMER_ADDRESS_COUNTRY_CODE: customer.postcode ? customer.postcode : ''
        };
        
        return EQUIFAX_REQUEST.replace(/EQUIFAX_USERNAME|EQUIFAX_PASSWORD|EQUIFAX_CUSTOMER_TITLE|EQUIFAX_CUSTOMER_SURNAME|EQUIFAX_CUSTOMER_FIRSTNAME|EQUIFAX_CUSTOMER_OTHERNAME|EQUIFAX_CUSTOMER_ADDRESS_STREET_NUMBER|EQUIFAX_CUSTOMER_ADDRESS_STREET_NAME|EQUIFAX_CUSTOMER_ADDRESS_STREET_TYPE|EQUIFAX_CUSTOMER_ADDRESS_SUBURB|EQUIFAX_CUSTOMER_ADDRESS_STATE|EQUIFAX_CUSTOMER_ADDRESS_COUNTRY_CODE/g, (matched) => {
            return vars[matched];
        });
    }

    checkScore(user) {
        return new Promise((resolve, reject) => {
            let customer = user.$relatedQuery('customer');
            let requestData = this.getRequestData(customer);
            let req = restClient.post(equifaxUrl, {
                data: requestData,
                headers: { 'Content-Type': 'text/xml' }
            }, async (data) => {
                try{
                    await user.$relatedQuery('equifax_checks').insertAndFetch({ payload: JSON.stringify(data), user_id: user.id });
                    let score = parseInt(data['soapenv:Envelope']['soapenv:Body']['vs:response']['vs:product-data']['vs:score-data']['vs:score']['vs:score-masterscale']);
                    let scoreCheck = score >= 575 ? ACCEPT : DECLINE;
                    let defaultsCheck = 'DECLINE';
                    let accountsNode = data['soapenv:Envelope']['soapenv:Body']['vs:response']['vs:product-data']['vs:enquiry-report']['vs:consumer-credit-file']['vs:accounts'];
                    if(accountsNode) {
                        let defaultVal = accountsNode['vs:account']['vs:defaults']['vs:default'];
                        if(defaultVal === 0) {
                            defaultsCheck = ACCEPT;
                        }
                    }
                    resolve({ scoreCheck , defaultsCheck });
                }
                catch(err) {
                    reject(err);
                }
            });
            req.on('error', (err) => {
                reject(err);
            });
        });
    }
}

export default new Equifax();
