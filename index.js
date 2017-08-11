let express = require('express');
let Bodyparser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let mysql = require('mysql');
let nodemailer = require('nodemailer');
let Crypto = require('node-crypto');
let urlencodedParser = Bodyparser.urlencoded({ extended: true });
let cp = new Crypto('you secret code');
let app = express();

app.use(express.static('public'));
app.use(Bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
    cookie: { maxAge: 60 * 1000 }
}));


let connection = mysql.createConnection({
    host: '119.28.63.95',
    user: 'myuser',
    password: 'hubuedu',
    port: '3306',
    database: 'twsjob',

});
/*连接发送邮件的邮箱*/
let mailTransport = nodemailer.createTransport({
    host: 'smtp.126.com',
    port: 25,
    secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
    auth: {
        user: 'thoughtworkersfive@126.com',
        pass: 'dalaodaifei555'
    },
});

connection.connect();

app.get('/testjobs', function(req, res) {
    let sql='select * from t_job';
    connection.query(sql, function(err, result) {
        if (err) throw err;
        res.send(result);
    });
})


/*2 根据工作职位过滤职位
3 根据工作性质过滤职位*/

app.post('/', urlencodedParser, function(req, res) {
    let jobtype = req.body.jobtype;
    let category = req.body.category;
    console.log(jobtype, category);
    let sql = 'select * from t_job where category=? and jobtype=?';
    let sqlinfor = [category, jobtype];
    connection.query(sql, sqlinfor, function(err, result) {
        if (err) throw err;
        res.send(result);
    });
});


