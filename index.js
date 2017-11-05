let express = require('express');
let multer = require('multer');
let fs = require('fs');
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
app.use('/node_modules', express.static('node_modules'));
app.use(Bodyparser.urlencoded({ extended: true }));
app.use(cookieParser('recommand 128 bytes random string'));
app.use(session({
    name: 'twsjob',
    secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
    cookie: { maxAge: 1800 * 1000 }
}));
let connection = mysql.createConnection({
    host: '47.94.199.111',
    user: 'tws',
    password: '123456',
    port: '3306',
    database: 'twsjob'
});
connection.connect();
/*上传图片*/
let createFolder = function(folder) {
    try {
        fs.accessSync(folder);
    } catch (e) {
        fs.mkdirSync(folder);
    }
};

let uploadFolder = './public/upload/';

createFolder(uploadFolder);

// 通过 filename 属性定制
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadFolder); // 保存的路径，备注：需要自己创建
    },
    filename: function(req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, cp.hex(file.fieldname + '-' + Date.now()) + file.originalname);
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
let upload = multer({ storage: storage });

/**连接发送邮件的邮箱*/
let mailTransport = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 465,
    secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
    auth: {
        user: '15779165029@163.com',
        pass: 'WU55555'
    }
});


/*查找所有的工作性质*/
app.get('/getcategory', function(req, res) {
    let sql = 'select * from t_category';
    connection.query(sql, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});
/*查找所有的工作类型*/
app.get('/getjobtype', function(req, res) {
    let sql = 'select * from t_jobtype';
    connection.query(sql, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

/*返回一共条数*/
app.get('/gettotal', function(req, res) {
    let sql = 'select * from t_job';
    connection.query(sql, function(err, result) {
        if (err) console(err);
        res.send({ length: result.length });
    });
});

/*图片上传*/
app.post('/upload', upload.single('logo'), function(req, res, next) {
    let file = req.file;
    let arr = file.path.split("\\");
    let sql = `UPDATE t_user SET companylogo = '${arr[2]}' WHERE id = '${req.session.user.id}'`;
    connection.query(sql, function(err, data) {
        if (err) {
            console.log(err);
        }
    });
    res.send("ok");
});

/* 进入用户个人中心*/
app.get('/myinfo', function(req, res) {
    //测试用
    req.session.user = {
        id: '1234',
        email: '951576941@qq.com',
        company: 'szx',
        address: 'wuhan',
        trade: 'studnet'
    };
    res.sendFile(__dirname + "/public/" + "userInfo.html");
});


app.post('/testjobs', function(req, res) {
    let mynum = parseInt(req.body.num);
    mynum = (mynum - 1) * 10;
    let sql = `SELECT * FROM t_job WHERE status = '1' ORDER BY expiryDate ASC LIMIT ${mynum},10`;
    connection.query(sql, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    });
});


/*#2 根据工作职位过滤职位
#3 根据工作性质过滤职位
#4搜索职位*/
app.post('/searchjobs', urlencodedParser, function(req, res) {
    let jobtype = req.body.jobtype;
    let category = req.body.category;
    let jobname = req.body.jobname;
    let sql = "select * from t_job where category like '%" + category + "%' and jobtype like '%" + jobtype + "%' and title like '%" + jobname + "%'" + `and status = '1' ORDER BY expiryDate ASC`;
    connection.query(sql, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});


/*
#5查看职位详情
 */
app.get('/getJobDetail/id=:id', function(req, res) {
    res.sendFile(__dirname + "/public/" + "jobInfo.html");
});
app.post('/getJobDetail/id=:id', function(req, res) {
    let sql = 'SELECT * FROM t_job where id =' + req.body.id;
    connection.query(sql, function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            res.status(500).send('服务器发生错误');
        } else {
            res.send(result);
        }
    });
});


/*7 用户查看自己的已发布
作为已注册并登陆的用户（招聘者），我想浏览自己发布的所有工作 以便查看自己手上的所有招聘。
*/
app.get('/myposts', function(req, res) {
    if (req.session.user) {
        //得到用户的id
        let userid = req.session.user.id;
        //查找用户的post
        let sql = 'select status,id,title,category from t_job where userid = ' + userid + ' and status != 2';

        connection.query(sql, function(err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            //返回自己全部的post的title和category,id
            res.send(result);
        })
    } else {
        res.send('no')
    }

});

//得到草稿箱
app.get('/mydrafts', function(req, res) {
    if (req.session.user) {
        //得到用户的id
        let userid = req.session.user.id;
        //查找用户的草稿箱
        let sql = 'select id,title,category from t_job where userid = ' + userid + ' and status = 2';
        connection.query(sql, function(err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            //返回自己全部的草稿箱的的id和title和category
            res.send(result);
        })
    } else {
        res.send('no')
    }

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
    connection.query(sql, function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        //返回自己全部的post
        res.send(result)
    })
});



/*
 * #9注销登陆
 * 输入：用户user
 * 输出：用户user（若注销成功已为空值）
 */
app.get('/loginout', urlencodedParser, function(req, res) {
    req.session.user = null;
    res.send('OK');
});


/*10 注册部分
发送邮件,将用户信息绑定在里面发送过去，并不完善,只有id,email,password,激活码的存放
*/
app.post('/send', function(req, res, next) {
    /*得到前台的数据*/
    let email = req.body.email;
    let password = req.body.password;
    let password_conf = req.body.password_conf;
    let myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (!myreg.test(email)) {
        res.send('wrong_em') //邮箱格式错误，返回wrong_em
    } else if (password !== password_conf) {
        res.send('wrong_ps') //两次密码不一致，返回wrong_pw
    } else {
        //邮件中显示的信息
        let html = "欢迎注册本公司账号，请<a href='http://localhost:8081/confirm?hex=" + cp.hex(email) + "'>点击此处</a>激活账号！点击链接后页面将跳转至首页。";
        //sql语句插入语句
        let sql = 'insert into t_user (password,email,activeToken,status,identity) values (?,?,?,?,?);';
        /*数据库中存hex数据,除了激活码是email 的base数据*/
        let sqlinfor = [password, email, cp.base(email), '待审核', '职位发布者'];
        connection.query(sql, sqlinfor, function(err, result) {
            if (err) {
                //插入失败，返回false，就是用户已经存在
                res.send(false);//账号已存在，返回false
            } else {
                /*设置邮件信息,如果可以插入数据库中*/
                let options = {
                    from: '15779165029@163.com',
                    to: email,
                    subject: '注册成功，请激活！',
                    text: '欢迎注册',
                    html: html
                };
                /*发送邮件*/
                mailTransport.sendMail(options, function(err, msg) {
                    if (err) {
                        return console.log(err);
                    }
                });
                res.send(true);//可注册，返回true
            }
        });
    }
});
app.get('/tjobcount', function(req, res) {
    let sql = `select count(*) from t_job where status = 1`;
    connection.query(sql, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send(result[0]);
        }
    })
});
//再次发送验证邮件
app.post('/resend', function(req, res) {
    /*得到前台的数据*/
    let email = req.body.email;
    let myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (!myreg.test(email)) {
        res.send('wrong_em');
    }else {
        //在数据库中查找
        let addSql = 'select * from t_user where email=?';
        let addSqlParams = [email];
        connection.query(addSql, addSqlParams, function (err, result) {
            if (result.length === 0) {
                res.send('null'); //用户不存在,则返回null
            } else if (result[0].isactive === 1) {
                res.send('wrong');//用户已注册激活，则返回wrong
            } else {
                //邮件中显示的信息
                let html = "欢迎注册本公司账号，请<a href='http://localhost:8081/confirm?hex=" + cp.hex(email) + "'>点击此处</a>激活账号！点击链接后页面将跳转至首页。";
                let options = {
                    from: '15779165029@163.com',
                    to: email,
                    subject: '注册成功，请激活！',
                    text: '欢迎注册',
                    html: html
                };
                /*发送邮件*/
                mailTransport.sendMail(options, function (err, msg) {
                    if (err) {
                        return console.log(err);
                    }
                });
                res.send(true);//账号已注册未激活，返回true
            }
        });
    }
});

