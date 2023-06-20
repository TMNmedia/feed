const express = require('express')
const bodyParser = require('body-parser');
//const session = require("express-session");
const logr = require('./bear')
const logr25 = require('./vol25')
const app = express()
const Trade = require('./mongo');
const port = process.env.PORT || 3002;
const hostname = "0.0.0.0";


const logrbear = logr():
//milddlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));//was true before just changed to false
app.use(express.json());//just added

// app.use(session({
//     secret: "my secret key",
//     saveUninitialized: true,
//     resave: false
// }));

// app.use((req,res,next)=>{
//   res.locals.message = req.session.message;
//   delete req.session.message;
//   next();
// });
// Render static files
app.use(express.static('public'));

app.get('/data', (req, res) => {
  res.send(JSON.stringify(logrbear));
});

app.get('/data25', (req, res) => {
  res.send(JSON.stringify(logr25()));
});
// set template engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render("index");
  
})

app.get('/guide', (req, res) => {
  res.render("guide");
});

app.get('/report', (req, res) => {

  Trade.find({})
    .then((x)=>{
        res.render("report",{x});
        //res.send("Home Page");{title: "Home Page"}
    })
    .catch((y)=>{
        console.log('Error', y);
    })
   
  
});

app.get('/login', (req, res) => {
  res.render("login")
})

app.get('/register', (req, res) => {
  res.render("register")
})

app.listen(port,hostname, () => {
  console.log(`Example app listening on port ${port}`)
})

