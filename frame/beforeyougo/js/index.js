$(document).ready(function()
{
	console.log("머야 : ", $.query.fragment);
	if($.query.fragment)
	{
		$(".nav-tabs li").removeAttr("class");
		$(".nav-tabs li a[href='?fragment=" + $.query.fragment + "']").parent().attr("class", "active");
	}
});