var savedSeq = null;

$(document).ready(function()
{
	if($.global.query.boardId == "qna")
		$("#isNotice").get(0).checked = true;
	
	CKEDITOR.on('instanceReady', function(e)
	{
		var style = document.createElement("style");
		style.innerText = "p{margin:0;}";
		CKEDITOR.instances.ckeditor.containerBody.parentElement.childNodes[0].appendChild(style);
	});
	
	if($.global.query.seq != null)
	{
		savedSeq = $.global.query.seq;
		var article = $.api.article.getArticle({boardId : $.global.query.boardId, seq : savedSeq});
		if(article.code == 1000)
		{
			article = article.data;
			$("#subject").val(article.subject);
			$("#tag").val(article.tag);
			$("#isNotice").get(0).checked = (article.isNotice == "Y");
			CKEDITOR.on('instanceReady', function(e)
			{
				CKEDITOR.instances.ckeditor.insertHtml(article.content);
			});
		}
	}
			
	$("#form").compile(function(param)
	{
		if($("#uploadImage").isProcessing() || $("#uploadYoutube").isProcessing())
		{
			alert("업로드 중입니다");
		}
		else
		{
			var urls = CKEDITOR.instances.ckeditor.getThumbnailUrls();
			
			if(urls != null && urls.length > 0)
				param.thumbnailUrl = urls[0];
			
			param.boardId = $.global.query.boardId;
			param.content = CKEDITOR.instances.ckeditor.getData();
			
			console.log(param);
			
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
					alert("글쓰기 권한이 없습니다");
				}
				else
				{
					if(savedSeq != null)
						location.href = "?piece=" + ($.global.query.menu ? $.global.query.menu : $.global.query.boardId) + "&boardId=" + $.global.query.boardId + "&seq=" + savedSeq;
					else
						location.href = "?piece=" + ($.global.query.menu ? $.global.query.menu : $.global.query.boardId) + "&boardId=" + $.global.query.boardId;
				}
			}
		}
	});
});