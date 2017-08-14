function logout() {
    $.get('/loginout',function (ans) {
        if(ans){
            window.location.reload(true);
        }
    })
}
$.get('/getUserInfo',function (ans) {
        if(ans !== 'no'){
            if(ans.identity === "职位发布者"){
                let str = '';
                str += `<li><a href="../postadmin">${ans.email}</a></li>`;
                str +=`<li><a href="#" onclick="logout()">注销</a></li>`;
                $('.myheader-right').empty().append(str);
            }else if(ans.identity === "管理员"){
                let str = '';
                str += `<li><a href="../admin">${ans.email}</a></li>`;
                str +=`<li><a href="#" onclick="logout()">注销</a></li>`;
                $('.myheader-right').empty().append(str);
            }
        }
    });
