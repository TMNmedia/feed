const express = require('express')
const bodyParser = require('body-parser');
const logr = require('./bear')
const logr25 = require('./vol25')
const app = express()
const port = process.env.PORT || 3002;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const hostname = "0.0.0.0";


// Render static files
app.use(express.static('public'));

app.get('/data', (req, res) => {
  res.send(JSON.stringify(logr()));
});

app.get('/data25', (req, res) => {
  res.send(JSON.stringify(logr25()));
});

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  //res.send('./views/index.html')
  res.render('index')
})

// app.use(, (err) => {
//     console.log(`error from using bear file ${err}`)
//   })
app.listen(port,hostname, () => {
  console.log(`Example app listening on port ${port}`)
})

