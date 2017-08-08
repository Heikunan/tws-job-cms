let express = require('express');
let Bodyparser = require('body-parser');
let cookieParser = require('cookie-parser');
let mysql = require('mysql');

let app = express();
app.use(cookieParser());