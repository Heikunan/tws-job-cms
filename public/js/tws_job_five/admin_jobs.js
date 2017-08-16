

$(document).ready(function () {
    /*得到所有的hotjob*/
    $.get('/hotjob',function (hotjobs) {
        function islike(id) {
            if (hotjobs.some(function (job) {
                    return job.id === id;
                })) {
                return true;
            } else {
                return false;
            }
        }


        $.post('/searchjobs',{jobtype:'',category:'',jobname:''},function (jobs) {
            let result='';
            for(let i=0;i<jobs.length;i++){
                if(islike(jobs[i].id)){
                    result+=`<tr style="background-color: #F37B34">`
                }else {
                    result+=`<tr>`;
                }
                result+=`
                <td width="20"><input type="checkbox" name="" value=""></td>
				<td width="70">${jobs[i].id}</td>
				<td width="120">${jobs[i].userId}</td>
				<td width="300">${jobs[i].title}</td>
 				<td width="100" style="text-align: center;">
 				    <a href="/jobInfo.html?id=${jobs[i].id}" title="编辑" onclick="" class="ml-5" style="text-decoration:none">
 				        <i class="Hui-iconfont">&#xe725;</i>
 				    </a> 
 				    <a title="删除" onclick="admin_job_del(this,${jobs[i].id})" class="ml-5" style="text-decoration:none">
 				        <i class="Hui-iconfont">&#xe6e2;</i>
 				    </a>
 				    <a title="添加热门" onclick="admin_hotjob_add(this,${jobs[i].id})" class="ml-5" style="text-decoration:none">
 				        <i class="Hui-iconfont">&#xe61b;</i>
 				    </a>
 				</td>
            </tr>   `
            }
            $("#sum").html(jobs.length);
            if(result.length===0){
                $('tbody').append("<tr><td colspan='9' style='text-align: center'>暂无任何记录!</td></tr>");
            }
            $('tbody').empty().append(result);
        });
    });
});

/***删除选中的工作**/
function delchosen() {
    let jobsid=[];
    $('tbody tr').each(function (i) {
        let b=$(this).find(':checkbox').get(0).checked;
        let a=$($(this).find('td').get(1)).text();
        if(b){
            jobsid.push(a);
        }
    });
    if (jobsid.length===0){
        layer.alert("无工作可操作！");
    }else {
        layer.confirm('确认要删除此职位吗？', function (index) {
            $.ajax({
                type: 'post',
                url: '/deletejobs',
                dataType: 'json',
                data: {jobsid: jobsid},
                success: function (data) {
                    $("#sum").html($('tbody tr').length - jobsid.length);
                    $('tbody tr').each(function (i) {
                        let b = $(this).find(':checkbox').get(0).checked;
                        if (b) {
                            $(this).remove();
                        }
                    });
                    if($('tbody tr').length===0){
                        $('tbody').append("<tr><td colspan='9' style='text-align: center'>暂无任何记录!</td></tr>");
                    }
                    layer.msg('已删除!', {icon: 1, time: 1000});
                },
                error: function (data) {
                    console.log(data.msg);
                },
            });
        });
    }
}

/*一键审核选中的数据*/
function admin_job_del(obj,id) {
    layer.confirm('工作删除须谨慎，确认要删除吗？',function(index) {
        $.ajax({
            type: 'post',
            url: '/deletejobs',
            dataType: 'json',
            data: {jobsid:[id]},
            success: function (data) {
                $("#sum").html($('tbody tr').length-1);
                $(obj).parents("tr").remove();
                if($('tbody tr').length===0){
                    $('tbody').append("<tr><td colspan='9' style='text-align: center'>暂无任何记录!</td></tr>");
                }
                layer.msg('已删除!', {icon: 1, time: 1000});
            },
            error: function (data) {
                console.log(data.msg);
            },
        });
    });
}

//**添加热门职业***//
function admin_hotjob_add(obj,id) {
    layer.confirm('确定添加此工作为热门吗？',function(index) {
        $.ajax({
            type: 'post',
            url: '/addhotjobs',
            dataType: 'json',
            data: {jobsid:[id]},
            success: function (data) {
                if(data){
                    $(obj).parents("tr").attr("style", "BACKGROUND-COLOR: #F37B34");
                    layer.msg('已添加!', {icon: 1, time: 1000});
                }else{
                    layer.msg('已存在!', {icon: 2, time: 1000});
                }

            },
            error: function (data) {
                console.log(data);
            },
        });
    });
};