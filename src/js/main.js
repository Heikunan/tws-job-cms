
$(document).ready(function () {
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
    });});

