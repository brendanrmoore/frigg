const { TestMongo } = require('./mongodb');

module.exports = async function () {
    if (!process.env.STAGE) {
        process.env.STAGE = 'dev';
        process.env.BYPASS_ENCRYPTION_STAGE = 'dev';
    }
    global.testMongo = new TestMongo();
    await global.testMongo.start();
};
