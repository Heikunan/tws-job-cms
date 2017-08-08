let express = require('express');
let Bodyparser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let mysql = require('mysql');
let app = express();
app.use(Bodyparser.urlencoded({extended:true}));
app.use(cookieParser());

let connection = mysql.createConnection({
  host     : '119.28.63.95',
  user     : 'myuser',
  password : 'hubuedu',
  database : 'twsjob'
});

connection.connect();