$.post('/testjobs',{num:1},function (ans) {
    let str = '';
    for(let i = 0;i<ans.length;i++){
        str+=`<div class="panel panel-default">
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
				</div>`;
    }
    $('#myleft-job-all').empty().append(str);
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

$.get('/job_suggest',function (ans) {
    let str='';
    for (var i=0;i<ans.length;i++) {
        str+=`<div class="job_suggest">
                <a href="#">
                    <img src="${ans[i].Logo}" alt="${ans[i].company}" class="img_suggest center-block">
                    <p class="title_suggest">${ans[i].title}</p>
                </a>
              </div>`
    }
    $('#job_suggest').append(str);
});

