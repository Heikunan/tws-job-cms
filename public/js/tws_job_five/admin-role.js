
$(document).ready(function () {
   $.get('/notcheck',function (users) {
       let result='';
      for(let i=0;i<users.length;i++){
      result+=`
          <tr class="text-c">
              <td><input type="checkbox" checked="" name="check"/></td>
              <td>${users[i].id}</td>
              <td>${users[i].email}</td>
              <td>${users[i].identity}</td>
              <td>${users[i].status}</td>
              <td class="f-14">
                  <a title="编辑" onclick="admin_role_check(this,${users[i].id})" style="text-decoration:none">
                  <i class="Hui-iconfont">&#xe6df;</i></a> 
                  <a title="删除" onclick="admin_role_del(this,${users[i].id})" class="ml-5" style="text-decoration:none">
                  <i class="Hui-iconfont">&#xe6e2;</i></a>
              </td>
          </tr>`;
      if(i===users.length-1){
          $('tbody').empty().append(result);
          $("#sum").html(users.length);
      }
      }
   });
})





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

function admin_role_edit(title,url,id,w,h){
    layer_show(title,url,w,h);
}
/***删除这个用户**/
function admin_role_del(obj,id){

    layer.confirm('角色删除须谨慎，确认要删除吗？',function(index) {
            $.ajax({
                type: 'post',
                url: '/deleteuser',
                dataType: 'json',
                data: {usersid: [id]},
                success: function (data) {
                    $("#sum").html($('tbody tr').length-1);
                    $(obj).parents("tr").remove();
                    layer.msg('已删除!', {icon: 1, time: 1000});
                },
                error: function (data) {
                    console.log(data.msg);
                },
            });
    });
}


function delchosen() {
    let usersid=[];
    $('tbody tr').each(function (i) {
        let b=$(this).find(':checkbox').get(0).checked;
        let a=$($(this).find('td').get(1)).text();
        if(b){
            usersid.push(a);
        }
    });

    layer.confirm('角色删除须谨慎，确认要删除吗？',function(index) {
        $.ajax({
            type: 'post',
            url: '/deleteuser',
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
                layer.msg('已删除!', {icon: 1, time: 1000});
            },
            error: function (data) {
                console.log(data.msg);
            },
        });
    });
}