$(document).ready(function()
{
	CKEDITOR.replace("ckeditor", {height: 400});

	$("#patchnoteWriteForm").compile(function(data)
	{
		var content = CKEDITOR.instances.ckeditor.getData();
		data.content = content;
		data.boardId = "patchnote";
		data.seq = $.query.seq;

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
});
