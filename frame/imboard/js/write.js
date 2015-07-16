$(document).ready(function()
{
	if($.query.boardId && $.query.seq)
	{
		var result = $.api.article.getArticle({boardId : $.query.boardId, seq : $.query.seq});
		if(result.code == 1000)
		{
			var html = $("#writeForm").html();
			var template = Handlebars.compile(html);
			$("#writeForm").html(template(result.data));
		}
	}
	
	TypeWriter.compile({selector : "#typewriter"});
	$("#writeForm").compile(function(data)
	{
		var param = TypeWriter.instances.typewriter.getData();
		
		data.boardId = $.query.boardId;
		data.content = param.content;
	});
});