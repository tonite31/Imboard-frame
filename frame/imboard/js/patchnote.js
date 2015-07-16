$(document).ready(function()
{
	$("#newPatchnote").on("click", function()
	{
		var html = $("#newArticleTemplate").html();
		var template = Handlebars.compile(html);
		$("#articleBody").prepend(template());
		
		TypeWriter.compile({selector:"#content"});
		
		$("#saveForm").compile(function(data)
		{
			var content = TypeWriter.instances.content.getData().content;
			data.content = content;
			data.boardId = "patchnote";
			data.status = 1;
			
			var result = $.api.article.writeArticle(data);
			if(result.code == 1000)
			{
				location.reload();
			}
			else
			{
				console.error("작성 실패", result);
			}
		});
	});
});