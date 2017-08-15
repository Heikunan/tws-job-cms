/*
<div class="panel job-contain panel-default">
					<a href="">
						<div class="panel-body">
							<div class="job-card">
								<div class="job-primary">
									<div class="info-primary">
										<h3 class="name">技术总监 <span class="red">10K-15K</span></h3>
										<p>武汉<em class="vline"></em>5-10年<em class="vline"></em>大专</p>
									</div>
									<div class="info-company">
										<div class="company-text">
											<h3 class="name">兆讯移动</h3>
											<p>移动互联网<em class="vline"></em>不需要融资<em class="vline"></em>20-99人</p>
										</div>
									</div>
								</div>
								<div class="job-tags">
									<div class="job-author">
										<p>潘荣荣<em class="vline"></em>行政人力主管<img src="https://img.bosszhipin.com/beijin/mcs/useravatar/20161013/2438e95364d793dd5f0edc6f6b4f08718c7dd922ad47494fc02c388e12c00eac_s.jpg"></p>
									</div>
									<span>系统架构</span><span>高级技术管理</span><span>APP开发</span>
								</div>
								<div class="job-time">
									<div class="time">发布于06月06日</div>
								</div>
							</div>
						</div>
					</a>
				</div>
*/
$.get('/tjobcount',function (ans) {
    let mynum = ans['count(*)'];
    mynum = parseInt(mynum/10)+1;
    $('#fenye').jqPaginator({
        totalPages: mynum,
        visiblePages: 10,
        currentPage: 1,
        onPageChange: function (num, type) {
            $.post('/testjobs',{num:num},function (ans) {
               let str = '';
               for(let i =1;i<ans.length;i++){
                   str += `<div class="panel job-contain panel-default">
					<a href="jobinfo.html?id=${ans[i].id}">
						<div class="panel-body">
							<div class="job-card">
								<div class="job-primary">
									<div class="info-primary">
										<h3 class="name">技术总监 <span class="red">${ans[i].salary}</span></h3>
										<p>${ans[i].country}<em class="vline"></em>${ans[i].city}<em class="vline"></em>${ans[i].education}</p>
									</div>
									<div class="info-company">
										<div class="company-text">
											<h3 class="name">兆讯移动</h3>
											<p>移动互联网<em class="vline"></em>不需要融资<em class="vline"></em>20-99人</p>
										</div>
									</div>
								</div>
								<div class="job-tags">
									<div class="job-author">
										<p>潘荣荣<em class="vline"></em>行政人力主管<img src="https://img.bosszhipin.com/beijin/mcs/useravatar/20161013/2438e95364d793dd5f0edc6f6b4f08718c7dd922ad47494fc02c388e12c00eac_s.jpg"></p>
									</div>
									<span>系统架构</span><span>高级技术管理</span><span>APP开发</span>
								</div>
								<div class="job-time">
									<div class="time">发布于&nbsp;${ans[i].expiryDate}</div>
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

$.get('/getcategory',function (ans) {
    let str = '';
    for(let i =0;i<ans.length;i++){
        str += `<div class="dropdown-menu-contain dropdown-menu-zwlb">
						<div class="dropdown-menu-text">
							${ans[i].content}
						</div>
					</div>`
    }
    $('.zwlb').empty().append(str);
});

$.get('/getjobtype',function (ans) {
    let str = '';
    for(let i =0;i<ans.length;i++){
        str += `<div class="dropdown-menu-contain dropdown-menu-zwzl">
						<div class="dropdown-menu-text">
							${ans[i].content}
						</div>
					</div>`
    }
    $('.zwzl').empty().append(str);
});

$(document).ready(function () {
    let zwlb = '';
    let zwzl = '';
    $(document).on('click','.dropdown-menu-zwlb',function () {
        zwlb = $(this).children().text().replace(/[\r\n]/g,"");
        let last = $('#zwlb-title').text();
        $(this).children().text(last);
        $('#zwlb-title').html(zwlb);
    });
    $(document).on('click','.dropdown-menu-zwzl',function () {
        zwzl = $(this).children().text().replace(/[\r\n]/g,"");
        let my = $('#zwzl-title').html();
        $(this).children().text(my);
        $('#zwzl-title').html(zwzl);
    });
    $('.search-background-icon').on('click',function () {
        if(zwlb === '全部类别'){
            zwlb = '';
        }
        if(zwzl === '全部种类'){
            zwzl = '';
        }
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


