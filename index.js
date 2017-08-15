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
    name: 'twsjob',
    secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
    cookie: { maxAge: 600 * 1000 }
}));

let connection = mysql.createConnection({
    host: '47.94.199.111',
    user: 'tws',
    password: '123456',
    port: '3306',
    database: 'twsjob'
});
connection.connect();


/**连接发送邮件的邮箱*/
let mailTransport = nodemailer.createTransport({
    host: 'smtp.126.com',
    port: 25,
    secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
    auth:{
        user: "thoughtworkersfive@126.com",
        pass: "111aaa"
    }
});


/*查找所有的工作性质*/
app.get('/getcategory',function (req,res) {
    let sql='select * from t_category';
    connection.query(sql, function(err, result) {
        if (err) throw err;
        res.send(result);
    });
});
/*查找所有的工作类型*/
app.get('/getjobtype',function (req,res) {
    let sql='select * from t_jobtype';
    connection.query(sql, function(err, result) {
        if (err) throw err;
        res.send(result);
    });
});

/*返回一共条数*/
app.get('/gettotal', function(req, res) {
    let sql='select * from t_job';
    connection.query(sql, function(err, result) {
        if (err) console( err);
        res.send({length:result.length});
    });
});

/* 进入用户个人中心*/
app.get('/myinfo',function (req,res) {
    //测试用
    req.session.user = {
        id:'1234',
        email: '951576941@qq.com',
        company: 'szx',
        address: 'wuhan',
        trade: 'studnet'
    };
    res.sendFile( __dirname + "/public/" + "userInfo.html");
});

app.post('/testjobs', function(req, res) {
    //let mynum = parseInt(req.body.num);
    let sql=`SELECT * FROM t_job LIMIT 0,6`;
    connection.query(sql, function(err, result) {
        if (err) throw err;
        res.send(result)
    });
});



/*#2 根据工作职位过滤职位
#3 根据工作性质过滤职位
#4搜索职位*/
app.post('/searchjobs', urlencodedParser, function(req, res) {
    let jobtype = req.body.jobtype;
    let category = req.body.category;
    let jobname =req.body.jobname;
    console.log(jobtype, category);
    let sql = "select * from t_job where category like '%"+category+"%' and jobtype like '%"+jobtype+"%' and title like '%"+jobname+"%'";
    connection.query(sql, function(err, result) {
        if (err) throw err;
        res.send(result);
    });
});


/*
#5查看职位详情
 */
app.get('/getJobDetail/id=:id',function(req,res){
    res.sendFile(__dirname + "/public/" + "jobInfo.html");
});
app.post('/getJobDetail/id=:id', function(req, res) {
    console.log(req.body);
    let sql = 'SELECT * FROM t_job where id =' + req.body.id;
    connection.query(sql, function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            res.status(500).send('服务器发生错误');
        }
        else{
            res.send(result);
        }
    });
});

/*在详细页面得到推荐工作
 */
app.post('/getSuggestion',function(req,res){
    let jobtype = req.body.type;
    let category = req.body.category;
    let title = req.body.title;
    console.log(jobtype, category);
    let sql = 'select * from t_job where category=? or jobType=? or title like ?';
    let sqlinfor = [category, jobtype,`%${title}%`];
    connection.query(sql, sqlinfor, function(err, result) {
        if (err) throw err;
        res.send(result);
    });
});

/*
#6发布一个职位
输入：招聘表单内容
输出：成功：200添加成功
     失败：500服务器发生错误
 */
