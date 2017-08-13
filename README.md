_**____`********`**_# tws_job_cms

## codeing girl club 内部的招聘模块

# 技术栈

### 使用工具

### UI框架

#### semantic UI

[文档地址](http://semantic.yubolun.com/)

#### 后台框架

#### express + body-parser + cookie-parser + express-session

[express文档](https://www.zybuluo.com/XiangZhou/note/208532#reqcookies)

[cookie-parser](https://segmentfault.com/a/1190000004139342?_ea=504710)

[express-session](http://www.xgllseo.com/?p=5162)

#### 数据库

#### mysql

[nodeJS操作mysql文档地址](http://www.runoob.com/nodejs/nodejs-mysql.html)

# 关于express-session和cookie

### 使用cookie与session技术使用户可以跨页面保持登录状态

```
let express = require('express');
let cookieParser = require('cookie-parser');
let session = require('express-session');
//首先引入相关组件
let app = express();
//使用session与cookie组件
/*
    express-session和cookie-parser这两个组件联合使用可以在用户第一次访问的时候在用户浏览器里面写入cookie
*/
app.use(cookieParser('twsjob'));
app.use(session({
  name:'twsjob',//设置写入用户浏览器cookie的key
  secret: 'twsjob',//签名，与cookie保持一致
  resave: true,
  maxAge: 90000,//设置失效时间单位为ms
  saveUninitialized: true
}));
//访问代码
app.get('/', function (res, req) {
  if (res.session.visit) {
    res.session.visit++;
    req.json(res.session);
  } else {
    res.session.visit = 1;
    req.send("第一次访问页面");
  }
});

app.get('/getsession',function(res,req){
  /*
    每次用户访问服务器就会自动在http请求头里面带上本地的cookie，但是获取用户本地的cookie的时候一定要使用res.session.你的cookie的key,在以上代码里，第一次访问localhost:3000的时候会输出第一次访问页面，以后每次访问res.session.visit都会加一
  */
  /*
  这是得到session，在服务器端保存着的是一个object对象

  {
    "cookie": {
        "originalMaxAge": null,
        "expires": null,
        "httpOnly": true,
        "path": "/"
    },
    "visit": 18
   }   

  */
  let mysession = res.session.twsjob;
  console.log(res.session.twsjob);
})

app.listen(3000);
/*
    当浏览器访问localhost:3000的时候,初始就会自动写入一个cookie而且key为twsjob,本地cookie储存的是session的key，通过res.session.你的cookie的key可以获取你设置session的值
*/

/*
    当我访问localhost:3000/getsession的时候就可以获取我写入的twsjob这个session，可以同时写入多个session，当页面关闭的时候不会消失，只有浏览器关闭的时候session与cookie都会自动消失，可以通过这个技术来使用户可以跨页面登录
*/
```

## 总结

>在用户通过url访问我们的网站的时候,我们就会在用户的cookie里面自动生成一个我们定义好的key的sessionID（value），在用户在通过url访问我们的网站的时候，就会在http请求里携带上cookie，我们可以通过用户发送过来的cookie来找到相应的session，从而来管理用户在我们网站的各种状态

## 后台API规范

### GET 为后台为前台发送数据（数据获取）

#### 代码示例

```
app.get('/somewhere',function(req,res)){
     //dosomething...
    res.send('Hello');
}
```

### POST 为后台接收前台发送数据并发送结果（数据添加）

#### 代码示例

```
app.post('/somewhere',function(req,res)){
     //dosomething...
    res.send('Hello');
}
```

### PUT 为前台给后台发送数据（数据修改）

#### 代码示例

```
app.put('/somewhere',function(req,res)){
     //dosomething...
    res.send('Hello');
}
```

### DELETE 为前台给后台发送数据（删除）

#### 代码示例

```
app.delete('/somewhere',function(req,res)){
    //dosomething...
    res.send('Hello');
}
```





# 数据库的设计

## 数据库的名称 twsjob

### 用户表 T_user

|ID|用户主键|
|---|---|
|email|用户邮箱|
|password|用户密码|
|company|用户所在公司|
|address|公司地址|
|trade|公司所属行业|

### 职位表 T_job

|ID|职位主键|
|---|---|
|userId|用户ID|
|title|标题|
|company|用户所在公司|
|description|职位描述|
|applyApproach|申请职位的方法|
|expiryDate|职位申请的截止时间|
|category|工作职位的种类|
|jobType|工作性质|
|tags|职位标签|
|city|所在城市|
|country|所在国家|

### 工作性质 T_jobtype

|ID|工作性质ID主键|
|---|---|
|content|工作性质的内容|

### 职位种类 T_category

|ID|职位种类ID主键|
|---|---|
|content|职位种类的名称|



