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

function anchorScroll(href)
{
    href = typeof(href) == "string" ? href : $(this).attr("href");
    
    // You could easily calculate this dynamically if you prefer
    var fromTop = $(".nav-header").getRect().height;
    
    // If our Href points to a valid, non-empty anchor, and is on the same page (e.g. #foo)
    // Legacy jQuery and IE7 may have issues: http://stackoverflow.com/q/1593174
    if(href.indexOf("#") == 0) {
        var $target = $(href);
        
        // Older browser without pushState might flicker here, as they momentarily
        // jump to the wrong position (IE < 10)
        if($target.length) {
            $(window).scrollTop($target.offset().top - fromTop);
        }
    }
}

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
		else if(rect.top <= $(".nav-header").getRect().height)
		{
			if(!minTarget || minTarget.distance < rect.top)
			{
				minTarget = {distance : rect.top, element : this};
			}
		}
	});
	
	if(minTarget)
	{
		$("#contentList ul").hide();
		
		var a = $("#contentList li a[href='#" + $(minTarget.element).attr("id") + "']");
		a.parent().addClass("selected");
		a.parent().children("ul").show();
		
		var parent = a.parent();
		while(parent && parent.attr("id") != "contentList")
		{
			if(parent.get(0).nodeName == "UL")
				parent.show();
			
			parent = parent.parent();
		}
	}
	else
	{
		$("#contentList li:first").addClass("selected");
		$("#contentList li:first ul").show();
	}
}