//主页获取五条热门职位
app.get('/job_suggest', function(req, res) {
    let sql = 'select * from t_hotjob ,t_job where t_hotjob.jobid = t_job.id';
    connection.query(sql, function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
        } else {
            res.send(result);
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
        if (err) {
            console.log(err);
        } else { //如果没有直接对数据库进行操作，不会返回error
            res.redirect('/');
        }
    });
});

/*#11 登录部分
输入对象，返回字符串
*/
app.post('/login', urlencodedParser, function(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (!myreg.test(email)) {
        res.send('wrong_em')//邮箱格式错误，则返回wrong_em
    }else{
    let addSql = 'select * from t_user where email=?';
    let addSqlParams = [email];
    connection.query(addSql, addSqlParams, function(err, result) {
            if (err) { console.log(err);
            }
            if (!result) {
                res.send('null'); //用户不存在,则返回null
            } else {
                if (result[0].password !== password) {
                    res.send('wrong_pw') //用户存在，但密码错误,返回wrong_pw
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
    }
    }
);
/*取得某个职位的详细信息*/
app.post('/getJobDetail', urlencodedParser, function(req, res) {
    let sql = 'SELECT * FROM t_job where id =' + req.body.id;
    connection.query(sql, function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] -getjobdetail ', err.message);
            res.status(500).send('服务器发生错误');
        } else {
            res.send(result);
        }
    });
});

app.get('/postJob', function(req, res) {
    res.sendFile(__dirname + "/public/" + "jobPost.html");
});
/*接收发布招聘的信息
输入：招聘表单内容
输出：成功：200添加成功
     失败：500服务器发生错误
*/

app.post('/postJob', function(req, res) {
    let userId = req.session.user.id;
    let likes = 0;
    let releaseTime = new Date(Date.now());
    req.body.tags = req.body.tags[0] + ',' + req.body.tags[1];
    req.body.benefits = req.body.benefits[0] + ',' + req.body.benefits[1];
    if (req.body.jobId === undefined) {
        let addSql = 'INSERT INTO t_job(status,userId,title,company,description,applyApproach,expiryDate,category,jobType,tags,city,country,num,benefits,releaseTime,area,companyType,companySize,Logo,likes,companyIntroduce,salary,education,editor) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        let addSqlParams = [0, userId, req.body.title, req.body.company, req.body.description, req.body.applyApproach, req.body.expiryTime, req.body.category, req.body.jobType, req.body.tags, req.body.city, req.body.country, req.body.number, req.body.benefits, releaseTime, req.body.area, req.body.companyType, req.body.companySize, req.body.companyLogo, likes, req.body.companyIntroduce, req.body.salary, req.body.Educational, req.body.editor];
        connection.query(addSql, addSqlParams, function(err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                res.status(500).send('服务器发生错误');
            } else {
                res.status(200).send('添加成功');
            }
        });
    } else {
        let deleteSql = 'delete from t_job where id =' + req.body.jobId;
        connection.query(deleteSql, function(err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                res.status(500).send('服务器发生错误');
            } else {
                console.log('删除成功');
                let addSql = 'INSERT INTO t_job(status,userId,title,company,description,applyApproach,expiryDate,category,jobType,tags,city,country,num,benefits,releaseTime,area,companyType,companySize,Logo,likes,companyIntroduce,salary,education,editor) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                let addSqlParams = [0, userId, req.body.title, req.body.company, req.body.description, req.body.applyApproach, req.body.expiryTime, req.body.category, req.body.jobType, req.body.tags, req.body.city, req.body.country, req.body.number, req.body.benefits, releaseTime, req.body.area, req.body.companyType, req.body.companySize, req.body.companyLogo, likes, req.body.companyIntroduce, req.body.salary, req.body.Educational, req.body.editor];
                connection.query(addSql, addSqlParams, function(err, result) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        res.status(500).send('服务器发生错误');
                    } else {
                        console.log('发布成功');
                        res.status(200).send('成功');
                    }
                });
            }
        })
    }

});
/*将第一次创建的草稿保存*/
app.post('/saveJob', function(req, res) {
    let userId = req.session.user.id;
    let likes = 0;
    let releaseTime = new Date(Date.now());
    req.body.tags = req.body.tags[0] + ',' + req.body.tags[1];
    req.body.benefits = req.body.benefits[0] + ',' + req.body.benefits[1];
    let addSql = 'INSERT INTO t_job(status,userId,title,company,description,applyApproach,expiryDate,category,jobType,tags,city,country,num,benefits,releaseTime,area,companyType,companySize,Logo,likes,companyIntroduce,salary,education,editor) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    let addSqlParams = [2, userId, req.body.title, req.body.company, req.body.description, req.body.applyApproach, req.body.expiryTime, req.body.category, req.body.jobType, req.body.tags, req.body.city, req.body.country, req.body.number, req.body.benefits, releaseTime, req.body.area, req.body.companyType, req.body.companySize, req.body.companylogo, likes, req.body.companyIntroduce, req.body.salary, req.body.Educational, req.body.editor];
    connection.query(addSql, addSqlParams, function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            res.status(500).send('服务器发生错误');
        } else {
            res.status(200).send('添加成功');
        }
    });
});
/*取得要修改职位的原始资料*/
app.post('/getChangeJobDetail', function(req, res) {
    let sql = 'SELECT * FROM t_job where id =' + req.body.id;
    connection.query(sql, function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            res.status(500).send('服务器发生错误');
        } else {
            res.send(result);
        }
    });
});
/*保存已经创建又修改的草稿*/
app.post('/saveChangeJob', urlencodedParser, function(req, res) {
        let releaseTime = new Date(Date.now());
        req.body.tags = req.body.tags[0] + ',' + req.body.tags[1];
        req.body.benefits = req.body.benefits[0] + ',' + req.body.benefits[1];
        let addparams = [req.body.title, req.body.description, req.body.applyApproach, req.body.expiryTime, req.body.category, req.body.jobType, req.body.tags, req.body.city, req.body.country, req.body.number, req.body.benefits, releaseTime, req.body.area, req.body.companyType, req.body.companySize, req.body.companyIntroduce, req.body.salary, req.body.Educational, req.body.editor, req.body.jobId];
        let sql = 'UPDATE t_job SET title = ?,description=?,applyApproach=?,expiryDate=?,category=?,jobType=?,tags=?,city=?,country=?,num=?,benefits=?,releaseTime=?,area=?,companyType=?,companySize=?,companyIntroduce=?,salary=?,education=?,editor=? WHERE id = ? ';
        connection.query(sql, addparams, function(err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                res.status(500).send('服务器发生错误');
            } else {
                res.status(200).send('修改成功');
            }
        });
    })
    /*在详细页面得到推荐工作
     */
