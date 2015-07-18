$(document).ready(function()
{
	if($.query.fragment)
	{
		$(".navbar-nav li").removeAttr("active");
		$(".navbar-nav li a[href^='?fragment=" + $.query.fragment + "']").parent().addClass("active");
	}

	var result = $.api.article.getArticleList({boardId : "patchnote", searchData : {startIndex:0, endIndex:1}});
	if(result.code == 1000 && result.data.length > 0)
	{
		$("*[data-id='currentVersion']").text(result.data[0].subject);
	}
});