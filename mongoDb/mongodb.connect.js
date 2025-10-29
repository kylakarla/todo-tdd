const mongoose = require('mongoose');
const config = require('../config');

async function connect() {
    try {
        await mongoose.connect(config.dbString);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

module.exports = { connect };