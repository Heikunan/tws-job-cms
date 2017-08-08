# tws_job_cms

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

### 使用cookie与session技术使用户可以跨页面登录

```

```




# 数据库的设计

## 数据库的名称

### twsjob

### 用户表 T_user

|||
|---|---|
|ID|用户主键|
|email|用户邮箱|
|password|用户密码|
|company|用户所在公司|
|address|公司地址|
|trade|公司所属行业|

### 职位表 T_job

|||
|---|---|
|ID|职位主键|
|userId|用户ID|
|title|用户密码|
|company|用户所在公司|
|description|公司地址|
|applyApproach|公司所属行业|
|expiryDate|职位申请的截止时间|
|category|工作职位的种类|
|jobType|工作性质|
|tags|职位标签|
|city|所在城市|
|country|所在国家|

### 工作性质 T_jobtype

|||
|---|---|
|ID|工作性质ID主键|
|content|工作性质的内容|

### 职位种类 T_category

|||
|---|---|
|ID|职位种类ID主键|
|content|职位种类的名称|



