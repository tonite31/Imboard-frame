$(document).ready(function()
{
	if($.query.fragment)
	{
		$(".nav-tabs li").removeAttr("class");
		$(".nav-tabs li a[href='" + location.search + "']").parent().attr("class", "active");
	}
});