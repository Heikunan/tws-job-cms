let express = require('express');
let Bodyparser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let mysql = require('mysql');
let nodemailer  = require('nodemailer');
let Crypto = require('node-crypto');
let urlencodedParser = Bodyparser.urlencoded({ extended: true });
let cp = new Crypto('you secret code');

let app = express();
app.use(Bodyparser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
    secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
    cookie: { maxAge: 60 * 1000 }
}));


var connection = mysql.createConnection({
  host: '119.28.63.95',
  user: 'myuser',
  password: 'hubuedu',
  port: '3306',
  database: 'twsjob',

});
/*连接发送邮件的邮箱*/
let mailTransport = nodemailer.createTransport({
    host : 'smtp.126.com',
    port: 25,
    secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
    auth : {
        user : 'thoughtworkersfive@126.com',
        pass : 'dalaodaifei555'
    },
});

connection.connect();

app.get('/',function (req,res) {
    res.sendFile( __dirname + "/" + "l.html" );
})


/*2 根据工作职位过滤职位
3 根据工作性质过滤职位*/
app.post('/',urlencodedParser,function (req,res) {
  let jobtype=req.body.jobtype;
  let category=req.body.category;
  console.log(jobtype,category);
    let sql='select * from t_job where category=? and jobtype=?';
    let sqlinfor=[category,jobtype];
    connection.query(sql,sqlinfor,function (err, result) {
        if(err) throw  err;
        res.send(result);
    });
});
///////////////////*杨邵军的测试*/////////////////////////////////////////////

/*将用户登陆的数据传入*/
app.get('/login',urlencodedParser, function (req, res) {
    let username=req.body.username;     //req.body.username;
    let password=req.body.password;     //req.body.password;
    let sql='select * from t_user where email=? and password=?';        //sql查询语句
    let sqlinfor=[username,password];               //sql问号的值
    connection.query(sql,sqlinfor,function (err, result) {
        if(err) throw  err;
        if(result.length===0){
          res.send(false);          //不存在这个用户,返回false;
        }
        else{
            req.session.user=result[0];//将登陆的用户存入session
            res.send(result[0]);        //返回查找结果，也是session 的用户
       }
    });
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
app.get('/postdetial', function (req, res) {
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




//////////////////////////*杨邵军的测试*//////////////////////////////////////////
/*发送邮件,将用户信息绑定在里面发送过去，并不完善,只有id,email,password,激活码的存放*/
app.post('/send', function(req, res, next) {
    /*得到前台的数据*/
    let id=req.body.id;
    let email=req.body.email;
    let password=req.body.password;
    //邮件中显示的信息
    let html="欢迎注册请<a href='http://localhost:8081/confirm?hex="+cp.hex(email)+"'>点击此处</a>确认注册!";
    //sql语句插入语句
    let sql='insert into t_user (id,password,email,activeToken) values (?,?,?,?);';
    /*数据库中存hex数据,除了激活码是email 的base数据*/
    let sqlinfor=[parseInt(id),cp.hex(password),cp.hex(email),cp.base(email)];
    connection.query(sql,sqlinfor,function (err,result) {
        if(err) {
            //插入失败，返回false，就是用户已经存在
            res.send(false);
        }else{
            /*设置邮件信息,如果可以插入数据库中*/
            let options = {
                from           : 'ysj<thoughtworkersfive@126.com>',
                to             :  email,
                subject        : '注册成功，请激活！',
                text           : '欢迎注册',
                html           :  html
            };
            /*发送邮件*/
            mailTransport.sendMail(options, function(err, msg){
                if(err){
                    return console.log(err);
                }
                else {
                    console.log(msg);
                    res.send("发送成功！");
                }
            });
        }
    });
});

/*邮箱中点击此处确定，返回到这个界面，将邮箱激活*/
app.get('/confirm', function(req, res, next) {
    let url=req.query;
    /*将传入的hex(email)转化为base ，在数据库中查询*/
    let sql="update t_user set active=1 where activeToken='"+cp.hexToBase(url.hex)+"'";
    connection.query(sql,function (err, result) {
        if(err) throw  err;
        else {          //如果没有直接对数据库进行操作，不会返回error
            res.send("注册成功！");
        }
    });
});
/*11 登录部分 输入对象，返回字符串 start here*/
app.post('/sign_in',urlencodedParser,function (req,res){
    // let email=cp.hex(req.body.email);
    // let password=cp.hex(req.body.password);
    let email=req.body.email;
    let password=req.body.password;
    console.log(email,password);
    let  addSql = 'select * from t_user where email=?';
    let  addSqlParams = [email];
    connection.query(addSql,addSqlParams,function (err, result) {
        console.log(result);
        if(err) throw  err;
        if (result.length===0) {
            res.send('null');//用户不存在,则返回null
        }else{
            if (result[0].password!==password) {
                res.send('wrong')//用户存在，但密码错误,返回wrong
            }else{
                if (result[0].isactive===0) {
                    res.send('inactivated')//用户存在,但账号未激活，返回inactivated
                }else{
                    req.session.user=result[0];
                    res.send('ok');}//用户存在,且账号已激活，返回OK
            }
        }
    })
});
/*11 登录部分 输入对象，返回字符串 end here*/

//获取职位详情
// 输入{id:4};
// 输出： //result为对象数组
//     [ RowDataPacket {
// userId: 0,
// id: 4,
// title: 'oo',
// company: '77',
// description: 'ss',
// applyApproach: 'sss',
// expiryDate: 'sss',
// category: 'development',
// jobType: 'volunteer',
// tags: '0',
// city: 'newyork',
// country: 'usa' }]
app.get('/getJobDetail', function (req, res) {
    req.body=JSON.parse(req.body)
    let sql = 'SELECT * FROM t_job where id ='+req.body.id;
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            res.status(500).send('服务器发生错误');
        }
        res.send(result);

        connection.end();
    });
});
//接收发布招聘的信息
//输入：// {
// userId:666,
// title:'good',
// company:'thoughtworks',
// description:'goo',
// applyApproach:'email',
// expiryDate:'5years',
// category:'manager',
// jobType:'fulltime',
// tags：'logo',
// city:'shenzhen',
// country:'China'
//}
//输出：成功：200添加成功
//      失败：500服务器发生错误
app.post('/postJob', function (req, res) {
    let userId=req.session.user.id;
    let addSql = 'INSERT INTO t_job(userId,title,company,description,applyApproach,expiryDate,category,jobType,tags,city,country) VALUES(?,?,?,?,?,?,?,?,?,?,?)'
    console.log(req.body);
    let addSqlParams = [userId, req.body.title, req.body.company, req.body.description, req.body.applyApproach, req.body.expiryDate, req.body.category, req.body.jobType, req.body.tags, req.body.city, req.body.country
    ];
    connection.query(addSql, addSqlParams, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            res.status(500).send('服务器发生错误');
        }
        res.status(200).send('添加成功');
        connection.end();
    });
});

let server = app.listen(8081, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port);
});

