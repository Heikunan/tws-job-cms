$.get('/tjobcount',function (ans) {
    let mynum = ans['count(*)'];
    mynum = parseInt(mynum/10)+1;
    $('#fenye').jqPaginator({
        totalPages: mynum,
        visiblePages: 10,
        currentPage: 1,
        first: '<li class="first"><a href="javascript:void(0);">首页</a></li>',
        prev: '',
        next: '',
        last: '<li class="last"><a href="javascript:void(0);">最后一页</a></li>',
        page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
        onPageChange: function (num, type) {
            $.post('/testjobs',{num:num},function (ans) {
                let str = '';
                for(let i =0;i<ans.length;i++){
                    let benefits = ans[i].benefits.split(',');
                    let tags = ans[i].tags.split(',');
                    str += `<div class="panel job-contain panel-default">
					<a href="jobinfo.html?id=${ans[i].id}">
						<div class="panel-body">
							<div class="job-card">
								<div class="job-primary">
									<div class="info-primary">
										<h3 class="name">${ans[i].title} <span class="red">${ans[i].salary}</span></h3>
										<p>${ans[i].country}<em class="vline"></em>${ans[i].city}<em class="vline"></em>${ans[i].education}</p>
									</div>
									<div class="info-company">
										<div class="company-text">
											<h3 class="name">${ans[i].company}</h3>
											<p>需要${ans[i].num}人<em class="vline"></em>${ans[i].companyType}<em class="vline"></em>${ans[i].companySize}</p>
										</div>
									</div>
								</div>
								<div class="job-tags">
									<div class="job-author">
										<p>${benefits[0]}<em class="vline"></em>${benefits[1]}<img src="${ans[i].Logo}"></p>
									</div>
									<span>${tags[0]}</span><span>${tags[1]}</span>
								</div>
								<div class="job-time">
									<div class="time">截至时间&nbsp;${ans[i].expiryDate}</div>
								</div>
							</div>
						</div>
					</a>
				</div>`
                }
                $('#myleft-job-all').empty().append(str);
            })
        }
    });
});

