$(document).ready(function()
{
	$("#commentForm").compile(function(data)
	{
		var result = $.api.comment.insertComment(data);
		if(result.code == 1000)
		{
			refresh();
		}
		else
		{
			console.error(result);
		}
	});

	$("#deleteArticle").on("click", function()
	{
		var result = $.api.article.deleteArticle({boardId : $.query.boardId, seq : $.query.seq, isRemove : "Y"});
		if(result.code == 1000)
		{
			location.href = "/?pageIndex=" + $.query.pageIndex + "&tag=" + $.query.tag;
		}
		else {
			console.error(result);
		}
	});

	bindReplyComment();
});

function refresh()
{
	var result = $.api.comment.getCommentList({boardId : $.query.boardId, articleSeq : $.query.seq});
	if(result.code == 1000)
	{
		var html = $("#communityCommentTemplate").html();
		var template = Handlebars.compile(html);

		$("#commentList").html(template({commentList : result.data}));
		bindReplyComment();
	}
	else
	{
		console.error(result);
	}
}

function bindReplyComment()
{
	$("*[data-id='replyComment']").on("click", function()
	{
		var parent = $(this).parent().parent();
		if(parent.children("form").length > 0)
			return;

		var groupId = $(this).attr("data-groupid");
		var seq = $(this).attr("data-seq");

		var form = document.createElement("form");
		form.setAttribute("data-component", "form");
		$(form).html($("#commentWriteTemplate").html());

		parent.append(form);

		$(form).compile(function(data)
		{
			data.groupId = groupId;
			data.parentSeq = seq;

			var result = $.api.comment.insertComment(data);
			if(result.code == 1000)
			{
				refresh();
			}
			else
			{
				console.error(result);
			}
		});

		$(form).find("textarea").focus();
	});
}
