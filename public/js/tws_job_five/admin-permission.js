$(document).ready(function () {
    $.post('/searchjobs',{jobtype:'',category:'',jobname:''},function (jobs) {
        let result='';
        for(let i=0;i<10;i++){
                result+=`
            <tr>
                <td width="20"><input type="checkbox" name="" value=""></td>
				<td width="70">${jobs[i].id}</td>
				<td width="120">${jobs[i].userId}</td>
				<td width="300">${jobs[i].title}</td>
 				<td width="100" style="text-align: center;">
 				    <a href="/jobInfo.html?id=${jobs[i].id}" title="编辑" onclick="" class="ml-5" style="text-decoration:none">
 				        <i class="Hui-iconfont">&#xe725;</i>
 				    </a> 
 				    <a title="删除" onclick="" class="ml-5" style="text-decoration:none">
 				        <i class="Hui-iconfont">&#xe6e2;</i>
 				    </a>
 				</td>
            </tr>   `
            }
            $('tbody').empty().append(result);
    });
});


/*审核单个用户*/
function admin_role_check(obj,id){
    layer.confirm('确认完成此为用户的审核吗？',function(index) {
        $.ajax({
            type: 'post',
            url: '/tochecked',
            dataType: 'json',
            data: {usersid: [id]},
            success: function (data) {
                $("#sum").html($('tbody tr').length-1);
                $(obj).parents("tr").remove();
                layer.msg('审核已通过！', {icon: 1, time: 1000});
            },
            error: function (data) {
                console.log(data.msg);
            },
        });
    });
}

/***删除这个用户**/

function delchosen() {
    let jobsid=[];
    $('tbody tr').each(function (i) {
        let b=$(this).find(':checkbox').get(0).checked;
        let a=$($(this).find('td').get(1)).text();
        if(b){
            jobsid.push(a);
        }
    });
    console.log(jobsid);

    layer.confirm('确认要删除此职位吗？',function(index) {
        $.ajax({
            type: 'post',
            url: '/deletejobs',
            dataType: 'json',
            data: {jobsid:jobsid},
            success: function (data) {
                $("#sum").html($('tbody tr').length-jobsid.length);
                $('tbody tr').each(function (i) {
                    let b=$(this).find(':checkbox').get(0).checked;
                    if(b){
                        $(this).remove();
                    }
                });
                layer.msg('已删除!', {icon: 1, time: 1000});
            },
            error: function (data) {
                console.log(data.msg);
            },
        });
    });
}
/*一键审核选中的数据*/
function checkchosen() {
    let usersid=[];
    $('tbody tr').each(function (i) {
        let b=$(this).find(':checkbox').get(0).checked;
        let a=$($(this).find('td').get(1)).text();
        if(b){
            usersid.push(a);
        }
    });

    layer.confirm('确认完成此为用户的审核吗？',function(index) {
        $.ajax({
            type: 'post',
            url: '/tochecked',
            dataType: 'json',
            data: {usersid:usersid},
            success: function (data) {
                $("#sum").html($('tbody tr').length-usersid.length);
                $('tbody tr').each(function (i) {
                    let b=$(this).find(':checkbox').get(0).checked;
                    if(b){
                        $(this).remove();
                    }
                });
                layer.msg('审核成功!', {icon: 1, time: 1000});
            },
            error: function (data) {
                console.log(data.msg);
            },
        });
    });
}