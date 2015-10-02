$(document).ready(function()
{
	if($.query.fragment)
	{
		$(".nav-tabs li").removeAttr("class");
		$(".nav-tabs li a[href='?fragment=" + $.query.fragment + "']").parent().attr("class", "active");
	}
});