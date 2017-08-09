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

/*连接数据库*/
let connection = mysql.createConnection({
  host     : '119.28.63.95',
  user     : 'myuser',
  password : 'hubuedu',
  database : 'twsjob'
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
                    console.log(err);
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
/*11 登录部分 检查用户是否存在，并返回false/inactivated/用户对象 start here*/
app.post('/sign_in',urlencodedParser,function (req,res){
    let email=cp.hex(req.body.email);
    let pw=cp.hex(req.body.password);
    let  addSql = 'select * from t_user where email=? and password=?';
    let  addSqlParams = [email,pw];
    connection.query(addSql,addSqlParams,function (err, result) {
        if(err) throw  err;
        if (result.length===0) {
            res.send(false);//用户不存在返回false
        }else{
            if (result[0].active===0) {
                res.send('inactivated')//用户存在且账号未激活，返回inactivated
            }else{
            req.session.user=result[0];
            res.send(result[0]);}//用户存在且账号已激活，返回用户对象
        }
    })
});

let server = app.listen(8081, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port);
});
