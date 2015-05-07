var savedSeq;

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
		var article = $.api.article.getArticle({boardId : "teacher", seq : savedSeq});
		if(article.code == 1000)
		{
			article = article.data;
			$("#teacher-name").val(article.subject);
			CKEDITOR.on('instanceReady', function(e)
			{
				CKEDITOR.instances.ckeditor.insertHtml(article.content);
			});
			
			if(article.thumbnailUrl)
			{
				$("#image-upload-area").append("<img style='z-index:1;' data-thumbnail-url='" + article.thumbnailUrl + "' src='" + article.thumbnailUrl + "'/>");
				$("#image-upload-area label").remove();
			}
		}
	}
	
	$("#btn-register").on("click", function()
	{
		if($("#image-upload-area").isProcessing())
		{
			alert("이미지 업로드 중입니다");
			return;
		}
		
		var param = {};
		param.subject = $("#teacher-name").val();
		param.boardId = "teacher";
		param.content = CKEDITOR.instances.ckeditor.getData();
		param.thumbnailUrl = $("#image-upload-area img").attr("data-thumbnail-url");
		
		if(param != null)
		{
			if(param.subject == "")
			{
				alert("이름을 입력하세요");
				return;
			}
			
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
					location.href = "?piece=teacher";
				}
			}
		}
		else
		{
			alert("썸네일 이미지를 가져오는 도중 오류가 발생했습니다");
		}
	});
});