app.post('/getSuggestion', function(req, res) {
    let jobtype = req.body.type;
    let category = req.body.category;
    let title = req.body.title;
    let sql = 'select * from t_job  where category=? or jobType=? or title like ? limit 0,5';
    let sqlinfor = [category, jobtype, `%${title}%`];
    connection.query(sql, sqlinfor, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});
/*判断是否已经收藏*/
app.post('/isLike', urlencodedParser, function(req, res) {
    let jobId = req.body.id;
    if (req.session.user === undefined) {
        res.send('first_notlog');
    } else {
        let userId = req.session.user.id;
        let sql = 'select * from t_like where userId = ? and jobId = ?';
        let addsql = [userId, jobId];
        connection.query(sql, addsql, function(err, result) {
            if (err) {
                console.log(err);
            }
            if (result.length !== 0) {
                res.send('true');

            } else {
                res.send('false');
            }
        })

    }
});
/*如果没有收藏，点击收藏后Job表里的num字段+1*/
app.post('/addOneLike', function(req, res) {
    if (req.session.user === undefined) {
        res.send('notlog');
    } else {
        let jobId = req.body.id;
        let num = req.body.num;
        let sql = 'update t_job  set likes = ? where id =' + jobId;
        let addparams = [num];
        connection.query(sql, addparams, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                res.send('ok');
            }
        })
    }
});
/*如果没有收藏，收藏后将用户和工作记录下来*/
app.post('/addOneUser', function(req, res) {
    if (req.session.user === undefined) {
        res.send('notlog');
    } else {
        let jobId = req.body.id;
        let userId = req.session.user.id;
        let sql = 'insert into t_like (userId,jobId) values (?,?)'
        let addSqlParams = [userId, jobId];
        connection.query(sql, addSqlParams, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                res.send('ok');
            }
        });
    }
});
/**#9获得用户详细信息
输入：
输出：req.session.user除密码之外的所有信息
 */
