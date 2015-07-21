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
});