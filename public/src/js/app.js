function getMyPosts() {
    $.get('/myposts')
        .done(function (data) {
            console.log(data)
            return data;
        })
        .fail(function (xhr, status) {
            alert('失败: ' + xhr.status + ', 原因: ' + status)
        })
}

function getMyPostdetail(event) {
    let id = event.target.id
    console.log(id)
    $.get('/postdetial', {id: id})
        .done(function (data) {
            console.log(data)
            return data;
        })
        .fail(function (xhr, status) {
            return alert('失败: ' + xhr.status + ', 原因: ' + status)
        })
}

//点击主界面的signIn，进行登陆操作 start here//
$(function () {
    $('#sign_in').click(function () {
        let email=$('#email').val();
        let password=$('#password').val();
        $.post('/sign_in',{
            email:email,password:password
        },function (data) {
            if (data==='ok') {
                alert('登陆成功！')
                //获取session中用户信息，在主页更新用户状态
            }else if(data==='wrong'){
                alert('密码错误！')
            } else if (data==='inactivated') {
                alert('您已注册，请前往邮箱激活账号！')
            }else if(data==='null'){
                alert('账号不存在，请注册后登陆！')
            }
        });
    });
})
//点击主界面的signIn，进行登陆操作 end here//

/*进入首页得到最新的职位*/
$(document).ready(function () {
    $.get('/testjobs',function (data) {
        console.log(data);
        let result=''
        for(let i=0;i<data.length;i++){
            result+=`
                <div class="panel-body"  style="padding-top: 130px">
                    <div class="job-box">
                        <div class="job-title" style="padding-bottom: 2em;">
                        	<h1>${data[i].title}</h1>
                    	</div>

                    	<div class="job-description">
                        	<p>在互联网时代，javaEE技术体系毫无疑问的成为了服务器端编程领域的王者，在未来新的业务领域有着更辉煌的发展前景，可以从事金融、互联网、电商、医疗等行业的核心软件系统开发。构建基于Hadoop、spark、Storm等大数据核心技术的商业支撑系统。 </p>
                    	</div>

                    	<div class="job-company">
                        	<p><span class="glyphicon glyphicon-globe"></span>&nbsp;阿里巴巴股份有限公司</p>
                    	</div>

                    	<div class="job-bottom">
                        	<div class="pull-left">
								<div class="job-city">
									<p><span class="glyphicon glyphicon-map-marker"></span>&nbsp;武汉</p>
								</div>
                    		</div>

                    		<div class="pull-right job-bottom-right">
                        		<div class="job-time">
                        			<p><span class="glyphicon glyphicon-time"></span>&nbsp;2017-12-10</p>
                    			</div>
                    		</div>
                    	</div>
                    </div>
                    <div class="ui divider" style="margin-top: 130px;"></div>
                </div>`
        }
        console.log(result);
        $('#showjobs').append(result);
    });
});