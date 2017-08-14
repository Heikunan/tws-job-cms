$.get('/getUserInfo',function (ans) {
    if(ans !== 'no'){
        console.log(ans);
        let str=`<li><a href="#">getposts</a></li>`;
        str += `<li><a href="#">${ans.email}</a></li>`;
        $('.myheader-right').empty().append(str);
    }
});