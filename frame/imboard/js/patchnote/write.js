$(document).ready(function()
{
	TypeWriter.compile({selector:"#content"});
	
	$("#patchnoteWriteForm").compile(function(data)
	{
		var content = TypeWriter.instances.content.getData().content;
		data.content = content;
		data.boardId = "patchnote";
		data.status = 1;
		
		var result = $.api.article.writeArticle(data);
		if(result.code == 1000)
		{
			location.href = "?fragment=patchnote";
		}
		else
		{
			console.error("작성 실패", result);
		}
	});
	
	var boardId = $.query.boardId;
	var seq = $.query.seq;
	if(boardId && seq)
	{
		var result = $.api.article.getArticle({boardId : boardId, seq : seq});
		if(result.code == 1000)
		{
			$("#patchnoteWriteForm").setData(result.data);
			TypeWriter.instances.content.setData(result.data.content);
		}
	}
});