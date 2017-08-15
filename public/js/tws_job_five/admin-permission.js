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
				<td style="text-overflow:ellipsis;  overflow:hidden;">${jobs[i].description}</td>
				<td width="100" style="text-align: center;"><a title="编辑" href="javascript:;" onclick="admin_permission_edit('角色编辑','admin-permission-add.html','1','','310')" class="ml-5" style="text-decoration:none"><i class="Hui-iconfont">&#xe6df;</i></a> <a title="删除" href="javascript:;" onclick="admin_permission_del(this,'1')" class="ml-5" style="text-decoration:none"><i class="Hui-iconfont">&#xe6e2;</i></a></td>
            </tr>   `
            }
            $('tbody').empty().append(result);
    });
});