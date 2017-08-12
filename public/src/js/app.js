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

$(function () {
    //点击登陆按钮，进行登陆操作
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
    //点击注册按钮，进行注册操作
    $('#register').click(function () {
        let email_register=$('#email').val();
        let password_register=$('#password').val();
        let password_conf=$('#password_conf').val();
        $.post('/send',{
            email:email_register,password:password_register,password_conf:password_conf
        },function (data) {
            if (data===true) {
                alert('注册成功，请前往邮箱验证！')
            }else if(data===false){
                alert('账号已注册！')
            }else if(data==='wrong'){
                alert('两次输入的密码不一致！')
            }
        });
    });
});

/*进入首页得到最新的职位*/
$(document).ready(function () {
    /*刷新最新的内容*/
    $.get('/testjobs',function (data) {
        let result='';
        for(let i=0;i<data.length;i++){
            result+=`
                <a href="#">
                <div class="panel-body col-lg-6 col-md-6" >
			<div class="sixteen wide mobile eight wide tablet four wide computer column">
				<div class="equal height row">
					<div class="ui teal piled segment">
						<p class="ui center aligned dividing header">${data[i].title}</p>

						<p class="job-description center">${data[i].description}
						</p>
						<p class="job-company"><i class="map marker icon"></i><span class="yhx-ef">${data[i].city}/${data[i].country}/${data[i].salary}</span></p>

						<p class="job-time"><i class="time icon"></i><span class="yhx-eh">${data[i].expiryDate}</span></p>
					</div>
				</div>
			</div>
			<div class="ui divider" ></div>
		</div>
        </a>`
        }
        $('#showjobs').append(result);
    });
    $.get('/getjobtype',function (data) {
        let result='';
        for(let i=0;i<data.length;i++){
            result+=`<option value="${data[i].content}">${data[i].content}</option>`
        }
        $("#jobtype").append(result);
    });
    $.get('/getcategory',function (data) {
        let result='';
        for(let i=0;i<data.length;i++){
            result+=`<option value="${data[i].content}">${data[i].content}</option>`
        }
        $("#category").append(result);
    });
});

/*点击搜索工作*/
function searchJobs() {
    let jobtype=$("#jobtype").val();
    let category=$("#category").val();
    let jobname=$("#jobname").val();
    $('#showjobs').empty();
    $.post('/searchjobs',{jobtype:jobtype,category:category,jobname:jobname},function (data) {
        let result=''
        for(let i=0;i<data.length;i++){
            result+=`
                <a href="#">
                <div class="panel-body col-lg-6 col-md-6" >
			<div class="sixteen wide mobile eight wide tablet four wide computer column">
				<div class="equal height row">
					<div class="ui teal piled segment">
						<p class="ui center aligned dividing header">${data[i].title}</p>

						<p class="job-description center">${data[i].description}
						</p>
						<p class="job-company"><i class="map marker icon"></i><span class="yhx-ef">${data[i].city}/${data[i].country}/${data[i].salary}</span></p>

						<p class="job-time"><i class="time icon"></i><span class="yhx-eh">${data[i].expiryDate}</span></p>
					</div>
				</div>
			</div>
			<div class="ui divider" ></div>
		</div>
        </a>`
        }
        console.log(result);
        $('#showjobs').append(result);
    });
}

/******************************************
 * 每过五秒更新推送的内容，循环数据库里的所有内容 *
 ******************************************/
showTime();
var t=0;
function showTime()
{
    $("#ad").empty();
    $.get('/testjobs',function (data) {
        if(t>data.length-3){
            t=0;
        }
        let result='';
        for(let i=t;i<data.length;i++){
            if(i-t<3&&i-t>=0){
                result+=`
                <a href="#">
                <div class="panel-body col-lg-12"  >
			<div class="sixteen wide mobile eight wide tablet four wide computer column">
				<div class="equal height row">
					<div class="ui teal piled segment">
						<p class="ui center aligned dividing header">${data[i].title}</p>

						<p class="job-description center">${data[i].description}
						</p>
						<p class="job-company"><i class="map marker icon"></i><span class="yhx-ef">${data[i].city}/${data[i].country}/${data[i].salary}</span></p>

						<p class="job-time"><i class="time icon"></i><span class="yhx-eh">${data[i].expiryDate}</span></p>
					</div>
				</div>
			</div>
		</div>
        </a>`
            }
            else {
                break;
            }
        }
        $('#ad').append(result);
        t+=3;
        setTimeout("showTime()", 15000);
    });
}

/******************************************
 * 每过五秒更新推送的内容，循环数据库里的所有内容 *
 ******************************************/