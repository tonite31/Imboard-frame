$(document).ready(function()
{
	$("button[data-id]").on("click", function()
	{
		if(confirm("정말 삭제하시겠습니까?"))
		{
			var seq = $(this).attr("data-id");
			var result = $.api.article.deleteArticle({boardId : "teacher", seq : seq, isRemove : "Y"});
			if(result.code == 1000)
			{
				$(this).parent().parent().parent().parent().remove();
			}
			else
			{
				alert("권한이 없습니다");
			}
		}
	});
});