var savedSeq = null;
$(document).ready(function()
{
	CKEDITOR.on('instanceReady', function(e)
	{
		var style = document.createElement("style");
		style.innerText = "p{margin:0;}";
		CKEDITOR.instances.ckeditor.containerBody.parentElement.childNodes[0].appendChild(style);
	});
	
	if($.global.query.seq != null)
	{
		savedSeq = $.global.query.seq;
		var article = $.api.article.__getArticle({boardId : "qna", seq : savedSeq});
		$("#subject").val(article.subject);
		$("#writerName").val(article.writerName);
		CKEDITOR.on('instanceReady', function(e)
		{
			CKEDITOR.instances.ckeditor.insertHtml(article.content);
		});
	}
	
	$("#form").compile(function(param)
	{
		param.boardId = "qna";
		param.content = CKEDITOR.instances.ckeditor.getData();
		var result = null;
		if(savedSeq != null)
		{
			param.seq = savedSeq;
			param.status = 0;
			result = $.api.article.updateArticle(param);
		}
		else
		{
			result = $.api.article.writeArticle(param);
		}
		
		if(result != null)
		{
			if(result.code == -9998)
			{
				alert("권한이 없습니다");
			}
			else
			{
				location.href = "?piece=qna";
			}
		}
	});
});