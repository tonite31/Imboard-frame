$(document).ready(function()
{
	$("#contentList").compile({top : 20, direction : "vertical"});
	$("#contentList li:first").addClass("selected");
	$(window).on("scroll", setSelectedContent);
	setSelectedContent.call(window);
});

function setSelectedContent()
{
	var top = $(this).scrollTop();
	
	$("#contentList li.selected").removeClass("selected");
	
	var minTarget = null;
	$("#documentArea *[id^=doc]").each(function()
	{
		var rect = this.getBoundingClientRect();
		if($(window).scrollTop() + $(window).height() == $(document).height()) 
		{
			minTarget = {distance : rect.top, element : $("#documentArea *[id^=doc]:last")};
		}
		else if(rect.top <= 0)
		{
			if(!minTarget || minTarget.distance < rect.top)
			{
				minTarget = {distance : rect.top, element : this};
			}
		}
	});
	
	if(minTarget)
	{
		var a = $("#contentList li a[href='#" + $(minTarget.element).attr("id") + "']");
		a.parent().addClass("selected");
		
		$("#contentList ul").hide();
		
		var href = a.attr("href").split("-")[0];
		var ul = $("#contentList a[href='" + href + "']").next();
		ul.show();
		ul.find("ul").show();
	}
	else
	{
		$("#contentList li:first").addClass("selected");
	}
}