// ## 7 用户查看自己创建的职位Post列表
// 作为已注册并登陆的用户（招聘者），我想浏览自己发布的所有工作 以便查看自己手上的所有招聘。
app.get('/myposts', function(req, res) {
    //得到用户的id
    let userid = req.session.userid;
    //查找用户的post
    let sql = 'select title,company from t_job where userid = ' + userid
    console.log(sql)
    connection.query(sql, function(err, result) {
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
app.get('/postdetial', function(req, res) {
    if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        return;
    }
    //得到工作的id
    let id = req.query.id;
    let sql = 'select * from t_job where id = ' + id
    console.log(sql)
    connection.query(sql, function(err, result) {
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
/*10 注册部分 start here */
/*发送邮件,将用户信息绑定在里面发送过去，并不完善,只有id,email,password,激活码的存放*/
app.post('/send', function(req, res, next) {
    /*得到前台的数据*/
    let email = req.body.email;
    let password = req.body.password;
    //邮件中显示的信息
    let html = "欢迎注册请<a href='http://localhost:8081/confirm?hex=" + cp.hex(email) + "'>点击此处</a>确认注册!";
    //sql语句插入语句
    let sql = 'insert into t_user (password,email,activeToken) values (?,?,?);';
    /*数据库中存hex数据,除了激活码是email 的base数据*/
    let sqlinfor = [cp.hex(password), cp.hex(email), cp.base(email)];
    connection.query(sql, sqlinfor, function(err, result) {
        if (err) {
            //插入失败，返回false，就是用户已经存在
            res.send(false);
        } else {
            /*设置邮件信息,如果可以插入数据库中*/
            let options = {
                from: 'ysj<thoughtworkersfive@126.com>',
                to: email,
                subject: '注册成功，请激活！',
                text: '欢迎注册',
                html: html
            };
            /*发送邮件*/
            mailTransport.sendMail(options, function(err, msg) {
                if (err) {
                    return console.log(err);
                } else {
                    console.log(msg);
                    res.send("发送成功！");
                }
            });
        }
    });
});
/*10 注册部分 end here */

/*邮箱中点击此处确定，返回到这个界面，将邮箱激活*/
app.get('/confirm', function(req, res, next) {
    let url = req.query;
    /*将传入的hex(email)转化为base ，在数据库中查询*/
    let sql = "update t_user set isactive=1 where activeToken='" + cp.hexToBase(url.hex) + "'";
    connection.query(sql, function(err, result) {
        if (err) throw err;
        else { //如果没有直接对数据库进行操作，不会返回error
            res.send("注册成功！");
        }
    });
});


/*11 登录部分 输入对象，返回字符串 start here*/
app.post('/sign_in', urlencodedParser, function(req, res) {
    let email=cp.hex(req.body.email);
    let password=cp.hex(req.body.password);
    let addSql = 'select * from t_user where email=?';
    let addSqlParams = [email];
    connection.query(addSql, addSqlParams, function(err, result) {
        if (err) throw err;
        if (result.length === 0) {
            res.send('null'); //用户不存在,则返回null
        } else {
            if (result[0].password !== password) {
                res.send('wrong') //用户存在，但密码错误,返回wrong
            } else {
                if (result[0].isactive === 0) {
                    res.send('inactivated') //用户存在,但账号未激活，返回inactivated
                } else {
                    req.session.user = result[0];
                    res.send('ok');
                } //用户存在,且账号已激活，返回OK
            }
        }
    })
});
/*11 登录部分 输入对象，返回字符串 end here*/
// //发送登陆界面[测试用]
// app.get('/test',function (req,res) {
//     res.sendFile(__dirname+'/public/login.html')
// })

/*获取职位详情
输入{id:4};
输出： //result为对象数组
    [ RowDataPacket {
userId: 0,
id: 4,
title: 'oo',
company: '77',
description: 'ss',
applyApproach: 'sss',
expiryDate: 'sss',
category: 'development',
jobType: 'volunteer',
tags: '0',
city: 'newyork',
country: 'usa' }]*/
app.get('/getJobDetail', function(req, res) {
    req.body = JSON.parse(req.body)
    let sql = 'SELECT * FROM t_job where id =' + req.body.id;
    connection.query(sql, function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            res.status(500).send('服务器发生错误');
        }
        res.send(result);

        connection.end();
    });
});
/*接收发布招聘的信息
输入：// {
userId:666,
title:'good',
company:'thoughtworks',
description:'goo',
applyApproach:'email',
expiryDate:'5years',
category:'manager',
jobType:'fulltime',
tags：'logo',
city:'shenzhen',
country:'China'
}
输出：成功：200添加成功
     失败：500服务器发生错误*/
app.post('/postJob', function(req, res) {
    let userId = req.session.user.id;
    let addSql = 'INSERT INTO t_job(userId,title,company,description,applyApproach,expiryDate,category,jobType,tags,city,country) VALUES(?,?,?,?,?,?,?,?,?,?,?)'
    console.log(req.body);
    let addSqlParams = [userId, req.body.title, req.body.company, req.body.description, req.body.applyApproach, req.body.expiryDate, req.body.category, req.body.jobType, req.body.tags, req.body.city, req.body.country];
    connection.query(addSql, addSqlParams, function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            res.status(500).send('服务器发生错误');
        }
        res.status(200).send('添加成功');
        connection.end();
    });
});
/**9获得用户详细信息
 * 输入：
 * 输出：req.session.user除密码之外的所有信息
 */
app.get('/userInfo', urlencodedParser, function(req, res) {
    let user = {};
    user.email = req.session.user.email;
    user.company = req.session.user.company;
    user.address = req.session.user.address;
    user.trade = req.session.user.trade;
    console.log('当前用户的信息如下：' + user);
    res.send(user);
})

/**9更改用户详细信息
 * 输入：用户详细信息：CurrentPassword，其他需要修改的信息，如company，password
 * 输出：req.session.user
 */
app.put('/userInfo', urlencodedParser, function(req, res) {
    let userInfo = { email: 'cr', currentPassword: 'c', company: 'd', address: 'd', trade: 'd', password: 'd', passwordConfirmation: 'd' }; //req.body
    let sql = null;
    let data = null;
    if (userInfo.password !== '') {
        sql = 'UPDATE t_user SET password = ?,company = ?,address=?,trade=? WHERE email = ? and password = ?'; //where后只能用and表示并，不能用都逗号
        data = [userInfo.password, userInfo.company, userInfo.address, userInfo.trade, userInfo.email, userInfo.currentPassword];
    } else {
        sql = 'UPDATE t_user SET company = ?,address=?,trade=? WHERE email = ? and password = ?'; //where后只能用and表示并，不能用都逗号
        data = [userInfo.company, userInfo.address, userInfo.trade, userInfo.email, userInfo.currentPassword];
    }
    connection.query(sql, data, function(err, reply) {
        res.send(reply.affectedRows);
        console.log('数据库有' + reply.affectedRows + '条数据修改成功');
    });
    let sqlSession = 'SELECT * FROM t_user WHERE email = ?';
    let dataSession = userInfo.email;
    connection.query(sqlSession, dataSession, function(err, reply) {
        req.session.user = reply[0];
        console.log(req.session);
        //res.send(req.session.user);
    });
})

/**9注销用户
 * 输入：
 * 输出：req.session.user//空值
 */
app.get('/loginout', urlencodedParser, function(req, res) {
    req.session.user = null;
    console.log('已注销');
    res.send(req.session.user);
})

/**
 * 12找回密码,点击找回密码，进入找回密码页面，里面包括email输入框和重置按钮
 * 输入：
 * 输出：
 */
app.get('/findPassword',urlencodedParser,function (req,res) {

})

/**
 * 12重置密码，点击重置按钮，发送验证码到邮箱,并跳转到填写验证码和密码界面
 * 输入：email
 * 输出：email，passwordCode(验证码)
 */
let passwordCode=parseInt(Math.random()*1000000);
app.post('/resettingPassword',urlencodedParser,function (req,res) {
    let email='2738794789@qq.com';//req.query.email
    console.log(passwordCode);
    let sql='QUERY isactive FROM t_user WHERE email = ?';
    let data=email;
    connection.query(sql,data,function (err,reply) {
        if(err) throw  err;
        if(reply===1){
            let content= "您的验证码是："+passwordCode+" 如非本人操作，请忽略此邮件";
            let options = {
                from           : 'cr<thoughtworkersfive@126.com>',
                to             :  email,
                subject        : '重置密码',
                text           : '验证码',
                html           :  content
            };
            mailTransport.sendMail(options, function(err, msg){
                if(err){
                    console.log(err);
                }
                else {
                    console.log(msg);
                }
            });
            let sql='UPDATE t_user SET passwordCode = ? WHERE email = ? ';
            let data=[passwordCode,email];
            connection.query(sql,data,function (err, reply) {
                console.log(reply);
                if(err) throw  err;
            });
        }else {
            res.send('该邮箱尚未注册，请先注册！')
        }
    })
})

/**
 * 12重置密码后登录，输入验证码和密码，点击登录按钮，直接进入主页
 * 输入：email，passwordCode,password，passwordConfirmation(登录页面填入的)
 * 输出：affectedRows(更改数据条数)
 */
app.put('/resettingLogin',function (req,res) {
    let email='2738794789@qq.com';//req.query.email;
    let inputPasswordCode=passwordCode;//req.body.passwordCode;
    let password='c2';//req.body.password
    let sqlCode='UPDATE t_user SET password = ?,passwordCode = ? WHERE email = ? and passwordCode = ?';
    let rePasswordCode=parseInt(Math.random()*1000000);
    console.log(rePasswordCode);
    let dataCode=[password,rePasswordCode,email,inputPasswordCode];
    connection.query(sqlCode,dataCode,function (err, reply) {
        if(err) throw  err;
        console.log(reply);
        res.send(reply.affectedRows);
    });
})

let server = app.listen(8081, function() {
    let host = server.address().address;
    let port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port);
});