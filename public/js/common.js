function logout() {
    $.get('/loginout',function (ans) {
        if(ans){
            window.location.href='../index.html';
        }
    })
}
$.get('/getUserInfo',function (ans) {
        if(ans !== 'no'){
            if(ans.identity === "职位发布者"){
                let str = '';
                str += `<li><a href="../postadmin" style="font-weight:bold;"data-toggle="tooltip"  title="个人主页" data-placement="bottom">${ans.email}</a></li>`;
                str +=`<li><a href="#" onclick="logout()" style="font-weight:bold;"data-toggle="tooltip"  title="注销" data-placement="bottom">注销</a></li>`;
                $('.myheader-right').empty().append(str);
            }else if(ans.identity === "管理员"){
                let str = '';
                str += `<li><a href="../admin" style="font-weight:bold" style="font-weight:bold;"data-toggle="tooltip"  title="个人主页" data-placement="bottom" >${ans.email}</a></li>`;
                str +=`<li><a href="#" onclick="logout()" style="font-weight:bold;"data-toggle="tooltip"  title="注销" data-placement="bottom">注销</a></li>`;
                $('.myheader-right').empty().append(str);
            }
        }
    });
    $(function () { $("[data-toggle='tooltip']").tooltip(); });