function getMyPosts() {
    $.get('/myposts')
        .done(function (data) {
            console.log(data);
            return data;
        })
        .fail(function (xhr, status) {
            alert('失败: ' + xhr.status + ', 原因: ' + status)
        })
}

function getMyPostdetail(event) {
    let id = event.target.id;
    console.log(id);
    $.get('/postdetial', {id: id})
        .done(function (data) {
            console.log(data);
            return data;
        })
        .fail(function (xhr, status) {
            return alert('失败: ' + xhr.status + ', 原因: ' + status)
        })
}

$(function () {
    //点击登陆按钮，进行登陆操作
    $('#login').click(function () {
        let email=$('#email').val();
        let password=$('#password').val();
        $.post('/login',{
            email:email,password:password
        },function (data) {
            // if (data==='ok') {
            //     $('.flash_container').append('<div class=alert>登陆成功！</div>')
            //     //获取session中用户信息，在主页更新用户状态
            // }else
                if(data==='wrong'){
                $('.flash_container').append('<div class=alert>密码错误！</div>')
            } else if (data==='inactivated') {
                $('.flash_container').append('<div class=alert>您已注册，请前往邮箱激活账号！</div>')
            }else if(data==='null'){
                $('.flash_container').append('<div class=alert>账号不存在，请注册后登陆！</div>')
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
                $('.flash_container').append('<div class=alert>注册成功，请前往邮箱验证！</div>')
            }else if(data===false){
                $('.flash_container').append('<div class=alert>账号已注册！</div>')
            }else if(data==='wrong'){
                $('.flash_container').append('<div class=alert>两次输入的密码不一致！</div>')
            }
        });
    });
});

/*进入首页得到最新的职位*/

/*得到page的值*/
function getpage() {
    let href=window.location.href;
    let pages=href.split('?page=');
    console.log(pages);
    let page='';
    if(pages.length===1){
        page='1';
    }else{
        page=pages[1];
    }
    return parseInt(page);
}

function changepagenumber(page) {
    $.get('/gettotal',function (data) {
        let totalpage=parseInt(data.length/10)+1;
        /*在最后五页*/
        if(page>=totalpage-3){
            $("#page1").html(totalpage-4);
            $("#page2").html(totalpage-3);
            $("#page3").html(totalpage-2);
            $("#page4").html(totalpage-1);
            $("#page5").html(totalpage);
        }else if(page<=3){
            $("#page1").html(1);
            $("#page2").html(2);
            $("#page3").html(3);
            $("#page4").html(4);
            $("#page5").html(5);
        }else{
            $("#page1").html(page-2);
            $("#page2").html(page-1);
            $("#page3").html(page);
            $("#page4").html(page+1);
            $("#page5").html(page+2);
        }

        $("#pagefirst").attr('href',window.location.href.split("?page=")[0]+"?page=1");
        $("#pagelast").attr('href',window.location.href.split("?page=")[0]+"?page="+totalpage );
        sethref();
        if(page===1){$("#pagefirst").hide()}else {$("#pagefirst").show()}
        if(page===totalpage){$("#pagelast").hide()}else {$("#pagefirst").show()}
    })
}

function sethref() {
    $("#page1").attr('href',window.location.href.split("?page=")[0]+"?page="+$("#page1").html() );
    $("#page2").attr('href',window.location.href.split("?page=")[0]+"?page="+$("#page2").html() );
    $("#page3").attr('href',window.location.href.split("?page=")[0]+"?page="+$("#page3").html() );
    $("#page4").attr('href',window.location.href.split("?page=")[0]+"?page="+$("#page4").html() );
    $("#page5").attr('href',window.location.href.split("?page=")[0]+"?page="+$("#page5").html() );
    console.log( window.location.href.split("?page=")[0]+"?page="+$("#page1").html()+"  hhhhh  ");
}
$(document).ready(function () {
    showdimmer();
    $("#changepage").hide();
    let page=getpage();
    changepagenumber(page);
    let pageshoeline=10;
    /*刷新最新的内容*/
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
    $.post('/testjobs',{page:page},function (data) {
        let result = '';
        for (let i = 0; i < data.length; i++) {
            result += `
                <a href="#">
                <div class="panel-body col-lg-12 col-md-12" >
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
        </a>`;
        }
        $('#showjobs').append(result);
        $("#changepage").show();
        hiddendimmer();
    });

});

/*点击搜索工作*/
function searchJobs() {
    let jobtype=$("#jobtype").val();
    let category=$("#category").val();
    let jobname=$("#jobname").val();
    $('#showjobs').empty();
    $.post('/searchjobs',{jobtype:jobtype,category:category,jobname:jobname},function (data) {
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
        console.log(result);
        $('#showjobs').append(result);
    });
}

/******************************************
 * 每过五秒更新推送的内容，循环数据库里的所有内容 *
 ******************************************/
showTime();
let t=0;
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



function showdimmer() {
    $('#dimmerall').show();
}
function hiddendimmer() {
    $('#dimmerall').hide();
}