app.post('/postJob', function(req, res) {
    //  req.body = JSON.parse(req.body);
    console.log(req.body);
    // let userId = req.session.user.id;
    let userId='1';
    let likes=0;
    let releaseTime=new Date(Date.now());
    console.log(releaseTime);
    // let addSql='INSERT INTO t_test(userId) VALUES (?)';
    // let addSqlParams=['1'];
    req.body.tags=req.body.tags[0]+','+req.body.tags[1];
    req.body.benefits=req.body.benefits[0]+','+req.body.benefits[1];
    let addSql = 'INSERT INTO t_test(userId,title,company,description,applyApproach,expiryDate,category,jobType,tags,city,country,num,benefits,releaseTime,area,companyType,companySize,Logo,likes,companyIntroduce,salary,education) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    let addSqlParams = [userId, req.body.title, req.body.company, req.body.description, req.body.applyApproach, req.body.expiryTime, req.body.category, req.body.jobType, req.body.tags, req.body.city, req.body.country, req.body.number, req.body.benefits, releaseTime, req.body.area, req.body.companyType, req.body.companySize, req.body.companyLogo, likes,req.body.companyIntroduce,req.body.salary,req.body.Educational];
    connection.query(addSql, addSqlParams, function(err, result) {
        console.log(result);
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            res.status(500).send('服务器发生错误');
        }else{
            res.status(200).send('添加成功');
        }
        console.log('end');
    });
});
app.get('/postJob',function(req,res){
    res.sendFile( __dirname + "/public/" + "jobPost.html");
});


/*7 用户查看自己创建的职位Post列表
作为已注册并登陆的用户（招聘者），我想浏览自己发布的所有工作 以便查看自己手上的所有招聘。
*/
app.get('/myposts', function(req, res) {
    //得到用户的id
    let userid = req.session.user.id;
    //查找用户的post
    let sql = 'select title,company from t_job where userid = ' + userid;
    console.log(sql);
    connection.query(sql, function(err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            console.log('--------------------------SELECT----------------------------');
            console.log(result);
            console.log('------------------------------------------------------------\n\n');
            //返回自己全部的post的title和company
            res.send(result);
        })
});

/* #8 用户查看自己创建的职位Post详情
作为已注册并登陆的用户（招聘者)，我想浏览自己发布的某一个招聘工作的详细信息 以便知道该招聘的详细信息。
 */
app.get('/postdetial', function(req, res) {
    if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        return;
    }
    //得到工作的id
    let id = req.query.id;
    let sql = 'select * from t_job where id = ' + id;
    console.log(sql);
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
});

/*#9获得用户详细信息
 输入：
 输出：req.session.user除密码之外的所有信息
 */

app.get('/getUserInfo', urlencodedParser, function(req, res) {
    if(req.session.user){
        let user = {};
        user.email = req.session.user.email;
        user.company = req.session.user.company;
        user.address = req.session.user.address;
        user.trade = req.session.user.trade;
        user.id = req.session.user.id;
        user.status = req.session.user.status;
        user.identity = req.session.user.identity;
        res.send(user);
    }else {
        res.send('no');
    }

});

/*
 * #9修改用户基本信息
 * 输入：用户id
 * 输出：1或0，表示用户信息是否更新成功
 */
app.post('/changeUserInfo', urlencodedParser, function(req, res) {
    let sql = 'UPDATE t_user SET company = ?,address=?,trade=? WHERE id = ? ';
    let data = [req.body.company, req.body.address, req.body.trade,req.session.user.id];
    connection.query(sql, data, function(err, reply) {
        if (err) {
            console.log('error!' + err);
            res.send('error');
        }
        res.send(''+reply.affectedRows);
        console.log('数据库有' + reply.affectedRows + '条数据修改成功');
    });
});

/*
 * #9修改用户密码
 * 输入：用户id和当前密码
 * 输出：1或0，表示用户信息是否更新成功
 */
app.get('/changePsw',function (req,res) {
    let sql = 'UPDATE t_user SET password = ? WHERE id = ? and password=? ';
    console.log(req.query.newPsw);
    let data = [req.query.newPsw, req.session.user.id,req.query.currentPsw];
    connection.query(sql, data, function(err, reply) {
        if (err) {
            console.log('error!' + err);
            res.send('error');
        }
        res.send(''+reply.affectedRows);
        console.log('数据库有' + reply.affectedRows + '条数据修改成功');
    });
});

