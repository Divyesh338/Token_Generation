const mongoose = require('mongoose');

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected Successully....')
    } catch (error) {
        console.error('MongooDB connection failed...');
        process.exit(1);
    }
}

module.exports = connectToDB;