app.get('/getUserInfo', function(req, res) {
    if (req.session.user) {
        let id = req.session.user.id;
        let sql = `SELECT * FROM t_user WHERE id = ${id}`;
        connection.query(sql, function(err, data) {
            res.send(data[0]);
        });
    } else {
        res.send('no');
    }
});

app.get('/getuserinfofromsql', function(req, res) {
    let sql = 'select * from t_user where id =' + req.session.user.id;
    connection.query(sql, function(err, data) {
        if (err) {
            console.log('error!' + err);
            res.send('error');
        }
        req.session.user = data[0]
    })
});


/**
 * #9修改用户基本信息
 * 输入：用户id
 * 输出：1或0，表示用户信息是否更新成功
 */
app.post('/changeUserInfo', urlencodedParser, function(req, res) {
    let sql = 'UPDATE t_user SET company = ?,address=?,trade=?,name=? WHERE id = ? ';
    let data = [req.body.company, req.body.address, req.body.trade, req.body.name, req.session.user.id];
    connection.query(sql, data, function(err, reply) {
        if (err) {
            console.log('error!' + err);
            res.send('原密码错误');
        }
        let sql = 'select * from t_user where id =' + req.session.user.id;
        connection.query(sql, function(err, data) {
            if (err) {
                console.log('error!' + err);
                res.send('error');
            }
            req.session.user = data[0]
            res.send('ok')
        });
        console.log('数据库有' + reply.affectedRows + '条数据修改成功 ');
    });
});

