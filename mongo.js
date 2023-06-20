const mongoose = require('mongoose');
const { uri } = require("./params");
mongoose.connect(uri)
.then(()=>{
    console.log('Mongodb Connected')
})
.catch((error)=>{
    console.log("error ==>" + error);
})
const db = mongoose.connection;
db.on('disconnected', ()=> console.log('db DisConnected'));



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

// const dailySchema = new mongoose.Schema({

    

//     Date: {
//         type: String,
//         required: true
//     },
//     NofTrades: {
//         type: Number,
//         required: true
//     },
//     TradesWon: {
//         type: Number,
//         required: true
//     },
//     TradeLost: {
//         type: Number,
//         required: true
//     },
//     WinRatio: {
//         type: Number,
//         required: true
//     }

// })

// //const trades = new mongoose.model("trades",resultSchema)

// //const dailyreport = new mongoose.model("dailytrades",dailySchema)

// const sampledata = {
//     Date: "19-6-2023",
//     AlertTime: "18:43:06",
//     EntryValue: 9579.30,
//     TargetValue: 9579.80,
//     TradeResult: "WONN"
// }

// var sample = {
//     Date:  "16-6-2023",
//     NofTrades: 12,
//     TradesWon: 9,
//     TradeLost: 3,
//     WinRatio: 85
// }
//  const result = trades.insertMany(sampledata).then(async(data)=>{
//     if (data) {
      
//         console.log(`A Report was inserted with the _id: ${data[0]._id}`);

//     }

    // const result = trades.create(sampledata).then((x)=>{
    //     if (x) {
          
    //         console.log(`A Report was inserted with the _id: ${x}`);
    
    //     }
    
    //mongoose.disconnect()
//})

// const resultdaily = dailyreport.insertMany(sample).then(async(data)=>{
//     if (data) {
      
//         console.log(`A Report was inserted with the _id: ${data[0]._id}`);
//         console.log()
//     }
//     trades.findall((datar)=>{
//         console.log(`A Report was inserted with the _id: ${datar}`);
//     })

//     //mongoose.Collection.
//     mongoose.disconnect()
// })


module.exports = new mongoose.model("trades",resultSchema)
