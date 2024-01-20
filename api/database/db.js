const mongoose = require('mongoose');

const connectToDatabase = async () => {
    await mongoose.connect(
        process.env.MONGO_URI , 
        {
            useNewUrlParser : true , 
            useUnifiedTopology : true
        }
    ).then(() => {
        console.log('Connected to MongoDB Database!');
    }).catch((err) => {
        console.log(`Error Connecting to MongoDB Database! : ${err}`);
    })
}

module.exports = { connectToDatabase };