/**
 * #9修改用户密码
 * 输入：用户id和当前密码
 * 输出：1或0，表示用户信息是否更新成功
 */
app.post('/changePsw', urlencodedParser, function(req, res) {
    if (req.session.user) {
        let sql = 'UPDATE t_user SET password = ? WHERE id = ? and password=? ';
        let data = [req.body.newPsw, req.session.user.id, req.body.currentPsw];
        connection.query(sql, data, function(err, reply) {
            if (err) {
                console.log('error!' + err);
                res.send('error');
            }
            reply.affectedRows !== 0 ? res.send('ok') : res.send('error');
            console.log('密码修改成功' + reply.affectedRows + '条');
        });
    } else {
        res.send('no')
    }
});

/**
 * #9注销登陆
 * 输入：用户user
 * 输出：用户user（若注销成功已为空值）
 */
app.get('/loginout', urlencodedParser, function(req, res) {
    req.session.user = null;
    res.send(req.session.user);
});

/**
 * #12跳转至找回密码页面
 */
app.get('/findPassword', urlencodedParser, function(req, res) {
    res.redirect('/changePassword.html');
});

/*#12重置密码，点击重置按钮，发送验证码到邮箱,并跳转到填写验证码和密码界面
输入：email
输出：email，passwordCode(验证码)
 */
app.post('/resettingPassword', urlencodedParser, function(req, res) {
    let passwordCode = parseInt(Math.random() * 1000000);
    let email = req.query.email;
    let sql = 'SELECT isactive FROM t_user WHERE email = ?';
    let data = [email];
    connection.query(sql, data, function(err, reply) {
        if (err) {
            console.log(err);
        }
        if (reply.length === 1 && reply[0].isactive === 1) {
            let content = "您的验证码是：" + passwordCode + " 如非本人操作，请忽略此邮件";
            let options = {
                from: 'thoughtworkersfive<thoughtworkersfive@126.com>',
                to: req.query.email,
                subject: '重置密码',
                text: '验证码',
                html: content
            };
            mailTransport.sendMail(options, function(err, msg) {
                if (err) {
                    console.log(err);
                }
            });
            let sql = 'UPDATE t_user SET passwordCode = ? WHERE email = ? ';
            let data = [passwordCode, email];
            connection.query(sql, data, function(err, rep) {
                if (err) {
                    console.log(err);
                }
                if (rep) {
                    res.send(true); //账号存在且已经激活，更新“激活码”，并返回true
                }
            });
        } else {
            res.send(false); //账号未注册激活，返回false
        }
    })
});

/*#12重置密码后登录，输入验证码和密码，点击登录按钮，若验证通过直接进入主页并将数据库中验证码重新覆盖
输入：email，passwordCode,password，passwordConfirmation(登录页面填入的)
输出：reply(更改数据的信息)
 */

