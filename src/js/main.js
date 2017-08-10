function a() {
    let jobName='o';
    $.post('/searchResult', {jobName: jobName}, function (res) {
        console.log(res);
    });
    $.get('/allJobs', function (res) {
        console.log(res);
    });
}