var savedSeq = null;

$(document).ready(function()
{
	if($.query.boardId == "qna")
		$("#isNotice").get(0).checked = true;
	
	CKEDITOR.replace("ckeditor", { height: 500 });
	
//	if($.query.seq != null)
//	{
//		savedSeq = $.query.seq;
//		var article = $.api.article.getArticle({boardId : $.query.boardId, seq : savedSeq});
//		if(article.code == 1000)
//		{
//			article = article.data;
//			$("#subject").val(article.subject);
//			$("#tag").val(article.tag);
//			$("#isNotice").get(0).checked = (article.isNotice == "Y");
//			CKEDITOR.on('instanceReady', function(e)
//			{
//				CKEDITOR.instances.ckeditor.insertHtml(article.content);
//			});
//		}
//	}
			
	$("#form").compile(function(param)
	{
		if($("#uploadImage").isProcessing() || $("#uploadYoutube").isProcessing())
		{
			alert("업로드 중입니다. 잠시 후 다시 시도해주세요.");
		}
		else
		{
			var body = CKEDITOR.instances.ckeditor.document.$.body;
			var firstImg = $(body).find("img:first");
			
			if(firstImg.length > 0)
			{
				var urls = firstImg.attr('src');
				param.thumbnailUrl = urls;
			}
			
			param.boardId = $.query.boardId;
			param.content = CKEDITOR.instances.ckeditor.getData();
			
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
					location.href = "?body=" + $.query.prevBody;
				}
			}
		}
	});
	
	$("#uploadImage").compile(function()
	{
		
	});
});