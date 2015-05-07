$(document).ready(function()
{
	if($.global.query.piece)
	{
		$(".navbar-nav li").removeAttr("active");
		$(".navbar-nav li a[href='?piece=" + $.global.query.piece + "']").parent().addClass("active");
	}
});