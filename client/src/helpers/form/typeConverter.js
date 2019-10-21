import { AES, enc } from 'crypto-js';

export const types = {
    JSON_ENCODE: 'JSON_ENCODE',
    JSON_DECODE: 'JSON_DECODE',
    ENCRYPT: 'ENCRYPT',
    DECRYPT: 'DECRYPT',
    URL_ENCODE: 'URL_ENCODE'
};

function urlEncoded(data) {
    let str = [];

    Object.keys(data).map(key => {
        if (data[key] !== null) {
            str.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
        }
    });

    return str.join('&');
}

function jsonEncoded(data) {
    try {
        return JSON.stringify(data);
    } catch (error) {
        return undefined;
    }
}

function jsonDecoded(data) {
    try {
        return JSON.parse(data);
    } catch (error) {
        return undefined;
    }
}

function encrypted(data, secret) {
    return AES.encrypt(data, secret).toString();
}

function decrypted(data, secret) {
    const decrypted = AES.decrypt(data.toString(), secret);
    
    return decrypted.toString(enc.Utf8);
}

export default function converter(data, type, options = null) {
    if (Array.isArray(type)) {
        let ret = data;

        type.forEach((singleType) => {
            if (Object.keys(types).includes(singleType)) {
                ret = converter(ret, singleType, options);
            }
        });

        return ret;
    } else {
        switch (type) {
                case types.JSON_ENCODE:
                    return jsonEncoded(data);
                case types.JSON_DECODE:
                    return jsonDecoded(data);
                case types.ENCRYPT:
                    return options.secret ? encrypted(data, options.secret) : undefined;
                case types.DECRYPT:
                    return options.secret ? decrypted(data, options.secret) : undefined;
                case types.URL_ENCODE:
                    return urlEncoded(data);
                default:
                    return data;
        }
    }
}
