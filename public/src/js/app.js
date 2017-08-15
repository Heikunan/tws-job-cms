$.post('/testjobs',{num:1},function (ans) {
    let str = '';
    for(let i = 0;i<ans.length;i++){
        str += `<div class="myjob-contain">
							<a href="./jobInfo.html?id=${ans[i].id}">
							<div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
								<div class="panel panel-default mybox">
									<div class="panel-body">
										<div class="img-box">
											<img class="img-responsive"  src="http://szimg.mukewang.com/5987c96700019fba05400300-360-202.jpg">
										</div>
										<div class="job-box">
											<div class="job-title">
												<span>${ans[i].title}</span>
											</div>
											<div class="job-description">
												<span>${ans[i].description}</span>
											</div>
											<div class="job-company">
												<p><span class="glyphicon glyphicon-globe"></span>&nbsp;${ans[i].company}</p>
											</div>
											<div class="job-bottom">
												<div class="pull-left">
													<div class="job-city">
														<p><span class="glyphicon glyphicon-map-marker"></span>&nbsp;${ans[i].country}</p>
													</div>
												</div>
												<div class="pull-right job-bottom-right">
													<div class="job-time">
														<p><span class="glyphicon glyphicon-time"></span>&nbsp;${ans[i].expiryDate}</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							</a>
						</div>`;
    }
    $('#myjobcontain').empty().append(str);
});

$(document).ready(function () {
    let zwlb = '';
    let zwzl = '';
    $('.dropdown-menu-zwlb').on('click',function () {
        zwlb = $(this).children().text().replace(/[\r\n]/g,"");
        let last = $('#zwlb-title').html();
        $(this).children().text(last);
        $('#zwlb-title').html(zwlb);
    });
    $('.dropdown-menu-zwzl').on('click',function () {
        zwzl = $(this).children().text().replace(/[\r\n]/g,"");
        $('#zwzl-title').html(zwzl);
    });
    $('.search-background-icon').on('click',function () {
        let mydata = {
            category:zwlb,
            jobtype:zwzl,
            jobname:$('#my-seach-input').val()
        };
       $.post('/searchjobs',mydata,function (ans) {
           console.log(ans);
       }) 
    });
});


