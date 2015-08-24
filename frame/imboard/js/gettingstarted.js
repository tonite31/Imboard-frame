$(document).ready(function()
{
	$("#contentList").compile({top : 70, direction : "vertical"});
	$("#contentList li:first").addClass("selected");
	$(window).on("scroll", setSelectedContent);
	setSelectedContent.call(window);
	
	anchorScroll(location.hash);
	$(window).on("hashchange", function()
	{
		anchorScroll(location.hash);
	});
	
	$("a[data-download-url]").on("click", function()
	{
		var result = $.api.data.getData({id : "downloadCount"});
		if(result.code == 1000)
		{
			if(result.data)
			{
				$.api.data.updateData({id : "downloadCount", data : parseInt(result.data.data) + 1});
			}
			else
			{
				$.api.data.insertData({id : "downloadCount", data : "1"})
			}
		}
		
		window.open($(this).attr("data-download-url"));
	});
});