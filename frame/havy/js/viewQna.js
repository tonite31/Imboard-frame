$(document).ready(function()
{
	var signedUser = $.api.user.getSignedUser();
	if(signedUser.code == 1000 && signedUser.data.level < 0)
	{
		$("#passwordConfirmArea").remove();
	}
	
	$("#passwordConfirmArea > form").compile(function(data)
	{
		var result = $.api.article.getArticle({boardId : "qna", seq : $.global.query.seq, password : data.password});
		if(result.code == 1000)
		{
			
		}
		else if(result.code == -9998)
		{
			alert("비밀번호가 일치하지 않습니다");
		}
		else
		{
			alert("게시글이 존재하지 않습니다");
		}
	});
	
	$("#writeComment").on("click", function()
	{
		var content = $("#commentContent").val();
		var result = $.api.comment.writeComment({boardId : "qna", articleSeq : $.global.query.seq, content : content});
		if(result.code == 1000)
		{
			var commentList = $.api.comment.getCommentList({boardId : "qna", articleSeq : $.global.query.seq});
			if(commentList.code == 1000)
			{
				var template = Handlebars.compile($("#qnaComment").html());
				$(".answer-area").html(template({commentList : commentList.data}));
				$("#commentContent").val("");
			}
			else
			{
				alert("답변 목록을 불러오는데 실패했습니다");
			}
		}
		else
		{
			alert("답변 작성 권한이 없습니다");
		}
	});
});