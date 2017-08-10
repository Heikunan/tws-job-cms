let express = require('express');
let Bodyparser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let mysql = require('mysql');
let urlencodedParser = Bodyparser.urlencoded({ extended: true });


let i=0;

let app = express();
app.use(express.static('src'));
app.use(Bodyparser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
    secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
    cookie: { maxAge: 60 * 1000 }
}));


let connection = mysql.createConnection({
    host     : '119.28.63.95',
    user     : 'myuser',
    password : 'hubuedu',
    database : 'twsjob'
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

app.get('/hh',urlencodedParser,function (req,res) {
    res.sendFile( __dirname + "/src/" + "yapp.html" );
});
///////////////////*杨邵军的测试*/////////////////////////////////////////////

/*将用户登陆的数据传入*/
app.get('/login',urlencodedParser, function (req, res) {
    let username='888'//req.body.username;
    let password='22'//req.body.password;
    let sql='select * from t_user where email=? and password=?';
    let sqlinfor=[username,password];
    connection.query(sql,sqlinfor,function (err, result) {
        if(err) throw  err;
        console.log(result);
        if(result.length===0){       //不存在这个用户,返回0;
            res.send(result);
        }
        else{       /*返回产生的session字符串*/
            result[0].useridd=i;
            i++;
            req.session.user=result[0];
            console.log(req.session);
            res.send(result);      //返回产生的session,前台将其存入cookie中
        }
    });

});

app.get('/login1',urlencodedParser, function (req, res) {
    if(req.session.user){
        console.log(req.session.user);
        res.send('已登录！');
    }else {
        res.send('未登录！');
    }
});

app.get('/login2',urlencodedParser, function (req, res) {
    if(req.session.user){
        req.session.user='';
        res.send('登录并消除！'+req.session.user);
    }else {
        res.send("未登录");
    }
});

//////////////////////////*杨邵军的测试*//////////////////////////////////////////



app.get('/allJobs',urlencodedParser, function (req, res)  {

//点击显示所有职位的按钮，得到所有职位的信息
    let sql='select * from t_job';
    connection.query(sql,function(err, result) {
        if(err) throw  err;
        res.send(result);
    });

});

app.post("/searchResult",urlencodedParser, function (req, res) {
    let searchJobName=req.body.jobName;
    console.log(searchJobName);
    //根据工作的标题、公司名字和职位描述等来搜索已发布的工作，
    let sql= "select * from t_job where title like '%"+searchJobName+"%' or company like '%"+searchJobName+"%' or description like '%"+searchJobName+"%'";
    //let sqlinfor=[searchJobName];escription
    connection.query(sql,function(err, result) {
        if(err) throw  err;
//let sql= "select * from t_job where title like '%"+searchJobName+"%' or company like '%"+searchJobName+"%' or description like '%"+searchJobName+"%'";
        res.send(result);
    });
});
let server = app.listen(8081, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port);

});
