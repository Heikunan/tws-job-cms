/*初始化得到未审核的数据*/
$(document).ready(function () {
   $.get('/notcheck',function (users) {
       let result='';
      for(let i=0;i<users.length;i++){
      result+=`
          <tr class="text-c">
              <td><input type="checkbox"/></td>
              <td>${users[i].id}</td>
              <td>${users[i].email}</td>
              <td>${users[i].identity}</td>
              <td>${users[i].status},${users[i].isactive?'已激活':'未激活'}</td>
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
       if($('tbody tr').length===0){
           $('tbody').append("<tr><td colspan='9' style='text-align: center'>暂无任何记录!</td></tr>");
       }
   });
})


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
                if($('tbody tr').length===0){
                    $('tbody').append("<tr><td colspan='9' style='text-align: center'>暂无任何记录!</td></tr>");
                }
                layer.msg('审核已通过！', {icon: 1, time: 1000});
            },
            error: function (data) {
                console.log(data.msg);
            },
        });
    });
}

/***删除这个用户**/
function admin_role_del(obj,id){
    layer.confirm('角色删除须谨慎，确认要删除吗？',function(index) {
        $.ajax({
            type: 'post',
            url: '/deleteuser',
            dataType: 'json',
            data: {usersid:[id]},
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


function delchosen() {
    let usersid=[];
    if($($('tr').get(2)).text().indexOf('记录')===-1){
        $('tbody tr').each(function (i) {
            let b=$(this).find(':checkbox').get(0).checked;
            let a=$($(this).find('td').get(1)).text();
            if(b){
                usersid.push(a);
            }
        });
    }
    if (usersid.length===0){
        layer.msg('未选中任何记录!', {icon: 2, time: 1000});
    }else {
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
function checkchosen() {
    let usersid=[];
    if($($('tr').get(2)).text().indexOf('记录')===-1){
        $('tbody tr').each(function (i) {
            let b=$(this).find(':checkbox').get(0).checked;
            let a=$($(this).find('td').get(1)).text();
            if(b){
                usersid.push(a);
            }
        });
    }
    if(usersid.length!==0){
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
                    if($('tbody tr').length===0){
                        $('tbody').append("<tr><td colspan='9' style='text-align: center'>暂无任何记录!</td></tr>");
                    }
                    layer.msg('审核成功!', {icon: 1, time: 1000});
                },
                error: function (data) {
                    console.log(data.msg);
                },
            });
        });
    }else{
        layer.msg('未选中任何记录!', {icon: 2, time: 1000});
    }
}