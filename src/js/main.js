
/*$(document).ready(function () {
    $('.yhx').on('click',function () {
   $.get('/allJobs').then(function (ans) {
        console.log(ans);

    })

});
    $('.btn-default').on('click',function () {

        let jobName= $('.form-control').val();
       $.post('/searchResult', {jobName: jobName}, function (res) {
                console.log(res);
        });
    });
});*/
$(document).ready(function () {
    $('.yhx-btn-default').on('click', function () {

        let jobName = $('.yhx-form-control').val();

        $.post('/searchResult', {jobName: jobName}, function (ans) {

                let str = '';
                for (let i = 0; i < ans.length; i++) {
                    str += '<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 ttx-movie">';
                    str += `<a onclick="myonclickhrf(${ans[i].id})">`;
                    str += `<p class="ttx-movie-text"><a onclick="myonclickhrf(${ans[i].id})" >${ans[i].title}</a><strong>${ans[i].company}</strong></p>`;
                    str += `</div>`;
                }
                $(".ttx-movie-container").empty().append(str);

        });


    });
});