app.put('/resettingLogin', function(req, res) {
    let email = req.query.email;
    let passwordCode = req.body.passwordCode;
    let password = req.body.password;
    let sql = 'SELECT * FROM t_user WHERE email = ?';
    let data = [email];
    connection.query(sql, data, function(err, reply) {
        if (err) {
            console.log(err);
        }
        req.session.user = reply[0];
    });
    let sqlCode = 'UPDATE t_user SET password = ? WHERE email = ? and passwordCode = ?';
    let dataCode = [password, email, passwordCode];
    connection.query(sqlCode, dataCode, function(err, reply) {
        if (err) {
            console.log(err);
        }
        if (reply.affectedRows === 1) {
            res.send(true) //验证码正确，更新密码，返回true
        } else {
            res.send(false) //验证码错误，返回false
        }
    });
});

/************************************后台api*****************************************************************/


///************得到待审核的用户************////
app.get('/notcheck', function(req, res) {
    let sql = "select * from t_user where status='待审核'";
    connection.query(sql, function(err, users) {
        if (err) {
            console.log(err);
        } else {
            res.send(users);
        }
    });
});

//****************使用户可以发布职位**********************//
app.post('/tochecked', urlencodedParser, function(req, res) {
    let usersid = req.body.usersid;
    let sql = "update t_user set status='已审核' where id=?"
    for (let i = 0; i < usersid.length; i++) {
        connection.query(sql, parseInt(usersid[i]), function(err, reply) {
            if (err) {
                console.log(err);
            }
        });
    }
    res.send(true);
});
///*****************删除用户****************///
app.post('/deleteuser', urlencodedParser, function(req, res) {
    let usersid = req.body.usersid;
    let sql = "delete from t_user where id =?";
    for (let i = 0; i < usersid.length; i++) {
        connection.query(sql, parseInt(usersid[i]), function(err, reply) {
            if (err) {
                console.log(err);
            }
        });
    }
    res.send(true);
});

//用户自己删除自己发布的工作 单条删除
app.post('/deletejob', urlencodedParser, function(req, res) {
    let jobid = req.body.jobid;
    let sql = "delete from t_job where id =?";

    connection.query(sql, jobid, function(err, reply) {
        if (err) {
            console.error('单条删除错误');
        }
        res.send('ok')
    });


});

//用户自己删除自己发布的工作 批量删除
app.post('/deletejobs', urlencodedParser, function(req, res) {
    let jobsid = req.body.jobsid;
    let sql = "delete from t_job where id =?";
    for (let i = 0; i < jobsid.length; i++) {
        connection.query(sql, parseInt(jobsid[i]), function(err, reply) {
            if (err) {
                console.log(err);
            }
        });
    }
    res.send(true);
});
app.get('/cretateusers', function(req, res) {
    let sql = "insert into t_user (password,email,status) values (?,?,?);";
    for (let i = 0; i < 20; i++) {
        let sqlinfor = [i.toString(), i.toString(), '待审核'];
        connection.query(sql, sqlinfor, function(err, reply) {
            if (err) console.log(err);
        })
    }
    res.send(true);
});
/**************************************************/

let server = app.listen(8081, function() {

    let host = server.address().address;
    let port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port);
});


app.get('/hotjob', function(req, res) {
    let sql = "select * from t_hotjob,t_job where t_hotjob.jobid=t_job.id"
    connection.query(sql, function(err, hotjobs) {
        res.send(hotjobs);
    });
});

///***删除hotjob里的工作id**////
app.post('/deletehotjobs', urlencodedParser, function(req, res) {
    let jobsid = req.body.jobsid;
    let sql = "delete from t_hotjob where jobid =?";
    for (let i = 0; i < jobsid.length; i++) {
        connection.query(sql, parseInt(jobsid[i]), function(err, reply) {
            if (err) {
                console.log(err);
            }
        });
    }
    res.send(true);
})

////***增加Hotjob表里的工作id****/////////
app.post('/addhotjobs', urlencodedParser, function(req, res) {
    let jobsid = req.body.jobsid;
    let sql0 = 'select * from t_job where id=? and status=1';
    for (let i = 0; i < jobsid.length; i++) {
        connection.query(sql0, parseInt(jobsid[i]), function(err, jobs) {
            if (err) {
                console.log(err);
            }
            if (jobs.length === 0) {
                res.send(false);
            } else {
                let flag = 1;
                let sql = "insert into t_hotjob (jobid) values (?)";
                for (let i = 0; i < jobs.length; i++) {
                    connection.query(sql, jobs[i].id, function(err, reply) {
                        if (err) {
                            flag = 0;
                        }
                    })
                    if (i === jobs.length - 1) {
                        if (jobs.length < jobsid.length) {
                            res.send(false);
                        } else if (flag === 0) {
                            res.send(false);
                        } else {
                            res.send(true);
                        }
                    }
                }
            }
        });
    }
});

