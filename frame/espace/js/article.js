$(document).ready(function()
{
	$("#commentForm").compile(function(data)
	{
		$("#commentForm input[name='writerName']").val("");
		$("#commentForm input[name='password']").val("");
		$("#commentForm textarea").val("");
		
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
	
	$("#commentList form[data-component='form']").compile(function(data)
	{
		data.boardId = $.query.boardId;
		data.articleSeq = $.query.seq;
		if(data.__roleType == "edit")
		{
			var result = $.api.comment.updateComment(data);
			if(result.code == 1000)
			{
				refresh();
			}
			else if(result.code == -9998)
			{
				$(this).find("input[type='password']").makeValidationMessage("비밀번호가 일치하지 않습니다");
			}
			else
			{
				console.error(result);
			}
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
	
	$("*[data-id='editComment']").on("click", function()
	{
		$(this).parent().parent().find("input[data-type='delete']").remove();
		if($(this).parent().parent().find("textarea").length > 0)
			return;
		
		var result = $.api.user.getSignedUser();
		if(result.code == 1000)
		{
			var password = "";
			if(!result.data.id)
				password = '<div class="input-group" style="margin-bottom: 5px;"><input data-type="edit" type="password" class="form-control" name="password" required="required" placeholder="비밀번호를 입력하세요" style="font-size:11px;"/></div>';
			
			var groupId = $(this).attr("data-groupid");
			var seq = $(this).attr("data-seq");
			
			var well = $(this).parent().parent().find(".well");
			$(password + '<div class="input-group" style="margin-bottom: 20px;"><input type="hidden" name="seq" value="' + seq + '"/><input type="hidden" name="groupId" value="' + groupId + '"/><textarea class="form-control" placeholder="덧글을 입력하세요" name="content">' + well.text() + '</textarea><span style="cursor: pointer;" class="input-group-addon">저장</span></div>').insertBefore(well);
			well.hide();
			
			var form = $(this).parent().parent();
			well.prev().prev().children("input").focus();
			well.prev().children("span").on("click", function()
			{
				form.get(0).submit("edit");
			});
		}
		else
		{
			console.error(result);
		}
	});
	
	$("*[data-id='deleteComment']").on("click", function()
	{
		var groupId = $(this).attr("data-groupid");
		var seq = $(this).attr("data-seq");
		
		var editPassword = $(this).parent().parent().find("input[data-type='edit']").get(0);
		if(editPassword)
			editPassword.parentElement.removeChild(editPassword);
		
		var result = $.api.user.getSignedUser();
		if(result.code == 1000 && result.data.id)
		{
			deleteArticle(groupId, seq, "");
		}
		else
		{
			if($(this).prev().attr("type") == "password")
			{
				var result = $(this).prev().get(0).checkValidity();
				if(!result)
				{
					$(this).prev().makeValidationMessage("비밀번호를 입력하세요");
					return;
				}
				
				if(deleteArticle(groupId, seq, $(this).prev().val()) == -9998)
				{
					$(this).prev().makeValidationMessage("비밀번호가 일치하지 않습니다.");
				}
			}
			else
			{
				$('<input type="password" data-type="delete" required="required" placeholder="비밀번호 입력 후 삭제 클릭" style="font-size:11px; margin:0 3px; padding:5px;"/>').insertBefore(this);
				$(this).prev().focus();
			}
		}
	});
}

function deleteArticle(groupId, seq, password)
{
	var data = {};
	data.boardId = $.query.boardId;
	data.articleSeq = $.query.seq;
	data.groupId = groupId;
	data.seq = seq;
	data.password = password;
	data.isRemove = "Y";
	
	var result = $.api.comment.deleteComment(data);
	if(result.code == 1000)
	{
		refresh();
		return true;
	}
	else if(result.code == -9998)
	{
		return -9998
	}
	else
	{
		console.error(result);
	}
}