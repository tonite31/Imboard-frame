$(document).ready(function()
{
	if(!$.query.boardId)
		location.href = "?fragment=community&boardId=forum";
	
	$(".list-group-item").removeClass("active");
	$("#" + $.query.boardId).addClass("active");
});