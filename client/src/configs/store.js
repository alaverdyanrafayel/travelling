const store = {
    development: {
        storeMainParam: 'k5x2ey8p87',
        cryptoSecret: 'zqsw53nhi46em8j'
    },
    production: {
        storeMainParam: 'k5x2ey8p87',
        cryptoSecret: 'zqsw53nhi46em8j'
    }
};

export default store[process.env.NODE_ENV || 'development'];
