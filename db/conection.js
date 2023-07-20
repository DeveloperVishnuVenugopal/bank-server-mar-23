const mongoose = require('mongoose')

// get db connection string
const connectionString = process.env.DATABASE


mongoose.connect(connectionString,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>{
    console.log("mongodb atlas connected successfully");
}).catch((err)=>{
    console.log(`connection failed ${err}`);
})