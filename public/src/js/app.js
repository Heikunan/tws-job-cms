$.get('/tjobcount', function(ans) {
    let mynum = ans['count(*)'];
    mynum = parseInt(mynum / 10) + 1;
    $('#fenye').jqPaginator({
        totalPages: mynum,
        visiblePages: 10,
        currentPage: 1,
        first: '<li class="first"><a href="javascript:void(0);">首页</a></li>',
        prev: '',
        next: '',
        last: '<li class="last"><a href="javascript:void(0);">最后一页</a></li>',
        page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
        onPageChange: function(num, type) {
            $.post('/testjobs', { num: num }, function(ans) {
                let str = '';
                for (let i = 0; i < ans.length; i++) {
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
            })
        }
    });
});

$.get('/getcategory', function(ans) {
    let str = '';
    for (let i = 0; i < ans.length; i++) {
        str += `<div class="dropdown-menu-contain dropdown-menu-zwlb">
						<div class="dropdown-menu-text">${ans[i].content}</div>
					</div>`
    }
    $('.zwlb').empty().append(str);
});

$.get('/getjobtype', function(ans) {
    let str = '';
    for (let i = 0; i < ans.length; i++) {
        str += `<div class="dropdown-menu-contain dropdown-menu-zwzl">
						<div class="dropdown-menu-text">${ans[i].content}</div>
					</div>`
    }
    $('.zwzl').empty().append(str);
});

$(document).ready(function() {
    let zwlb = '';
    let zwzl = '';
    $(document).on('click', '.dropdown-menu-zwlb', function() {
        zwlb = $(this).children().text().replace(/[\r\n]/g, "");
        let last = $('#zwlb-title').text();
        $(this).children().text(last);
        $('#zwlb-title').html(zwlb);
    });
    $(document).on('click', '.dropdown-menu-zwzl', function() {
        zwzl = $(this).children().text().replace(/[\r\n]/g, "");
        let my = $('#zwzl-title').html();
        $(this).children().text(my);
        $('#zwzl-title').html(zwzl);
    });
    $('.search-background-icon').on('click', function() {
        let mylu = `<li>全部职位</li>`;
        if (zwlb === '') {
            mylu += `<li>全部类别</li>`;
        } else {
            mylu += `<li>${zwlb}</li>`;
        }
        if (zwzl === '') {
            mylu += `<li class="active">全部种类</li>`;
        } else {
            mylu += `<li class="active">${zwzl}</li>`;
        }
        $('.breadcrumb').empty().append(mylu);
        if (zwlb === '全部类别') {
            zwlb = '';
        }
        if (zwzl === '全部种类') {
            zwzl = '';
        }
        let mydata = {
            category: zwlb,
            jobtype: zwzl,
            jobname: $('#my-seach-input').val()
        };
        $.post('/searchjobs', mydata, function(ans) {
            let mynum = ans.length;
            if (mynum >= 10) {
                if (mynum % 10 === 0) {
                    mynum = parseInt(mynum / 10);
                } else {
                    mynum = parseInt(mynum / 10) + 1;
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
                    onPageChange: function(num, type) {
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
            } else if (mynum > 0) {
                $('#fenye').jqPaginator({
                    totalPages: 1,
                    visiblePages: 10,
                    currentPage: 1,
                    first: '<li class="first"><a href="javascript:void(0);">首页</a></li>',
                    prev: '',
                    next: '',
                    last: '<li class="last"><a href="javascript:void(0);">最后一页</a></li>',
                    page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
                    onPageChange: function(num, type) {
                        let str = '';
                        for (let i = 0; i < mynum; i++) {
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
            } else {
                $('#myleft-job-all').empty();
            }
        })
    });
});

$.get('/job_suggest', function(ans) {
    let str = '';
    for (let i = 0; i < ans.length; i++) {
        str += `<div class="suggest_contain center-block">
                <a href="jobinfo.html?id=${ans[i].id}">
                    <img src="${ans[i].Logo}" alt="${ans[i].company}" class="img_suggest center-block">
                    <span>${ans[i].title}</span>
                </a>
              </div>`
    }
    $('#job_suggest').append(str);
});