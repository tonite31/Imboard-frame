$(document).ready(function()
{
	if($.query.fragment)
	{
		$(".navbar-nav li").removeAttr("active");
		$(".navbar-nav li a[href^='?fragment=" + $.query.fragment + "']").parent().addClass("active");
	}

	setFooterPosition();
	$(window).scroll(function()
	{
		setFooterPosition();
	});
});

function setFooterPosition()
{
	var rect = $("footer").getRect();
	if(rect.bottom < $(window).height())
	{
		$("footer").css("position", "absolute").css("bottom", "0").css("left", "0").css("right", "0");
	}
}