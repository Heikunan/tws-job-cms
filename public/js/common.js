 $.get('/getUserInfo',function (ans) {
        if(ans !== 'no'){
            let str = '';
            str += `<li><a href="../userInfo.html">${ans.email}</a></li>`;
            str +=`<li><a href="../jobPost.html">getposts</a></li>`;
            $('.myheader-right').empty().append(str);
        }
    });
