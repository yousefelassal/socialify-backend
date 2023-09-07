require('dotenv').config();

const MOGODB_URI = process.env.NODE_ENV === 'test'
? process.env.TEST_MOGODB_URI
: process.env.MOGODB_URI;

module.exports = {
    MOGODB_URI
}