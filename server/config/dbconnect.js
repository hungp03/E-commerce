const {default: mongoose, mongo} = require('mongoose');

//connect mongodb function
const dbConnect =async ()=>{
    try{
        const connectDB = await mongoose.connect(process.env.db_URL)
        //https://stackoverflow.com/questions/19599543/check-mongoose-connection-state-without-creating-new-connection
        if (mongoose.connection.readyState === 1) {
            console.log('DB connection is successful!');
        } else {
            console.log('Connecting');
        }
    }
    catch(error){
        console.log('Failed to connect MongoDB');
        throw new Error(error)
    }
}

//export 
module.exports = dbConnect;