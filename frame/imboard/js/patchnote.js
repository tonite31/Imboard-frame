$(document).ready(function()
{
	$("#articleBody form[data-component='form']").compile(function(data)
	{
		if(confirm("정말삭제하시겠습니까?"))
		{
			data.isRemove = "Y";
			var result = $.api.article.deleteArticle(data);
			if(result.code == 1000)
			{
				location.reload();
			}
			else
			{
				console.error(result);
			}
		}
	});
});
