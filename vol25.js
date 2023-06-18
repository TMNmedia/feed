
//module.exports = function log() {
    const WebSocket = require('ws');
    const fs = require('fs');
    //get current data
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const fullDate = `${day}-${month}-${year}`

    const alertSignals  = `${'Alert-Signals'}.${'csv'}`//txtfilename
    var signalentryonly =  ["Date","Alertime","lastTick"];//,"trade_profit"

    async function signal_storage() {
        fs.readFile(alertSignals, 'utf-8', (error, data) => {
            if (error) {//throw error;{
                if (error.code === 'ENOENT') {//throw error;
                    const logger = fs.createWriteStream(alertSignals,{ flags: 'a'},function(err, data) {
                        if (err) throw err;
                       
                        //console.log(data);
                        })
                    logger.write(`${signalentryonly}\r\n`);
                    logger.close()
                    console.log('file Created & saved successfully');
                
                console.log('this is the error==> ' + error);
                } else {    console.log('this is the DATA ==> ' + error); }
            }
    
            //console.log(data)
            
            return data
          });
    }; //signal_storage()
    
    //============================
    const jsonfilename = `${'All-Trades-Result'}-${month}.${'json'}`
    const tradeResults  = `${'Trade-Results'}.${'json'}`//txtfilename
    
    
    ///=======================


            
    var signalbear25,entrybear25,derivtimer,beartickvalue25 ,previousbar25,currentbar25,tradewon25,tradelost25,winrate25
    var continuec = true; 
    //var lower_time = 60;
    var current_open;
    var lastTick ;
    var previous_open ;
    var previous_close ;
    var brkHigh,supportlevell,resistancelevel;
    var brkLow ;
    var brkMa ;
    var bar_size = 0.8;
    var bar_space = 0.05;
    var entry_size = 0.3;
    var ttlptlss = 0;
    var nofwons = 0;
    var noflosts = 0;
    var noftrades25 = 0;
    var win_rate;
    var activate, wickr;
    var previous_open3,previous_low,currentM9,previous_low3,previous_close3;
    var alertime, serverSecs, serverTimez,seconds;
    var exitbear25 = 0;
    var entry25status25 = "";
    var entrytickvalue25 = 0


    function checkserver() {

            
        const timerw = new Date();
        serverSecs = timerw.getSeconds();
        serverTimez = timerw.toLocaleTimeString();
        seconds = timerw.getSeconds();
        derivtimer =serverTimez
        

        //document.getElementById('tick-time').innerText = serverTimez

        
        
    } 

    function movingAvg() {
        
        // const index = document.getElementById("Index_vol").value;//indxxx//
        // const selected_index = `${index}`;
        var wsma = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=32150'); //1089
        //console.log('IDENTIFIED INDEX'+ selected_index)   
        var lower_timer = 900;
        
        wsma.onopen = function(evt) {
            try { 
                wsma.send(JSON.stringify(
                {ticks_history: "R_25",//"R_10",//selected_index,//
                    subscribe: 1,
                    adjust_start_time: 1,
                    count: 9,
                    end: "latest",
                    granularity: lower_timer,// 60, //lower_time
                    start: 1,
                    style: "candles"}),           
                );console.log('WEBSOCKET 1x send successfully'),
    
                setInterval(async() => {
                    checkserver()
                    //seconds = serverSecs
                    
                    //console.log('WEBSOCKET TIMER==>', serverTimez)
                    if (seconds == 0 || seconds == 1) {
                        wsma.send(JSON.stringify(
                            {ticks_history: "R_25",//"R_10",//selected_index,//selected_index,
                                //subscribe: 1,
                                adjust_start_time: 1,
                                count: 9,
                                end: "latest",
                                granularity: lower_timer,// 60, //lower_time
                                start: 1,
                                style: "candles"}),           
                            );//console.log('WEBSOCKET 12xxxxxxxx send successfully')
                    }
                }, 1000);
    
                
            } catch (err) {
                
            }
            
        }
        
        wsma.onmessage = function(msgx) {         
                try {
                    var datax = JSON.parse(msgx.data);
                    // var close = data.ohlc.close
                    // var open = data.ohlc.open
                    // console.log(open,'CURRENT PRICE =>',close,"/rn","==============================================");
                
                    var ftnHigh = datax.candles[7].high
                    var ftnLow = datax.candles[7].low
                    var avgClose = parseFloat((datax.candles[8].close
                    + datax.candles[7].close
                    + datax.candles[6].close
                    + datax.candles[5].close
                    + datax.candles[4].close
                    + datax.candles[3].close
                    + datax.candles[2].close 
                    + datax.candles[1].close 
                    + datax.candles[0].close)/9).toFixed(3);
                var avgCloseDown = avgClose 
                            
                //console.log('MOVING AVG:==>','\n',avgCloseDown);

                                        
                    function StdDevFunc() {
                        var dev = 0.0;
                        var ExtStdDevPeriod = 9
                        for( i = 0; i < ExtStdDevPeriod; i++)
                        dev += datax.candles[i].close;
                        dev = (dev/ExtStdDevPeriod);
                        dev = parseFloat(dev).toFixed(3);
                        brkMa = parseFloat(dev).toFixed(2);
                        //document.getElementById("movinglevel").innerText = parseFloat(dev).toFixed(2);
                        //console.log('ONEM52 =>',dev);
                        return(dev);
                    } StdDevFunc()
                    

                    //console.log(ftnHigh,'<== HIGH-FIFTEEN-LOW =>',ftnLow,'/n', StdDevFunc());
                    //document.getElementById("spot_tick").innerText = open2;
                    
                    brkLow = ftnLow;
                    brkHigh = ftnHigh;
                    
                    //Z console.log(brkLow,'<= BRKLOW//BRKMA =>',brkMa);
                //console.log('Previous-Bar-OPEN =>',previous_open, '\n', 'Last-tick=>',previous_close, '\n');
                //console.log('======================================================================');
        
                } catch (error) {
                    
                    //reconnect()
                } 
        }
        
        
        wsma.onclose = function(e) {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        setTimeout(function(error) {
            if (error !== "limit reach") {
                console.error('ONmsg ERROR ='+error);
                reconnect()
                return
                //console.log('Socket is closed. Restarting Afresh'+error);
            }
            
            
        }, 1000);
        };
    
        wsma.onerror = function(err) {
        if (err !== undefined) {
            console.error('Socket encountered error: ', err.message, 'Closing socket');
            wsma.close();
            
        }
        
        };
        //====================================================
        
        function reconnect() {
            wsma.close();
        
            console.log('WEBSOCKET RECONNECTING AFRESH: ')
            setTimeout(async() => {
                movingAvg()
            }, 2000);
            return
        }
        
        
        
        ////////////////MAIN INTERVAL SET UP FOR DATA FEED///////////////////////
        
    
        //first_logr() 
        return //{previous_open, previous_close}
    
    }movingAvg(); 

    
    function supportlevel() {
        
        // const index = document.getElementById("Index_vol").value;//indxxx//
        // const selected_index = `${index}`;
        var wsma = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=32150'); //1089
        //console.log('IDENTIFIED INDEX'+ selected_index)   
        var lower_timer = 60;
        
        wsma.onopen = function(evt) {
            try { 
                wsma.send(JSON.stringify(
                {ticks_history: "R_25",//"R_10",//selected_index,//
                    subscribe: 1,
                    adjust_start_time: 1,
                    count: 14,
                    end: "latest",
                    granularity: lower_timer,// 60, //lower_time
                    start: 1,
                    style: "candles"}),           
                ),//console.log('WEBSOCKET 1x send successfully'),
    
                setInterval(async() => {
                    
                    
                    if (seconds == 0 || seconds == 1) {
                        wsma.send(JSON.stringify(
                            {ticks_history: "R_25",//"R_10",//selected_index,//selected_index,
                                //subscribe: 1,
                                adjust_start_time: 1,
                                count: 14,
                                end: "latest",
                                granularity: lower_timer,// 60, //lower_time
                                start: 1,
                                style: "candles"}),           
                            );//console.log('WEBSOCKET 12xxxxxxxx send successfully')
                    }
                }, 1000);
    
                
            } catch (err) {
                
            }
            
        }
        
        wsma.onmessage = function(msgxy) {         
                try {
                    var dataxy = JSON.parse(msgxy.data);
                    // var close = data.ohlc.close
                    // var open = data.ohlc.open
                    // console.log(open,'CURRENT PRICE =>',close,"/rn","==============================================");
                        
                    // function StdDevFunc() {
                    //     var dev = 0.0;
                    //     var ExtStdDevPeriod = 9
                    //     for( i = 0; i < ExtStdDevPeriod; i++)
                    //     dev += dataxy.candles[i].close;
                    //     dev = (dev/ExtStdDevPeriod);
                    //     dev = parseFloat(dev).toFixed(3);
                    //     brkMa = parseFloat(dev).toFixed(2);
                    //     document.getElementById("spot_tick").innerText = parseFloat(dev).toFixed(2);
                    //     //console.log('ONEM52 =>',dev);
                    //     return(dev);
                    //   } //StdDevFunc()

                    function support() {
                        var dev = dataxy.candles[0].low;
                        var ExtStdDevPeriod = 12
                        for( i = 0; i < ExtStdDevPeriod; i++){
                            if (dataxy.candles[i].low < dev ) {
                                dev = dataxy.candles[i].low * 1;
                            }
                        }
                            supportlevell = dev;
                            //document.getElementById('lowlevel').innerText = dev;
                            //Z console.log('support level =>',dev);
                        
                            return(dev);
                        } support()
                        
                        function resistance() {
                            var dev = dataxy.candles[0].high;
                            var ExtStdDevPeriod = 12
                            for( i = 0; i < ExtStdDevPeriod; i++){
                                if (dataxy.candles[i].high > dev ) {
                                    dev = dataxy.candles[i].high * 1;
                                }
                            }
                            resistancelevel  = dev;
                            //document.getElementById('highlevel').innerText = dev;
                            //Zconsole.log('RESISTANCE level =>',dev);
                            
                            return(dev);
                        } resistance()

                        function nowm9() {
                            var dev = 0.0;
                            var ExtStdDevPeriod = 9
                            for( i = 5; i < 14; i++)
                            dev += dataxy.candles[i].close;
                            dev = (dev/ExtStdDevPeriod);
                            dev = parseFloat(dev).toFixed(3);
                            currentM9 = parseFloat(dev).toFixed(2);
                            //Z console.log('Current M9 =>',currentM9 * 1);
                            return(dev);
                        } nowm9()
                            
                    

                    //console.log(ftnHigh,'<== HIGH-FIFTEEN-LOW =>',ftnLow,'/n', StdDevFunc());
                    //document.getElementById("spot_tick").innerText = open2;
                    
                    //brkLow = ftnLow;
                    //brkHigh = ftnHigh;
                    
                //console.log('Previous-Bar-OPEN =>',previous_open, '\n', 'Last-tick=>',previous_close, '\n');
                //console.log('======================================================================');
        
                } catch (error) {
                    
                    //reconnect()
                } 
        }
        
        
        wsma.onclose = function(e) {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        setTimeout(function(error) {
            if (error !== "limit reach") {
                console.error('ONmsg ERROR ='+error);
                reconnect()
                return
                //console.log('Socket is closed. Restarting Afresh'+error);
            }
            
            
        }, 1000);
        };
    
        wsma.onerror = function(err) {
        if (err !== undefined) {
            console.error('Socket encountered error: ', err.message, 'Closing socket');
            wsma.close();
            
        }
        
        };
        //====================================================
        
        function reconnect() {
            wsma.close();
        
            console.log('WEBSOCKET RECONNECTING AFRESH: ')
            setTimeout(async() => {
                supportlevel()
            }, 2000);
            return
        }
        
        
        
        ////////////////MAIN INTERVAL SET UP FOR DATA FEED///////////////////////
        
    
        //first_logr() 
        return //{previous_open, previous_close}
    
    }supportlevel(); 


    function second_logr() {
        
    // const index = document.getElementById("Index_vol").value;//indxxx//
    // const selected_index = `${index}`;
        var wssl = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=32150'); //1089
        //console.log('IDENTIFIED INDEX'+ selected_index)   
        var lower_timer = 60;
        
        wssl.onopen = function(evt) {
            try { 
                wssl.send(JSON.stringify(
                {ticks_history: "R_25",//"R_10",//selected_index,//
                    subscribe: 1,
                    adjust_start_time: 1,
                    count: 4,
                    end: "latest",
                    granularity: lower_timer,// 60, //lower_time
                    start: 1,
                    style: "candles"}),           
                ),//console.log('WEBSOCKET 1x send successfully'),

                setInterval(async() => {
                    
                    //document.getElementById('tick-time').innerText = tradetimer
                    if (seconds == 0 || seconds == 1) {
                        wssl.send(JSON.stringify(
                            {ticks_history: "R_25",//"R_10",//selected_index,//selected_index,
                                //subscribe: 1,
                                adjust_start_time: 1,
                                count: 4,
                                end: "latest",
                                granularity: lower_timer,// 60, //lower_time
                                start: 1,
                                style: "candles"}),           
                            );//console.log('WEBSOCKET 12xxxxxxxx send successfully')
                    }
                }, 1000);

                
            } catch (err) {
            
            }
            
        }
        
        wssl.onmessage = function(msg) {         
                try {
                    var data = JSON.parse(msg.data);
                    
                    var close2 = data.candles[2].close
                    var open2 = data.candles[2].open
                    //console.log(open2,'PREVIOUS BAR =>',close2,'/n');
                    
                    previous_open3 = data.candles[0].open
                    previous_open = open2;
                    previous_close = close2;
                    previous_low = data.candles[2].low
                    previous_close3 = data.candles[1].close
                    previous_low3 = data.candles[1].low

                    //document.getElementById('lowlevel').innerText = previous_low;
                    //Z console.log(open2,'PREVIOUS BAR =>',close2,'/n',previous_open3, previous_low);
                    
                //console.log('Previous-Bar-OPEN =>',previous_open, '\n', 'Last-tick=>',previous_close, '\n');
                //console.log('======================================================================');
        
                } catch (error) {
                    
                

                } 
        }
        
        
        wssl.onclose = function(e) {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        setTimeout(function(error) {
            if (error !== "limit reach") {
                console.error('ONmsg ERROR ===========>'+error);
                reconnect()
                return
                //console.log('Socket is closed. Restarting Afresh'+error);
            }
            
            
        }, 1000);
        };
    
    wssl.onerror = function(err) {
        if (err !== undefined) {
            console.error('Socket encountered error: ', err.message, 'Closing socket');
            wssl.close();
            
        }
        
    };
        //====================================================
        
        function reconnect() {
            wssl.close();
        
            console.log('WEBSOCKET RECONNECTING AFRESH: ')
            setTimeout(async() => {
                second_logr()
            }, 2000);
            return
        }
        
        
        
        ////////////////MAIN INTERVAL SET UP FOR DATA FEED///////////////////////
        

        //first_logr() 
        return //{previous_open, previous_close}

    }second_logr(); // FOR PREVIOUS BARS


    function last_logr() {
        
        // const index = document.getElementById("Index_vol").value;//indxxx//
        // const selected_index = `${index}`;
        var wsll = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=32150'); //1089
        //console.log('IDENTIFIED INDEX'+ selected_index)   
        var lower_timer = 60;
        
        wsll.onopen = function(evt) {
            try { 
                wsll.send(JSON.stringify(
                {ticks_history: "R_25",//"R_10",//"R_25",//selected_index,//
                    subscribe: 1,
                    adjust_start_time: 1,
                    count: 1,
                    end: "latest",
                    granularity: lower_timer,// 60, //lower_time
                    start: 1,
                    style: "candles"}),           
                )//;console.log('WEBSOCKET 1x send successfully')
    
                
            } catch (err) {
            
            }
            
        }
        
        wsll.onmessage = function(msg) {         
                try {
                    var data = JSON.parse(msg.data);
                    var close = data.ohlc.close
                    var open = data.ohlc.open
                    //console.log(open,'CURRENT PRICE =>',close,"/rn","==============================================");
                
                    //document.getElementById("lastick").innerText = close;
                    
                    current_open = open; //current tick open
                    lastTick = close; //current tick
                    //beartickvalue25 = close
                //console.log('Previous-Bar-OPEN =>',previous_open, '\n', 'Last-tick=>',previous_close, '\n');
                //console.log('======================================================================');
        
                } catch (error) {
                
    
                } 
        }
        
        wsll.onclose = function(e) {
            console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
            setTimeout(function(error) {
                if (error !== "limit reach") {
                console.error('ONmsg ERROR ='+error);
                reconnect()
                    return
                //console.log('Socket is closed. Restarting Afresh'+error);
                }
                
                
            }, 1000);
        };
        
        wsll.onerror = function(err) {
            if (err !== undefined) {
                console.error('Socket encountered error: ', err.message, 'Closing socket');
                wsll.close();
                
            }
            
        };
        //====================================================
        
        function reconnect() {
            wsll.close();
        
            console.log('WEBSOCKET RECONNECTING AFRESH: ')
            setTimeout(async() => {
                last_logr()
            }, 2000);
            return
        }
        
        
        
        ////////////////MAIN INTERVAL SET UP FOR DATA FEED///////////////////////
        
    
        //first_logr() 
        return //{previous_open, previous_close}
    
    }last_logr(); // FOR PREVIOUS BARS
    

    //===================================================
    signalfeed = setInterval(connectsignal, 1000); //start function with interval


    async function connectsignal() {
    try {
        //setInterval(async() => {
           // dailyJsonfiling()

            let target = 100//(document.getElementById("target").innerText)*1;
            //let profitvalue = (document.getElementById("profitvalue").innerText)*1;
            let targetloss = (target * -3)
            var wick = parseFloat(current_open - lastTick).toFixed(3);
            currentbar25 = wick
            //document.getElementById('curbar25').innerText = wick

            // restarting SIgnal feed daily for fresh start
        
                //   if(profitvalue >= target || profitvalue <= targetloss){
                
                //       //throw new Error("Here we stop SIGNAL SENDING")
                //       setTimeout(() => {
                //           console.log('==THROWING EXITSIGNAL SENDING = '+ profitvalue); 
                //           continuec = false;
                //           clearInterval(signalfeed);
                //             ws.close();
                        
                //           return;
                        
                //       }, 15000);
            
                //   } else {
                //       //console.log(target,'==>Target/// Profit so far =>',profitvalue );
                //   }
                

            
            var secs = serverSecs;
            
            var tradetimer = serverTimez;
            //let spoty = (document.getElementById("spot_tick").innerText) * 1;
            //=========================================
            //var alertprice = (document.getElementById("priceAlertbear").value )*1;
           // console.log("this is alert price",alertprice)
                // if (alertprice != 0) {
                //     if (alertprice != 0 && lastTick <= alertprice  && lastTick > alertprice - 0.60) {
                //         try {
                //             //document.getElementById("priceAlertbear").innerText = 2000;
                //             const notificationzc = new Notification('ALERT From TMN-RDBEAR SIGNAL-Bot',{
                //                 body: `${'TMN-RDBEAR ALERT-NOTIFICATION =>'}${'ALERT PRICE = '}${alertprice}=>${'TIME = '}${tradetimer}${'\r\n'}${'LAST-TICK = '}${lastTick}${'\r\n'}`
                //             });
                //             document.getElementById("priceAlertbear").value = null
                //             alertprice = null;
                //             console.log("change alert price to ",alertprice)
                //             //notificationzc
                //             return 
                //         } catch (error) {
                            
                //         }
                //     }
                // }
                

                
                //console.log(tradetimer,' CONTINUE CHECK STATUS ==> ',continuec)
                //console.log("waiting for SET UP", lastTick)
            if (continuec) {
                /// console.log(current_open,"AM CHECKING HERE", previous_low)
                //DUMMY SIGNAL FOR TESTING ONLY
                
                //   if (secs == 57  ) { //|| secs == 57 
                //       console.log(' DUMMY SIGNAL SIGNAL ACTIVATED', tradetimer)
                //       continuec = false;//
                //       bearMinus()
                        
                //         tradelevel()//

                //         //console.log(' CONTINUE CHECK STATUS ==> ',continuec)
                //         return //
                //   }
                    

                    var sizedown = (previous_open3 - current_open) ;
                    var sizeUp = (current_open - previous_open3) ;
                    
                    //console.log(sizedown,'<= SIZE-DOWN / SIZE-UP', sizeUp)


                    if (seconds == 2 ) {//secs == 20 || secs == 21|| secs == 40 || secs == 41
                        //console.log(tradetimer, lastTick,' = CURRENT_OPEN ==> ',current_open)
                        current_open = current_open;
                        wickr = parseFloat((previous_open - previous_close)*1).toFixed(3);
                        var dwickr = parseFloat((previous_close - previous_open)*1).toFixed(3);
                        //Z console.log(tradetimer, dwickr,' <==BAR 2= /BARSIZE- STATUS/ BAR 1 ==> ',wickr)
                        //document.getElementById('prebar25').innerText = wickr
                        previousbar25 = wickr

                        // if (wickr >= 2) {
                        //     document.getElementById('prebar25').style.backgroundColor = "green";
                        //     document.getElementById('prebar25').style.color = "yellow";
                        // } else {
                        //     document.getElementById('prebar25').style.backgroundColor = "ash";//"grey" //"yellow";
                        //     document.getElementById('prebar25').style.color = "black";
                        // }
                    }

                    
                    // if ( previous_low3 < brkMa && lastTick < brkMa) {
                    //     if(previous_close3 > previous_open3 + 1 && previous_low < previous_low3 && previous_close <= previous_open - bar_size && lastTick < current_open && current_open < previous_open3){ 
                    
                    //         if (current_open - previous_low < 0.7 && lastTick <= previous_low - 0.02 && lastTick < current_open - 0.2 && previous_close <= previous_open - bar_size ) { //&& secs > 2 && secs < 30 
                    //             console.log('GENERAL -LOW-LOW SIGNAL ACTIVATED', tradetimer)
                    //             continuec = false;  
                    //             bearMinus()

                    //             tradelevel()
                                
                    //             return //
                    //         } else {console.log(lastTick,'<==XXX WAITING FOR BAR PB- FORMATION XXX==>',wickr, tradetimer)}
                    //     } else {
                    //         console.log(lastTick,'<==LASTTICK BELOW M9 ==>',wickr, tradetimer);
                    //     }
                    // } else{
                    //     console.log(brkMa,'<== BRK M9 /// LASTICK VALUE ==>', lastTick);
                    // }

                   
                    
                    
                    

                    if ( lastTick < brkLow &&  brkLow < brkMa) {
                        signalbear25 = "BELOW BRK LVL"
                        // document.getElementById('signal25').innerText = "BELOW BRK LVL"
                        // document.getElementById('signal25').style.backgroundColor = "green";
                        // document.getElementById('signal25').style.color = "yellow";

                        if(current_open < supportlevell && previous_close < supportlevell && previous_open > supportlevell  && previous_open3 - previous_close <= 3.5){
                           //Z console.log('SUPPORT LEVEL - LOW SIGNAL ACTIVATED', tradetimer)
                            if(previous_close < currentM9 && lastTick < currentM9 && current_open < supportlevell && previous_close <= previous_open - bar_size){//
                                // document.getElementById('entry25').innerText = "GET-READY"
                                entrybear25 ="GET-READY"
                                // document.getElementById('entry25').style.backgroundColor = "yellow";
                                // document.getElementById('entry25').style.color = "red";
                                if (current_open - previous_low < 0.4 && lastTick <= previous_low - 0.02 && lastTick < current_open - 0.1 && previous_close <= previous_open - bar_size && seconds > 2 && seconds < 30 ) {
                                    console.log('GENERAL -LOW-LOW SIGNAL ACTIVATED', tradetimer)
                                    // document.getElementById('entry25').innerText = "ENTER"
                                    entrybear25 = "ENTER"
                                    // document.getElementById('entry25').style.backgroundColor = "green";
                                    // document.getElementById('entry25').style.color = "yellow";
                                    continuec = false;  
                                    //bearMinus()
        
                                    tradelevel()

                                    //*  REPORTING
                                    // try {
                                    //     const timing = tradetimer
                                    //     alertime = timing
                                    //     var msgv = `${fullDate},${timing},${lastTick}\r\n` //vizer
                                    //     const logger = fs.createWriteStream(alertSignals,{ flags: 'a'},function(err, data) { 
                                    //     if (err) throw err;
                                    //     //console.log(data);
                                    //     })
                                        
                                    //     logger.write(msgv)
                                    //     logger.close()
                                    //    //Z console.log('TRADE RECORDED SUCCESSFULLY', msgv); 

                                        
                                        
                                    //     } catch (err) {
                                    //         console.error(err);   
                                    //     } 

                                    try {
                                        let bot = {
                                            TOKEN: '1237354844:AAGo0ifiF_QGk8NLr29T6ZBlBYVQoIwTuow',
                                            chatID: -1001875520417, // REPORT-github report group
                                    
                                        } 
                                        const signaltime = tradetimer
                                        var msgsx = `${'**********MASTER SERVER TMN-VOL R_25 =SIGNAL***********'}${'\r\n'}${'\r\n'}${'\r\n'}--${'TIME = '}${signaltime}${'\r\n'}${'LAST-TICK = '}${lastTick}${'\r\n'}${'\r\n'}${'\r\n'}--${'*************************************'}${'\r\n'}`
                                        var urlntx = ('https://api.telegram.org/bot' + bot.TOKEN + '/sendMessage?chat_id=' + bot.chatID + '&text=' + msgsx)
            
                                        fetch(urlntx);
                                        
                                        
                                        // const notificationz = new Notification('Notification From TMN-BEAR=SIGNAL-Bot',{
                                        //     body: `${'TMN-BEAR=SIGNAL-Bot =>'}-${'TIME = '}${tradetimer}${'\r\n'}${'LAST-TICK = '}${lastTick}${'\r\n'}`
                                        // });
                                    } catch (error) {
                                        console.log(error)
                                    }
                                    return //
                                } else {
                                   //Z console.log(lastTick,'<==LASTTICK BELOW PREVIOUS LOW==>',wickr, tradetimer)
                                }
                            } else {
                               //Z console.log(lastTick,'<==XXX WAITING FOR ENTRY FORMATION XXX==>',wickr, tradetimer);
                                // document.getElementById('entry25').innerText = "==WAITING=="
                                entrybear25 = "==HOLD-ON=="
                                // document.getElementById('entry25').style.backgroundColor = "ash";
                                // document.getElementById('entry25').style.color = "black";
                            }
                        } else {
                            //Z console.log(lastTick,'<==XXX WAITING FOR ENTRY FORMATION XXX==>',wickr, tradetimer);
                            // document.getElementById('entry25').innerText = "==HOLD-ON=="
                            entrybear25 = "==WAITING=="
                            // document.getElementById('entry25').style.backgroundColor = "ash";
                            // document.getElementById('entry25').style.color = "black";
                        }

                    }else {
                        signalbear25 = "==NIL=="
                        entrybear25 = "==NIL=="
                        // document.getElementById('signal25').innerText = "==NIL=="
                        // document.getElementById('signal25').style.backgroundColor = "ash";//"green";
                        // document.getElementById('signal25').style.color = "black";
                        // document.getElementById('entry25').innerText = "==NIL==";
                        // document.getElementById('entry25').style.backgroundColor = "ash";
                    }


                    
                        // if(previous_open < currentM9 && lastTick < currentM9 ){//&& current_open < supportlevell && previous_close <= previous_open - bar_size
                
                        //     if (current_open - previous_low < 1 && lastTick <= previous_low - 0.02 && lastTick < current_open - 0.1 && previous_close <= previous_open - bar_size && secs > 2 && secs < 30 ) {
                        //         console.log('GENERAL -LOW-LOW SIGNAL ACTIVATED', tradetimer)
                        //         continuec = false;  
                        //         higherWithMinus()

                        //         tradelevel()
                                
                        //         return //
                        //     } else {console.log(lastTick,'<==LASTTICK BELOW PREVIOUS LOW==>',wickr, tradetimer)}
                        // } else {
                        //     console.log(lastTick,'<==XXX WAITING FOR ENTRY FORMATION XXX==>',wickr, tradetimer);
                        // }
                    

                

                
            
                
            } else {
                //Z console.log('NO SIGNAL IS ALLOWED TO BROADCAST', tradetimer)
               //Z  console.log('----------------------------------------------')
            }

            //document.getElementById("lastick25").innerText = lastTick;
            beartickvalue25 = lastTick
            //===================
            
                tradewon25 =nofwons
                tradelost25 = noflosts

              //document.getElementById("profitvalue").innerText = ttlptlss;
            // document.getElementById("tradewon25").innerText = nofwons;
            // document.getElementById("tradelost25").innerText = noflosts;
               //document.getElementById("target").innerText = target;

            var winnn_rate = ((nofwons / (nofwons + noflosts)) * 100)
            win_rate = ((parseFloat(winnn_rate).toFixed(2)) * 1)
            //document.getElementById("winratio").innerText = win_rate;
            winrate25 = win_rate
            //===================
            const ate = new Date()
            const ont = ate.getMonth()
            
            if (ont > 7) { // JULY 2023
                //document.getElementById("datupdte2").innerText = "FREE VERSION EXPIRED - CONTACT -TMNMEDIA = 09011181115";     
                clearInterval(signalfeed);
                    ws.close();
                    
                    return;
            }
            //=======================
            
            return 
        
        //}, 1000);
    } catch (error) {
            
    }
    
    return 
    } //connectsignal() 


    function tradelevel() {
        continuec = false;
        noftrades25 = noftrades25 + 1
        //Z console.log('CONTINUE SIGNAL IS NOW =>', continuec);
        
        setTimeout(() => {
            entrybear25 = "ONGOING"
            // document.getElementById('entry25').innerText = "ONGOING"
            // document.getElementById('entry25').style.backgroundColor = "yellow";
            // document.getElementById('entry25').style.color = "black";
            const entrytick = lastTick * 1;
            entrytickvalue25 = entrytick
            exitbear25 =  ((parseFloat((entrytick - 0.55)).toFixed(4)) * 1)
            // document.getElementById('entrytick25').innerText = entrytick;
            // document.getElementById('exitick25').innerText = entrytick - 0.55;
            //console.log('CONTINUE SIGNAL IS NOW overRide =>', continuec);
            checkfeed = setInterval(checkingtrade, 1000);
            function checkingtrade() {
                if (lastTick <= entrytick - 0.5) {
                    entry25status25 = "WON"
                    //document.getElementById("entrystatus25").innerText = "WON";
                    nofwons = nofwons + 1;
                    clearInterval(checkfeed);
                    return
                } else if (lastTick >= entrytick + 2.5) {
                    //document.getElementById("entrystatus25").innerText = "LOST";
                    entry25status25 = "LOST" 
                    noflosts = noflosts + 1
                    clearInterval(checkfeed);
                    return
            
                }
                
            }
            

            setTimeout(() => {
                continuec = true;
                clearInterval(checkfeed);
                if(entry25status25 != "WON" && entry25status25 != "LOST" ){
                    entry25status25 = "LOST" 
                    noflosts = noflosts + 1
                    return

                }

                //FILLING REPORT ACTION
                //tradereportnow()
                
                // document.getElementById('entrytick25').innerText = 0;
                // document.getElementById('exitick25').innerText = 0;
                // document.getElementById("entrystatus25").innerText = "--";
               //Z console.log('CCHECKING PROFIT STATUS TO KNOW IF TO CONTINUE =>', continuec);
                return
            }, 80000);
        }, 2000);

    
    }

    

    function bearMinus() {
        const tokeninput = "g4cwZf1qAwx8Cy6"//`${tokenn}`;
        //const index = indxxx//document.getElementById("Index").value;
        const selected_index = "R_25"//"R_10"//`${index}`;
    // const WebSocket = require('ws');
        var ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=32150');
        const amount = 20//inputamount;
        var put_id = 0;
        var call_id = 0;
        var put_profit = 0;
        var call_profit = 0;
        var doubletrade_profit;
        ////////////////////////////////////////WEBSOCKET THINGS
        var call_report = ``; 
        var put_report = ``;
        var put_status = ``;
        var call_status = ``;
        var statusMonitor = ""
        var doubletrade_result = ""
        //var continuec = true;
        var index_signal = 0;
        const timerz = new Date();
        const day = timerz.toLocaleDateString();
        
        function authorized() {
            //var ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=32150'); // sample websocket'ws://localhost:8080'
    
            ws.onopen = function(evt) {
                try {
                    ws.send(JSON.stringify({authorize: tokeninput }))//"g4cwZf1qAwx8Cy6"
                } catch (error) {
                    console.error(err);
                    //ws.close();
                    //authorized();
                }
            
                
                try { 
                    ws.onmessage = function(msg) {
                    var data = JSON.parse(msg.data);
                    
                    //amount = parseFloat((stakepercentage /100) * data.authorize.balance).toFixed(0);
                    //console.log(amount, 'ACCOUNT AUTHORIZED-BALANCE: %o', data.authorize.balance);
                    
                
                }
                    setTimeout(() => {
                        buyContract() 
                        console.log('just checking whatsup');
                    }, 650);
                } catch (error) {
                    //console.error(error);
                }
                
            
            }
            return activate//contractId
        }  authorized()
    
        // ACTIVATING BUY CONTRACT STEP 2 
        function buyContract() {
            const bminus =  -0.48//"+0.15"//-b_offset;
            
            try {
                ws.send(JSON.stringify( //FIRST MAKE A  BUY PROPOSAL 
                {
                    proposal: 1,
                    amount: amount,
                    barrier: bminus,
                    basis: "stake",
                    contract_type: "ONETOUCH",//"CALL",//
                    currency: "USD",
                    duration: 4,
                    duration_unit: "m",
                    symbol: selected_index
                }
                
                ));console.log('READY TO BUY ORDER')
                //WAIIT FOR PROPOSAL 
                ws.onmessage = function(msg) {
                    var data = JSON.parse(msg.data);
                    
                    console.log('READY TO BUY ORDER');
                    // BUY THE CONTRACT BELOW
                    setTimeout(() => {
                        try {//BUYING THE CONTRACT 1- SELL DIRECTION
                            try {
                                ws.send(JSON.stringify({buy: data.proposal.id, price: amount})); // MAIN BUY PURCHASE OF PROPOSED CONTRACT
                            } catch (err) {
                                //console.error(err);
                                //ws.send(JSON.stringify({buy: data.proposal.id, price: amount})); // MAIN BUY PURCHASE OF PROPOSED CONTRACT
                            }
                        
                        ws.onmessage = function(msgq) {
                            try {
                                var dataq = JSON.parse(msgq.data);
                                const put_id11 = dataq.buy.contract_id
                                console.log('FIRST TOUCH PLUS PURCHASE', put_id11);
                                activate = amount;
                                
                                // DOUBLE BUY LEVEL BELOW
    
                                if (put_id11 !== 0) {
                                        
                                    ws.send(JSON.stringify({proposal_open_contract: 1, contract_id: dataq.buy.contract_id, subscribe: 1}));

                                    setTimeout(async() => {
                                        ws.send(JSON.stringify({proposal_open_contract: 1, contract_id: dataq.buy.contract_id, subscribe: 1}));

                                        try {
                                            ws.onmessage = function(msgc) {
                                                var datac = JSON.parse(msgc.data);
                                                var put_status1 = datac.proposal_open_contract.status;
                                                var put_profit1 = datac.proposal_open_contract.profit;
                                                var put_profitperct = datac.proposal_open_contract.profit_percentage;
                                                console.log('CHECKING STATUS PROFIT==>', '\r\n',datac.proposal_open_contract.profit);
                                        
                                                if (put_status1 == "lost") {
                                                    ttlptlss = ((parseFloat( ttlptlss + datac.proposal_open_contract.profit ).toFixed(2)) * 1); //compiling profits
                                                    noflosts = noflosts + 1
                                                    console.log(ttlptlss,'Trade Result from WON =',nofwons, "with total numbers of trade = ",noflosts)
                                                    ws.close();
            
                                                    return ttlptlss;
                                                } else if (put_status1 == "won") {
                                                    ttlptlss = ((parseFloat( ttlptlss + datac.proposal_open_contract.profit ).toFixed(2)) * 1); //compiling profits
                                                    nofwons = nofwons + 1
                                                    console.log(ttlptlss,'Trade Result from WON =',nofwons, "with total numbers of trade = ",noflosts)
                                                    ws.close();
            
                                                    return ttlptlss;
                                                }

                                                
                                            }
                                        } catch (err) {
                                            //console.error(err); 
                                        }
                                        
                                    }, 5000);
                                    
                                    
                                }
                                    
                                return
    
                            } catch (err) {
                                //console.error(err);
                            }
                            
                        
                
                        }
                        
                
                        } catch (err) {
                            //console.error(err);
                        }
                    }, 300);
                
                }
            
            } catch (err) {
                //console.error(err);
            }
    
            return statusMonitor;
        }//
    return 'Hello World!';
    } 

    function higherWithMinus() {
    const tokeninput = "g4cwZf1qAwx8Cy6"//`${tokenn}`;
    //const index = indxxx//document.getElementById("Index").value;
    const selected_index = "R_25"//"R_10"//`${index}`;
    // const WebSocket = require('ws');
    var ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=32150');
    const amount = 20//inputamount;
    var put_id = 0;
    var call_id = 0;
    var put_profit = 0;
    var call_profit = 0;
    var doubletrade_profit;
    ////////////////////////////////////////WEBSOCKET THINGS
    var call_report = ``; 
    var put_report = ``;
    var put_status = ``;
    var call_status = ``;
    var statusMonitor = ""
    var doubletrade_result = ""
    //var continuec = true;
    var index_signal = 0;
    const timerz = new Date();
    const day = timerz.toLocaleDateString();
        
    function authorized() {
        //var ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=32150'); // sample websocket'ws://localhost:8080'

        ws.onopen = function(evt) {
            try {
                ws.send(JSON.stringify({authorize: tokeninput }))//"g4cwZf1qAwx8Cy6"
            } catch (error) {
                console.error(err);
                //ws.close();
                //authorized();
            }
        
            
            try { 
                ws.onmessage = function(msg) {
                var data = JSON.parse(msg.data);
                
                //amount = parseFloat((stakepercentage /100) * data.authorize.balance).toFixed(0);
                //console.log(amount, 'ACCOUNT AUTHORIZED-BALANCE: %o', data.authorize.balance);
                
            
            }
                setTimeout(() => {
                    buyContract() 
                    console.log('just checking whatsup');
                }, 650);
            } catch (error) {
                //console.error(error);
            }
            
        
        }
        return activate//contractId
    }  authorized()

    // ACTIVATING BUY CONTRACT STEP 2 
    function buyContract() {
        const bminus =  -0.48//"+0.15"//-b_offset;
        
        try {
            ws.send(JSON.stringify( //FIRST MAKE A  BUY PROPOSAL 
            {
                proposal: 1,
                amount: amount,
                barrier: bminus,
                basis: "stake",
                contract_type: "ONETOUCH",//"CALL",//
                currency: "USD",
                duration: 5,
                duration_unit: "m",
                symbol: selected_index
            }
            
            ));console.log('READY TO BUY ORDER')
            //WAIIT FOR PROPOSAL 
            ws.onmessage = function(msg) {
                var data = JSON.parse(msg.data);
                
                console.log('READY TO BUY ORDER');
                // BUY THE CONTRACT BELOW
                setTimeout(() => {
                    try {//BUYING THE CONTRACT 1- SELL DIRECTION
                        try {
                            ws.send(JSON.stringify({buy: data.proposal.id, price: amount})); // MAIN BUY PURCHASE OF PROPOSED CONTRACT
                        } catch (err) {
                            //console.error(err);
                            //ws.send(JSON.stringify({buy: data.proposal.id, price: amount})); // MAIN BUY PURCHASE OF PROPOSED CONTRACT
                        }
                    
                    ws.onmessage = function(msgq) {
                        try {
                            var dataq = JSON.parse(msgq.data);
                            const put_id11 = dataq.buy.contract_id
                            console.log('FIRST TOUCH PLUS PURCHASE', put_id11);
                            activate = amount;
                            
                            // DOUBLE BUY LEVEL BELOW

                            if (put_id11 !== 0) {
                                        
                                ws.send(JSON.stringify({proposal_open_contract: 1, contract_id: dataq.buy.contract_id, subscribe: 1}));

                                setTimeout(async() => {
                                    ws.send(JSON.stringify({proposal_open_contract: 1, contract_id: dataq.buy.contract_id, subscribe: 1}));

                                    try {
                                        ws.onmessage = function(msgc) {
                                            var datac = JSON.parse(msgc.data);
                                            var put_status1 = datac.proposal_open_contract.status;
                                            var put_profit1 = datac.proposal_open_contract.profit;
                                            var put_profitperct = datac.proposal_open_contract.profit_percentage;
                                            console.log(put_status1,'CHECKING STATUS PROFIT==>', '\r\n',datac.proposal_open_contract.profit);
                                            var result_trade;
                                            if (put_profitperct <= -48) { //CHNGED FROM 56
                                                ws.send(JSON.stringify({sell: put_id11, price: 0}));
                                                console.log(' SOLD FROM TOUCHBUY -56% LOSS:==> %o');
                                                setTimeout(() => {
                                                    ws.send(JSON.stringify({proposal_open_contract: 1, contract_id: put_id11, subscribe: 1}));
                                                    ws.onmessage = function(msgp) {
                                                    var datap = JSON.parse(msgp.data);
                                                    result_trade = "lost"
                                                    var put_profit1oss = datap.proposal_open_contract.profit;
                                                    ttlptlss = ((parseFloat( ttlptlss + put_profit1oss ).toFixed(2)) * 1); //compiling profits
                                                    noflosts = noflosts + 1
                                                    console.log(ttlptlss,'Trade Result from WON =',nofwons, "with total numbers of trade = ",noflosts)
                                                    ws.close();
            
                                                    return ttlptlss;
                                                    }
                                                }, 4000);
                                                return 
                                            } else if (datac.proposal_open_contract.status == "won") {
                                                result_trade = "won"
                                                ttlptlss = ((parseFloat( ttlptlss + datac.proposal_open_contract.profit ).toFixed(2)) * 1); //compiling profits
                                                nofwons = nofwons + 1
                                                console.log(ttlptlss,'Trade Result from WON =',nofwons, "with total numbers of trade = ",noflosts)
                                                result_trade = "empty"
                                                ws.close();
                                                return ttlptlss;
                                            }
                                            setTimeout(() => {
                                                
                                                if (datac.proposal_open_contract.status !== "won" && datac.proposal_open_contract.status !== "sold") {
                                                    
                                                    try {
                                                    ws.send(JSON.stringify({sell: put_id11, price: 0}));
                                                    console.log(' SOLD AFTER 2MINS TOUCHBUY LOSS:==> %o');
                                                    
                                                    } catch (error) {
                                                    console.error('SELLING ERROR',error);
                                                    }
                                                
                                    
                                                    setTimeout(() => {
                                                    try {
                                                        ws.send(JSON.stringify({proposal_open_contract: 1, contract_id: put_id11, subscribe: 1}));
                                                        ws.onmessage = function(msgpr ) {
                                    
                                                        var datapr = JSON.parse(msgpr.data);
                                                        var put_profit1oss = datapr.proposal_open_contract.profit;
                                                        ttlptlss = ((parseFloat( ttlptlss + put_profit1oss ).toFixed(2)) * 1); //compiling profits
                                                        noflosts = noflosts + 1
                                                        console.log(ttlptlss,'Trade Result from WON =',nofwons, "with total numbers of trade = ",noflosts)
                                                        ws.close();
                                    
                                                        return ttlptlss;
                                                        
                                                        }
                                                    } catch (error) {
                                                        console.error('CONTRACT INFO AFTER = SELLING ERROR',error);
                                                    }
                                                    
                                                    }, 4000);

                                                    return
                                                } else {
                                                    ws.close();                                        
                                                    return ttlptlss; }
                                            }, 65000);//110000
            
                                        }
                                    } catch (err) {
                                        //console.error(err); 
                                    }
                                    
                                }, 6000); //from 15 - 6
                                
                                
                            }
                                
                            return

                        } catch (err) {
                            //console.error(err);
                        }
                        
                    
            
                    }
                    
            
                    } catch (err) {
                        //console.error(err);
                    }
                }, 300);
            
            }
        
        } catch (err) {
            //console.error(err);
        }

        return statusMonitor;
    }//
    return 'Hello World!';
    } //touchWithPlus()


    function checkservertimeB() {
        document.getElementById("datupdte2").innerText = "YOUR DEVICE TIME IS INCORRECT-KINDLY UPDATE YOUR TIME & REFRESH PAGE";     
        document.getElementById("datupdte2").style.color = "red";
        document.getElementById("bear").style.display = "none"
        clearInterval(signalfeed);
        ws.close();
        
        return; 
    } //checkserver()

    //reporting TRADE RESULTS
    
    async function tradereportnow() {
        fs.readFile(jsonfilename, 'utf-8', (error, data) => {
            if (error) {
                if (error.code === 'ENOENT') {//throw error;
                    const sample =[] 
                   const sampledata = {
                       Date: "16-6-2023",
                       AlertTime: "05:33:06",
                       EntryValue: 479.30,
                       TargetValue: 479.80,
                       TradeResult: "WON"
                   }
                    
                   let parseJson = JSON.stringify(sample, null, 2) 
                   fs.writeFile(jsonfilename,parseJson,finished)
                    console.log('file Created & saved successfully');
                    function finished (error){
                       if(error){
                       console.error(error)
                       return;
                       } 
                   }   
                        
                } else {    console.log('this is the DATA ==> ' + error.code); } //powerControl = true;
            };
    //============
            const dated = "18-6-2024"
            const alertTimer = "09:37:07"
            const entryValued = 979.30
            const targetValued = 978.70
            const TradeResult = "WON"
            
            if (data) {
                var words = JSON.parse(data)
                var sample1 = {
                   Date: "16-6-2023",
                   AlertTime: "06:33:06",
                   EntryValue: 1479.30,
                   TargetValue: 1479.80,
                   TradeResult: "LOST"
               }
   
               var sample2 = {
                   Date:  fullDate,
                   AlertTime: alertime,
                   EntryValue: entrytickvalue25,
                   TargetValue: exitbear25,
                   TradeResult: entry25status25
               }
               
               var samplify = words.concat(sample2)
                let wordify = JSON.stringify(samplify, null, 2)
                //let samplify = JSON.stringify(sample2, null, 2)
                //var combine = wordify.push(samplify)
   
   
   
                console.log('file Created & saved successfully',samplify);
              //var ggd = words[JSON.parse(combine)]
              //let parseJson2 = JSON.stringify(combine, null, 2)  
              addjson(samplify)
              
              
   
            }
            
             
        });
    }; 
    
   function addjson(ggd) {
       let parseJson2 = JSON.stringify(ggd, null, 2) 
               
        fs.writeFile(jsonfilename,parseJson2,finished)
        function finished (error){
            if(error){
            console.error(error)
            return;
            } 
        }
        entrybear25 = "---"
        exitbear25 = 0
        entry25status25 = "---"
        entrytickvalue25 = 0 
        return console.log('this is the DATA ==> ' + parseJson2);
       
   }



   //DAILY reporting TRADE RESULTS
   
   async function dailyJsonfiling() {
        const date = new Date()
        const day = date.getDate()
        const month = date.getMonth() + 1
        const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    var currentDay

    const timeNow = `${hours}:${minutes}`
    const timeNow2 = `${hours}:${minutes}:${seconds}`

    const previousDay = currentDay;
    currentDay =  day;
    
        if (currentDay > previousDay) {
            dailyreportnow()
            console.log('changed from-',previousDay,'to New value-', currentDay)
        
        return
        }

    //BACK UP IF ABOVE DIDNT WORK
    if (timeNow === '0:5'||timeNow === '0:20') {
        dailyreportnow()
        
        return console.log('working file creation') 
    }
        //console.log(timeNow2)
    }
    
