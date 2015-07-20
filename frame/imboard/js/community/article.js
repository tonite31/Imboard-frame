$(document).ready(function()
{
	$("#commentForm").compile(function(data)
	{
		var result = $.api.comment.writeComment(data);
		if(result.code == 1000)
		{
			refresh();
		}
		else
		{
			console.error(result);
		}
	});
});

function refresh()
{
	var result = $.api.comment.getCommentList({boardId : $.query.boardId, articleSeq : $.query.seq});
	if(result.code == 1000)
	{
		var html = $("#communityCommentTemplate").html();
		var template = Handlebars.compile(html);
		
		$("#commentList").html(template({commentList : result.data}));
	}
	else
	{
		console.error(result);
	}
}