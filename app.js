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
//            let email=cp.hex($('#email').val());
//            let password=cp.hex($('#password').val());
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

$(document).ready(function () {
$.get()
});