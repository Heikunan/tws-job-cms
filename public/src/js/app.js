
$.get('/getUserInfo',function (ans) {
    if(ans !== 'no'){
        console.log(ans);
        let str=`<li><a href="#">getposts</a></li>`;
        str += `<li><a href="#">${ans.email}</a></li>`;
        $('.myheader-right').empty().append(str);
    }
});

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
