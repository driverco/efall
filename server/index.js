const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const ENV = process.env.NODE_ENV;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.set('port', process.PORT||3000);

/*app.use('/api/users', require('./api/users'));
app.use('/api/calc', require('./api/calc'));*/

if (ENV === 'production') {
    console.log("Starting server in Production Mode");
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.use((req, res) => {
       res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
}

app.listen(app.get('port'), () => {
    console.log("EnglishForAll by Wilmer Rodriguez");
    console.log("---------------------------------");
    console.log("Server listening on port "+app.get('port')+"!");
    console.log("powered by Driverco");
    console.log("Starting Mode:"+process.env.NODE_ENV);
  });




module.exports = app;