/*
 * #9注销登陆
 * 输入：用户user
 * 输出：用户user（若注销成功已为空值）
 */
app.get('/loginout', urlencodedParser, function(req, res) {
    req.session.user = null;
    console.log('已注销');
    res.send('OK');
});



/*10 注册部分
发送邮件,将用户信息绑定在里面发送过去，并不完善,只有id,email,password,激活码的存放
*/
app.post('/send', function(req, res, next) {
    /*得到前台的数据*/
    let email = req.body.email;
    console.log(email);
    let password = req.body.password;
    let password_conf=req.body.password_conf;
    let myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if(!myreg.test(email)){
        res.send('wrong_em')//邮箱格式错误，返回wrong_em
    } else if (password!==password_conf){
        res.send('wrong_ps')//两次密码不一致，返回wrong_pw
    }else{
    //邮件中显示的信息
    let html = "欢迎注册本公司账号，请<a href='http://localhost:8081/confirm?hex=" + cp.hex(email) + "'>点击此处</a>激活账号！点击链接后页面将跳转至首页。";
    //sql语句插入语句
    let sql = 'insert into t_user (password,email,activeToken,status,identity) values (?,?,?,?,?);';
    /*数据库中存hex数据,除了激活码是email 的base数据*/
    let sqlinfor = [password, email, cp.base(email),'待审核','职位发布者'];
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
                    console.log(true);
                    res.send(true);
                }
            });
        }
    });
    }
});
app.get('/tjobcount',function (req,res) {
    let sql = 'select count(*) from t_job';
    connection.query(sql,function (err,result) {
        if(err){
            throw err;
        }else {
            res.send(result[0]);
        }
    })
});
//再次发送验证邮件
app.post('/resend', function(req, res) {
    /*得到前台的数据*/
    let email = req.body.email;
    //在数据库中查找
    let addSql = 'select * from t_user where email=?';
    let addSqlParams = [email];
    connection.query(addSql, addSqlParams, function (err, result) {
        if (err) throw err;
        if (result.length === 0) {
            res.send('null'); //用户不存在,则返回null
        } else {
            //邮件中显示的信息
            let html = "欢迎注册本公司账号，请<a href='http://localhost:8081/confirm?hex=" + cp.hex(email) + "'>点击此处</a>激活账号！点击链接后页面将跳转至首页。";
            let options = {
                from: 'thoughtworkersfive<thoughtworkersfive@126.com>',
                to: email,
                subject: '注册成功，请激活！',
                text: '欢迎注册',
                html: html
            };
            /*发送邮件*/
            mailTransport.sendMail(options, function (err, msg) {
                if (err) {
                    return console.log(err);
                } else {
                    res.send(true);
                }
            });
        }
    });
});

/* 注册部分
邮箱中点击此处确定，返回到这个界面，将邮箱激活*/
app.get('/confirm', function(req, res, next) {
    let url = req.query;
    /*将传入的hex(email)转化为base ，在数据库中查询*/
    let sql = "update t_user set isactive=1 where activeToken='" + cp.hexToBase(url.hex) + "'";
    connection.query(sql, function(err, result) {
        if (err) throw err;
        else { //如果没有直接对数据库进行操作，不会返回error
            res.redirect('/');
        }
    });
});

/*#11 登录部分
输入对象，返回字符串
*/
app.post('/login', urlencodedParser, function(req, res) {
    let email=req.body.email;
    let password=req.body.password;
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
                    result[0].email = req.body.email;
                    req.session.user = result[0];
                    res.send('ok');
                } //用户存在,且账号已激活，返回OK
            }
        }
    })
});

app.post('/getJobDetail',urlencodedParser, function(req, res) {
    console.log(req.body);
    let sql = 'SELECT * FROM t_job where id =' + req.body.id;
    connection.query(sql, function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            res.status(500).send('服务器发生错误');
        }
        else{
            console.log(result);
            res.send(result);
        }
    });
});

