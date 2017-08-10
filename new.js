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