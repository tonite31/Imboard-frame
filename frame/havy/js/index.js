$(document).ready(function()
{
	if($.global.query.piece || $.global.query.menu || $.global.query.boardId)
	{
		$(".menu-area .menu").removeClass("selected");
		var menu = $(".menu-area .menu[data-menuname='" + $.global.query.boardId + "']");
		if(menu.length > 0)
		{
			menu.addClass("selected");
		}
		else
		{
			$(".menu-area .menu[href='?piece=" + $.global.query.piece + "']").addClass("selected");
			$(".menu-area .menu[href='?piece=" + $.global.query.menu + "']").addClass("selected");
		}
	}
});