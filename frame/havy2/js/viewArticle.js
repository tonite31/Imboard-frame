$(document).ready(function()
{
	$("#deleteArticle").on("click", function()
	{
		if(confirm("정말 삭제하시겠습니까?"))
		{
			var result = $.api.article.deleteArticle({boardId : $.query.boardId, seq : $.query.seq, isRemove : "Y"});
			if(result.code == 1000)
			{
				location.href = $("#viewList").attr("href");
			}
			else
			{
				console.error(result);
			}
		}
	});
});