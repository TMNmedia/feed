const mongoose = require('mongoose');
const { uri } = require("../params");
mongoose.connect(uri)

.then(()=>{
    console.log('Mongodb Connected')
})
.catch((error)=>{
    console.log("error ==>" + error);
})

const resultSchema = new mongoose.Schema({
    Date: {
        type: String,
        required: true
    },
    AlertTime: {
        type: String,
        required: true
    },
    EntryValue: {
        type: Number,
        required: true
    },
    TargetValue: {
        type: Number,
        required: true
    },
    TradeResult: {
        type: String,
        required: true
    }

})
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true

    },
    phone: {
        type: String,
        required: true

        
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: String,
        required: true,
        default: Date.now

    }
});


module.exports = new mongoose.model("User",userSchema)
