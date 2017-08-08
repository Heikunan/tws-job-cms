let express = require('express');
let Bodyparser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let mysql = require('mysql');
let urlencodedParser = bodyParser.urlencoded({ extended: true });
let app = express();
app.use(cookieParser());

let connection = mysql.createConnection({
    host: '119.28.63.95',
    user: 'myuser',
    password: 'hubuedu',
    database: 'twsjob'
});

connection.connect();

app.get('/', function (req, res) {
    let sql = 'SELECT * FROM T_jobtype';
    connection.query(sql, function (err, ans) {
        res.send(ans);
    })
})

app.listen(3000);