$(document).ready(function()
{
	if($.query.fragment)
	{
		$(".nav-tabs li").removeAttr("class");
		$(".nav-tabs li a[href='?fragment=list&boardId=" + $.query.boardId + "']").parent().attr("class", "active");
	}
});