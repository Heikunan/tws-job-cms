let express = require('express');
let Bodyparser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let mysql = require('mysql');
let app = express();
app.use(Bodyparser.urlencoded({extended:true}));
app.use(cookieParser());

var connection = mysql.createConnection({
  host: '119.28.63.95',
  user: 'myuser',
  password: 'hubuedu',
  port: '3306',
  database: 'twsjob',
});

connection.connect(function (err) {
  if (err) return console.log(err)
    console.log('connected')
});


// ## 7 用户查看自己创建的职位Post列表
// 作为已注册并登陆的用户（招聘者），我想浏览自己发布的所有工作 以便查看自己手上的所有招聘。
app.get('/myposts', function (req, res) {
  //得到用户的id
  let userid = req.session.userid;
  //查找用户的post
  let sql = 'select title,company from t_job where userid = ' + userid
  console.log(sql)
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    }

    console.log('--------------------------SELECT----------------------------');
    console.log(result);
    console.log('------------------------------------------------------------\n\n');
    //返回自己全部的post的title和company
    res.send(result)
  })
  // connection.end();
})

// ## 8 用户查看自己创建的职位Post详情
// 作为已注册并登陆的用户（招聘者)，我想浏览自己发布的某一个招聘工作的详细信息 以便知道该招聘的详细信息。
app.get('/post', function (req, res) {
  if (err) {
    console.log('[SELECT ERROR] - ', err.message);
    return;
  }
  //得到工作的id
  let id = req.query.id;
  let sql = 'select * from t_job where id = ' + id
  console.log(sql)
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    }

    console.log('--------------------------SELECT----------------------------');
    console.log(result);
    console.log('------------------------------------------------------------\n\n');
    //返回自己全部的post
    res.send(result)
  })
  // connection.end();
})


app.listen(8081, function () {
  console.log('listening!')
})