app.get('/postJob',function(req,res){
    res.sendFile( __dirname + "/public/" + "jobPost.html");
});
/*接收发布招聘的信息
输入：招聘表单内容
输出：成功：200添加成功
     失败：500服务器发生错误
*/

app.post('/postJob', function(req, res) {
    //  req.body = JSON.parse(req.body);
    console.log(req.body);
    // let userId = req.session.user.id;
    let userId='1';
    let likes=0;
    let releaseTime=new Date(Date.now());
    console.log(releaseTime);
    // let addSql='INSERT INTO t_test(userId) VALUES (?)';
    // let addSqlParams=['1'];
    req.body.tags=req.body.tags[0]+','+req.body.tags[1];
    req.body.benefits=req.body.benefits[0]+','+req.body.benefits[1];
    let addSql = 'INSERT INTO t_test(userId,title,company,description,applyApproach,expiryDate,category,jobType,tags,city,country,num,benefits,releaseTime,area,companyType,companySize,Logo,likes,companyIntroduce,salary,education) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    let addSqlParams = [userId, req.body.title, req.body.company, req.body.description, req.body.applyApproach, req.body.expiryTime, req.body.category, req.body.jobType, req.body.tags, req.body.city, req.body.country, req.body.number, req.body.benefits, releaseTime, req.body.area, req.body.companyType, req.body.companySize, req.body.companyLogo, likes,req.body.companyIntroduce,req.body.salary,req.body.Educational];
    connection.query(addSql, addSqlParams, function(err, result) {
        console.log(result);
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            res.status(500).send('服务器发生错误');
        }else{
            res.status(200).send('添加成功');
        }
        console.log('end');
    });
});
app.post('/getSuggestion',function(req,res){
    let jobtype = req.body.type;
    let category = req.body.category;
    let title = req.body.title;
    console.log(jobtype, category);
    let sql = 'select * from t_job limit 0,4 where category=? or jobType=? or title like ?';
    let sqlinfor = [category, jobtype,`%${title}%`];
    connection.query(sql, sqlinfor, function(err, result) {
        console.log(result);
        if (err) throw err;
        res.send(result);
    });


});

/**#9获得用户详细信息
输入：
输出：req.session.user除密码之外的所有信息
 */

app.get('/getUserInfo', urlencodedParser, function(req, res) {
    let user = {};
    user.email = req.session.user.email;
    user.company = req.session.user.company;
    user.address = req.session.user.address;
    user.trade = req.session.user.trade;
    // console.log('当前用户的信息如下：' + user);
    res.send(user);
});

/**
 * #9修改用户基本信息
 * 输入：用户id
 * 输出：1或0，表示用户信息是否更新成功
 */
app.post('/changeUserInfo', urlencodedParser, function(req, res) {
    let sql = 'UPDATE t_user SET company = ?,address=?,trade=? WHERE id = ? ';
    let data = [req.body.company, req.body.address, req.body.trade,req.session.user.id];
    connection.query(sql, data, function(err, reply) {
        if (err) {
            console.log('error!' + err);
            res.send('error');
        }
        res.send(reply.affectedRows);
        console.log('数据库有' + reply.affectedRows + '条数据修改成功');
    });
});

/**
 * #9修改用户密码
 * 输入：用户id和当前密码
 * 输出：1或0，表示用户信息是否更新成功
 */
app.get('changePsw',function (req,res) {
    let sql = 'UPDATE t_user SET password = ? WHERE id = ? and password=? ';
    console.log(req.query.newPsw);
    let data = [req.query.newPsw, req.session.user.id,req.query.currentPsw];
    connection.query(sql, data, function(err, reply) {
        if (err) {
            console.log('error!' + err);
            res.send('error');
        }
        res.send(reply.affectedRows);
        console.log('数据库有' + reply.affectedRows + '条数据修改成功');
    });
});