$(document).ready(function () {
    $('.btn.my-btn').on('click',function () {
        let mysaixuan={salary:'(',jobType:'(',companyType:'(',companySize:'(',category:'(',education:'(',title:'(\'\%\%\')'}
        if($(this).attr('class').indexOf('btn-warning')>=0) {
            $(this).removeClass('btn-warning');
        }else{
            $(this).addClass('btn-warning');
        }
        getstr(mysaixuan);
        for(let a in mysaixuan){
            mysaixuan[a]+='\'%%\')';
        }
        console.log(mysaixuan);
        $.post('/supersearch',mysaixuan,function (ans) {
            let mynum = ans.length;
            if(mynum>10){
                if(mynum%10 === 0){
                    mynum = parseInt(mynum/10);
                }else {
                    mynum = parseInt(mynum/10)+1;
                }
                $('#fenye').jqPaginator({
                    totalPages: mynum,
                    visiblePages: 10,
                    currentPage: 1,
                    first: '<li class="first"><a href="javascript:void(0);">首页</a></li>',
                    prev: '',
                    next: '',
                    last: '<li class="last"><a href="javascript:void(0);">最后一页</a></li>',
                    page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
                    onPageChange: function (num, type) {
                        let currentnum = (num - 1) * 10;
                        let str = '';
                        if (num !== mynum) {
                            for (let i = currentnum; i <= (currentnum + 9); i++) {
                                let benefits = ans[i].benefits.split(',');
                                let tags = ans[i].tags.split(',');
                                str += `<div class="panel job-contain panel-default">
					<a href="jobinfo.html?id=${ans[i].id}">
						<div class="panel-body">
							<div class="job-card">
								<div class="job-primary">
									<div class="info-primary">
										<h3 class="name">${ans[i].title} <span class="red">${ans[i].salary}</span></h3>
										<p>${ans[i].country}<em class="vline"></em>${ans[i].city}<em class="vline"></em>${ans[i].education}</p>
									</div>
									<div class="info-company">
										<div class="company-text">
											<h3 class="name">${ans[i].company}</h3>
											<p>${ans[i].jobType}<em class="vline"></em>需要${ans[i].num}人<em class="vline"></em>${ans[i].companyType}<em class="vline"></em>${ans[i].companySize}</p>
										</div>
									</div>
								</div>
								<div class="job-tags">
									<div class="job-author">
										<p>${benefits[0]}<em class="vline"></em>${benefits[1]}<img src="${ans[i].Logo}"></p>
									</div>
									<span>${tags[0]}</span><span>${tags[1]}</span>
								</div>
								<div class="job-time">
									<div class="time">截至时间&nbsp;${ans[i].expiryDate}</div>
								</div>
							</div>
						</div>
					</a>
				</div>`
                            }
                            $('#myleft-job-all').empty().append(str);
                        } else if (num === mynum) {
                            for (let i = currentnum; i < ans.length; i++) {
                                let benefits = ans[i].benefits.split(',');
                                let tags = ans[i].tags.split(',');
                                str += `<div class="panel job-contain panel-default">
					<a href="jobinfo.html?id=${ans[i].id}">
						<div class="panel-body">
							<div class="job-card">
								<div class="job-primary">
									<div class="info-primary">
										<h3 class="name">${ans[i].title} <span class="red">${ans[i].salary}</span></h3>
										<p>${ans[i].country}<em class="vline"></em>${ans[i].city}<em class="vline"></em>${ans[i].education}</p>
									</div>
									<div class="info-company">
										<div class="company-text">
											<h3 class="name">${ans[i].company}</h3>
											<p>需要${ans[i].num}人<em class="vline"></em>${ans[i].companyType}<em class="vline"></em>${ans[i].companySize}</p>
										</div>
									</div>
								</div>
								<div class="job-tags">
									<div class="job-author">
										<p>${benefits[0]}<em class="vline"></em>${benefits[1]}<img src="${ans[i].Logo}"></p>
									</div>
									<span>${tags[0]}</span><span>${tags[1]}</span>
								</div>
								<div class="job-time">
									<div class="time">截至时间&nbsp;${ans[i].expiryDate}</div>
								</div>
							</div>
						</div>
					</a>
				</div>`
                            }
                            $('#myleft-job-all').empty().append(str);
                        }
                    }
                });
            }else if(mynum>0){
                $('#fenye').jqPaginator({
                    totalPages: 1,
                    visiblePages: 10,
                    currentPage: 1,
                    first: '<li class="first"><a href="javascript:void(0);">首页</a></li>',
                    prev: '',
                    next: '',
                    last: '<li class="last"><a href="javascript:void(0);">最后一页</a></li>',
                    page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
                    onPageChange: function (num, type) {
                        let str = '';
                        for(let i = 0 ;i<mynum;i++){
                            let benefits = ans[i].benefits.split(',');
                            let tags = ans[i].tags.split(',');
                            str += `<div class="panel job-contain panel-default">
					<a href="jobinfo.html?id=${ans[i].id}">
						<div class="panel-body">
							<div class="job-card">
								<div class="job-primary">
									<div class="info-primary">
										<h3 class="name">${ans[i].title} <span class="red">${ans[i].salary}</span></h3>
										<p>${ans[i].country}<em class="vline"></em>${ans[i].city}<em class="vline"></em>${ans[i].education}</p>
									</div>
									<div class="info-company">
										<div class="company-text">
											<h3 class="name">${ans[i].company}</h3>
											<p>${ans[i].jobType}<em class="vline"></em>需要${ans[i].num}人<em class="vline"></em>${ans[i].companyType}<em class="vline"></em>${ans[i].companySize}</p>
										</div>
									</div>
								</div>
								<div class="job-tags">
									<div class="job-author">
										<p>${benefits[0]}<em class="vline"></em>${benefits[1]}<img src="${ans[i].Logo}"></p>
									</div>
									<span>${tags[0]}</span><span>${tags[1]}</span>
								</div>
								<div class="job-time">
									<div class="time">截至时间&nbsp;${ans[i].expiryDate}</div>
								</div>
							</div>
						</div>
					</a>
				</div>`
                        }
                        $('#myleft-job-all').empty().append(str);
                    }
                });
            }else {
                $('#myleft-job-all').empty();
            }
        });

    })
});

function getstr(obj) {
    $('.salary span').each(function () {
        if($(this).attr('class').indexOf('btn-warning')>=0){
            obj.salary+='\''+$(this).text()+'\',';
        }
    });
    $('.jobType span').each(function () {
        if($(this).attr('class').indexOf('btn-warning')>=0){
            obj.jobType+='\''+$(this).text()+'\',';
        }
    });
    $('.category span').each(function () {
        if($(this).attr('class').indexOf('btn-warning')>=0){
            obj.category+='\''+$(this).text()+'\',';
        }
    });
    $('.education span').each(function () {
        if($(this).attr('class').indexOf('btn-warning')>=0){
            obj.education+='\''+$(this).text()+'\',';
        }
    });
    $('.companySize span').each(function () {
        if($(this).attr('class').indexOf('btn-warning')>=0){
            obj.companySize+='\''+$(this).text()+'\',';
        }
    });
    $('.companyType span').each(function () {
        if($(this).attr('class').indexOf('btn-warning')>=0){
            obj.companyType+='\''+$(this).text()+'\',';
        }
    });
}

$.get('/job_suggest',function (ans) {
    let str='';
    for (let i=0;i<ans.length;i++) {
        str+=`<div class="suggest_contain center-block">
                <a href="jobinfo.html?id=${ans[i].id}">
                    <img src="${ans[i].Logo}" alt="${ans[i].company}" class="img_suggest center-block">
                    <span>${ans[i].title}</span>
                </a>
              </div>`
    }
    $('#job_suggest').append(str);
});

