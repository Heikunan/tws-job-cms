function getMyPosts() {
    $.get('/myposts')
        .done(function (data) {
            console.log(data)
            return data;
        })
        .fail(function (xhr, status) {
            alert('失败: ' + xhr.status + ', 原因: ' + status)
        })


}

function getMyPostdetail(event) {
    let id = event.target.id
    console.log(id)
    $.get('/postdetial', {id: id})
        .done(function (data) {
            console.log(data)
            return data;
        })
        .fail(function (xhr, status) {
            return alert('失败: ' + xhr.status + ', 原因: ' + status)
        })

}

