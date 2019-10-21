import params from '../configs/params';
import AWS from 'aws-sdk';
import awsConfig from 'aws-config';
import { RollbarService } from '../services';

const accessKey = params.aws.accessKey;
const accessSecret = params.aws.accessSecret;
const accessRegion = params.aws.accessRegion;

const s3 = new AWS.S3(awsConfig({ accessKeyId: accessKey, secretAccessKey: accessSecret, region: accessRegion }));

export default class AWSHelper {

    constructor () {}

    static uploadDoc = async (doc, callback) => {
        await RollbarService.info(doc);

        let baseVal = doc.file.split(',')[1];
        let buf = new Buffer(baseVal,'base64');
        s3.putObject( { Bucket: 'holipay-booking-docs',
            Key: `${doc.name}`,
            ACL: 'public-read',
            ContentEncoding: 'base64',
            ContentType: doc.type,
            Body: buf }, callback);
    };
}