async function dailyreportnow() {
    fs.readFile(tradeResults, 'utf-8', (error, data) => {
        if (error) {
            if (error.code === 'ENOENT') {//throw error;
                const sample =[] 
                
               let parseJson = JSON.stringify(sample, null, 2) 
               fs.writeFile(tradeResults,parseJson,finished)
                console.log('file Created & saved successfully');
                function finished (error){
                   if(error){
                   console.error(error)
                   return;
                   } 
               }   
                    
            } else {    console.log('this is the DATA ==> ' + error.code); } //powerControl = true;
        };
//============

        
        if (data) {
            var words = JSON.parse(data)
           
            var sample = {
                Date:  "16-6-2023",
                NofTrades25: 12,
                TradesWon: 9,
                TradeLost25: 3,
                WinRatio: 85
            }
           var sample2 = {
               Date:  fullDate,
               NofTrades25: noftrades25,
               TradesWon: tradewon25,
               TradeLost25: tradelost25,
               WinRatio: winrate25
           }
           
           var samplify = words.concat(sample2)
           

            console.log('file Created & saved successfully',samplify);
            dailyaddjson(samplify)
          
          

        }
        
         
    });
}; 

function dailyaddjson(ggd) {
   let parseJson2 = JSON.stringify(ggd, null, 2) 
           
    fs.writeFile(tradeResults,parseJson2,finished)
    function finished (error){
        if(error){
        console.error(error)
        return;
        } 
    }
    // tradewon25 = 0
    // tradelost25 = 0
    // winrate25= 0
    // noftrades25 = 0
    
    return console.log('this is the DATA ==> ' + parseJson2);
   
}
        
function logr25() {
    return {signalbear25,entrybear25,derivtimer,beartickvalue25,entry25status25,previousbar25,currentbar25,entrytickvalue25,exitbear25,tradewon25,tradelost25,winrate25,noftrades25}
}
    
 //  }  //
 module.exports = logr25


