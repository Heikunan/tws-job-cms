
    $.get('/getUserInfo',function (ans) {
        if(ans !== 'no'){
            console.log(ans);
            let str=`<li><a href="../jobPost.html">getposts</a></li>`;
            str += `<li><a href="../userInfo.html">${ans.email}</a></li>`;
            $('.myheader-right').empty().append(str);
        }
    });