///**得到所有的用户**///
app.post('/allusers', urlencodedParser, function(req, res) {
    let page = req.body.page;
    let sql = "select * from t_user limit ?,?";
    let sqlinfo = [page * 10 - 10, 10];
    connection.query(sql, sqlinfo, function(err, users) {
        if (err) {
            console.log(err);
        } else {
            res.send(users);
        }
    });
});

///**得到没有审核的工作**//
app.get('/nocheckedjobs', urlencodedParser, function(req, res) {
    let sql = 'select * from t_job where status=0';
    connection.query(sql, function(err, jobs) {
        if (err) {
            console.log(err);
        } else {
            res.send(jobs);
        }
    });
});

/*完成职位的审核*/
app.post('/jobstochecked', urlencodedParser, function(req, res) {
    let jobsid = req.body.jobsid;
    let sql = "update t_job set status=1 where id=?"
    for (let i = 0; i < jobsid.length; i++) {
        connection.query(sql, parseInt(jobsid[i]), function(err, reply) {
            if (err) {
                console.log(err);
            }
        });
    }
    if (jobsid.length === 0) {
        res.send(false);
    } else {
        res.send(true);
    }
});



app.post('/supersearch', urlencodedParser, function(req, res) {
    let conditions = req.body;
    let sql = 'select * from t_job';
    for (let i in conditions) {
        if (i === 'salary') {
            sql += ' where ';
        }
        if (conditions[i].indexOf('%%') > 2) {
            sql += ' ' + i + ' in ' + conditions[i] + ' and ';
        }
    }
    sql += 'status=1';
    connection.query(sql, function(err, jobs) {
        if (err) {
            console.log(err);
        } else {
            res.send(jobs);
        }
    });

});

/*用户得到收藏的职位*/
app.get('/getlikesjob', urlencodedParser, function(req, res) {
    let userid = req.session.user.id;
    let sql = 'select * from t_like where userId=' + userid;
    connection.query(sql, function(err, jobsid) {
        if (err) { console.log(err); }
        if (jobsid.length === 0) {
            res.send([]);
        } else {
            let result = [];
            for (let i = 0; i < jobsid.length; i++) {
                let sql0 = 'select * from t_job where id=' + jobsid[i].jobId;
                connection.query(sql0, function(err, jobs) {
                    if (err) {
                        console.log(err);
                    } else {
                        result.push(jobs[0]);
                    }
                    if (i === jobsid.length - 1) {
                        res.send(result);
                    }
                })
            }
        }
    });
});
/*删除收藏的职位*/
app.post('/dellikesjob', urlencodedParser, function(req, res) {
    let jobsid = req.body.jobsid;
    let userid = req.session.user.id;
    for (let i = 0; i < jobsid.length; i++) {
        let sql = 'delete from t_like where jobId=? and userId=' + userid;
        connection.query(sql, parseInt(jobsid[i]), function(err, reply) {
            if (err) {
                console.log(err);
            }
            if (i === jobsid.length - 1) {
                res.send(true);
            }
        })
    }
});
/**/
app.post('/useridgetuser', urlencodedParser, function(req, res) {
    let userid = req.body.userid;
    let sql = `SELECT * FROM t_user WHERE id = ${userid}`;
    connection.query(sql, function(err, reply) {
        res.send(reply);
    })
});

app.post('/suibiansou', urlencodedParser, function(req, res) {
    let text = req.body.text;
    let sql = "SELECT * FROM t_job WHERE CONCAT(title,company,description,applyApproach,category,jobType,tags,city,country,salary,companyIntroduce,companyType,companySize,benefits,area,num,education) like '%" + text + "%' ORDER BY expiryDate DESC";
    connection.query(sql, function(err, jobs) {
        if (err) {
            console.log(err);
        }
        res.send(jobs);
    });
});