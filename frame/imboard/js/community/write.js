$(document).ready(function()
{
	CKEDITOR.replace("ckeditor", {height: 400});

	$("#writeForm").compile(function(data)
	{
		data.boardId = $.query.boardId;
		data.content = CKEDITOR.instances.ckeditor.getData();

		var result = $.api.article.writeArticle(data);
		if(result.code == 1000)
		{
			location.href = "?fragment=qna&boardId=" + $.query.boardId;
		}
		else
		{
			console.error(result);
		}
	});

	//
	//
	// var options = {};
	// options.selector = "#typewriter";
	// options.upload = function(param)
	// {
	// 	$.api.article.uploadFileToAWS(param);
	// };
	//
	// TypeWriter.compile(options);
	// $("#writeForm").compile(function(data)
	// {
	// 	var param = TypeWriter.instances.typewriter.getData();
	//
	// 	data.boardId = $.query.boardId;
	// 	data.content = param.content;
	//
	// 	var result = $.api.article.writeArticle(data);
	// 	if(result.code == 1000)
	// 	{
	// 		location.href = "?fragment=community&boardId=" + $.query.boardId;
	// 	}
	// });
});