/**
 * #9注销登陆
 * 输入：用户user
 * 输出：用户user（若注销成功已为空值）
 */
app.get('/loginout', urlencodedParser, function(req, res) {
    req.session.user = null;
    console.log('已注销');
    res.send(req.session.user);
});

/**
 * #12跳转至找回密码页面
 */
app.get('/findPassword',urlencodedParser,function (req,res) {
    res.redirect('/changePassword.html');
});

/*#12重置密码，点击重置按钮，发送验证码到邮箱,并跳转到填写验证码和密码界面
输入：email
输出：email，passwordCode(验证码)
 */
app.post('/resettingPassword',urlencodedParser,function (req,res) {
    let passwordCode=parseInt(Math.random()*1000000);
    let email=req.query.email;
    let sql='SELECT isactive FROM t_user WHERE email = ?';
    let data=[email];
    console.log(req.query.email);
    connection.query(sql,data,function (err,reply) {
        if(err) throw  err;
        if(reply.length===1&&reply[0].isactive===1){
            let content= "您的验证码是："+passwordCode+" 如非本人操作，请忽略此邮件";
            let options = {
                from           : 'cr<thoughtworkersfive@126.com>',
                to             :  req.query.email,
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
            connection.query(sql,data,function (err, rep) {
                if(err) throw  err;
                console.log(rep);
                res.send(rep);
            });
        }else {
            res.send('fail');
            console.log('该邮箱尚未注册，请先注册！');
        }
    })
});

/*#12重置密码后登录，输入验证码和密码，点击登录按钮，若验证通过直接进入主页并将数据库中验证码重新覆盖
输入：email，passwordCode,password，passwordConfirmation(登录页面填入的)
输出：reply(更改数据的信息)
 */

app.put('/resettingLogin',function (req,res) {
    let email=req.query.email;
    let passwordCode=req.body.passwordCode;
    let password=req.body.password;
    let sql='SELECT * FROM t_user WHERE email = ?';
    let data=email;
    connection.query(sql,data,function (err, reply) {
        if(err) throw  err;
        console.log(reply);
        reply[0].email=req.query.email;
        req.session.user=reply[0];
    });
    let sqlCode='UPDATE t_user SET password = ?,passwordCode = ? WHERE email = ? and passwordCode = ?';
    let rePasswordCode=parseInt(Math.random()*1000000);
    let dataCode=[password,rePasswordCode,email,passwordCode];
    connection.query(sqlCode,dataCode,function (err, reply) {
        if(err) throw  err;
        console.log(reply);
        res.send(reply);
    });
});




////////////////**进入首页时处理数据/////////////////////////////////
app.get('/init',function (req,res) {
    let sql='select * from t_job';
    let categorys=['development','designer','marketing','prodectManager'];
    let jobtypes=['volunteer','permanent','freelance','contract'];
    let logo='https://i.stack.imgur.com/Nppgg.jpg';
    let companyType='IT';
    let companySize='10000+';
    let benefits='there had no now';
    let num='15';
    let likes=9;
    let method=['phone','email','facetoface','QQ']
    connection.query(sql,function (err, jobs) {
        if(err) throw  err;
        for(let i=0;i<jobs.length;i++) {
            let sql2='update t_job set company=?,applyApproach=?,tags=?,Logo=?,likes=?,benefits=?,companySize=?,companyType=?,num=?,education=? where id=?'
            let sqlinfo=['thoughtworkers\'child',method[i%4],'java,C/C++',logo,likes,benefits,companySize,companyType,'1000+','undergraduate student', jobs[i].id];
            connection.query(sql2,sqlinfo, function (err, jobs) {
                if (err) throw  err;
            });
        }
        res.send(jobs);
    });
});

/**************************************************/

/*接收发布招聘的信息
输入：招聘表单内容
输出：成功：200添加成功
     失败：500服务器发生错误
*/

let server = app.listen(8081, function() {
    let host = server.address().address;
    let port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port);
});
