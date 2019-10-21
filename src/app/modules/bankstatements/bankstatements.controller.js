import { UserService, BookingService } from '../../services';
import multiparty from 'multiparty';
import params from '../../configs/params';
import AWS from 'aws-sdk';
import awsConfig from 'aws-config';
import { SUCCESS_CODE } from '../../configs/status-codes';
import { BadRequest, NotFound } from '../../errors';
import {
    PENDING,
    PASSED,
    FAILED,
    NOT_EXISTS,
    INVALID_REQUEST_PARAMS,
} from '../../configs/messages';
import { each } from 'lodash';

const accessKey = params.aws.accessKey;
const accessSecret = params.aws.accessSecret;
const accessRegion = params.aws.accessRegion;

const s3 = new AWS.S3(awsConfig({ accessKeyId: accessKey, secretAccessKey: accessSecret, region: accessRegion }));

export class BankStatementsController {
    /**
   * This function is used to fetch the status of the bankstatements check to update the UI
   *
   * @param req
   * @param res
   * @param next
   * @returns {Promise.<*>}
   */
    static async getStatus(req, res, next) {
  
        if (!req || !req.params.id) {
            return next(new BadRequest(INVALID_REQUEST_PARAMS));
        }
  
        let booking;
        try {
            booking = await BookingService.getBookingById(req.params.id);
          
            if(!booking) {
                throw next(new NotFound(NOT_EXISTS('Booking')));
            }

            let check = '';

            if(booking.is_bankstatements_passed === null) {
                check = PENDING;
            }
            else if(booking.is_bankstatements_passed) {
                check = PASSED;
            }
            else if(!booking.is_bankstatements_passed) {
                check = FAILED;
            }

            return res.status(SUCCESS_CODE).json({
                message: null,
                data: check,
                errors: null
            });
        }
        catch (err) {
            next(err);
        }
    }
    
    /**
     *  This function will be called by bank statements for passing on with files.
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async addBankStatements(req, res, next) {
        let form = new multiparty.Form();
        form.on('error', (err) => {
            next(err);
        });
        form.on('part', (part) => {
            if (!part.filename) {
                part.resume();
            }
            if (part.filename) {
                let buffer = new Buffer(part.byteCount);
                let bufferOffset = 0;
                part.on('data', (chunk) => {
                    buffer.fill(chunk, bufferOffset, bufferOffset + chunk.length);
                    bufferOffset += chunk.length;
                });
                part.on('end', () => {
                    s3.putObject({
                        Bucket: 'holipay-bank-statements',
                        Key: part.name + '_' + Date.now().toString(),
                        ACL: 'public-read',
                        Body: buffer,
                        ContentLength: part.byteCount
                    }, (err) => {
                        if (err) {
                            next(err);
                        }
                        if (part.name === 'file1') {
                            let file1 = buffer.toString('utf8').trim()
                                    .replace(/\n/g, '\\n')
                                    .replace(/\r/g, '\\r')
                                    .replace(/\t/g, '\\t')
                                    .replace(/\f/g, '\\f');
                            let fileObj = JSON.parse(file1.slice(0, file1.lastIndexOf('}') + 1));
                            
                            each(fileObj.bankData.bankAccounts, async (account, idx) => {
                                let name = account.accountHolder;
                                // Don't look for joint accounts
                                if (name.indexOf('and') < 0) {
                                    let names = name.split(' ');
                                    let firstName = names[0];
                                    let lastName = names[1];
                                    
                                    let params = fileObj.reference.split('-');
                                    
                                    if (params.length !== 3) {
                                        part.resume();
                                    }
                                    
                                    let customer = await UserService.getCustomerById(params[1]);
                                    let booking = await BookingService.getBookingById(params[2]);
                                    
                                    if (firstName !== customer.first_name || customer.last_name.substring(0, 2) !== lastName.substring(0, 2)) {
                                        await BookingService.patchAndFetchBooking(booking, {
                                            is_bankstatements_passed: false
                                        });
                                        part.resume();
                                    }
                                    
                                    let userAddress = fileObj.bankData.userAddress;
                                    
                                    await UserService.patchAndFetchCustomer(customer, {
                                        streetNo: userAddress.streetNo || null,
                                        streetName: userAddress.streetName || null,
                                        streetType: userAddress.streetType || null,
                                        suburb: userAddress.suburb || null,
                                        state: userAddress.state || null,
                                        postcode: userAddress.postcode || null,
                                        home_address: userAddress.home_address || null,
                                    });
                                    
                                    let dm001 = fileObj.decisionMetrics[0].value;
                                    let dm013 = fileObj.decisionMetrics[13].value;
                                    if (fileObj.decisionMetrics[13].id !== 'DM013') {
                                        await BookingService.patchAndFetchBooking(booking, {
                                            is_bankstatements_passed: false
                                        });
                                        part.resume();
                                    }
                                    else {
                                        if (((dm001 + account.currentBalance) - dm013) >= (8 * booking.weekly_price)) {
                                            await BookingService.patchAndFetchBooking(booking, {
                                                is_bankstatements_passed: true
                                            });
                                            part.resume();
                                        }
                                        else if (idx === fileObj.bankData.bankAccounts.length) {
                                            await BookingService.patchAndFetchBooking(booking, {
                                                is_bankstatements_passed: false
                                            });
                                            part.resume();
                                        }
                                    }
                                }
                            });
                        }
                        part.resume();
                    });
                });
            }
        });
        form.on('close', () => {
            res.setHeader('content-type', 'text/plain');
            res.end('OK');
        });
        form.parse(req);
    }
}
