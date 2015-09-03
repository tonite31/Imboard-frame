$(document).ready(function()
{
	CKEDITOR.replace("ckeditor", {height: 400});

	$("#writeForm").compile(function(data)
	{
		data.boardId = "article";
		data.content = CKEDITOR.instances.ckeditor.getData();

		data.tag = "";

		$("#tag-area span.label-primary").each(function()
		{
			if(data.tag)
				data.tag += " ";
			data.tag += $(this).text();
		});

		var result = $.api.article.writeArticle(data);
		if(result.code == 1000)
		{
			location.href = "?" + ($.query.pageIndex ? "&pageIndex=" + $.query.pageIdex : "") + ($.query.tag ? "&tag=" + $.query.tag : "");
		}
		else
		{
			console.error(result);
		}
	});

	$("#addTag").on("click", addTag);
	$("#tag").on("keyup", function(e)
	{
		if(e.keyCode == 13)
		{
			addTag();
		}
	});
	
	$(".tag").on("click", function()
	{
		$(this).remove();
	});
});

function addTag()
{
	var tag = $("#tag").val();
	$("#tag-area p:first").append("<span class='tag label label-primary'>" + tag + "</span>");
	$("#tag-area .tag:last").on("click", function(){
		$(this).remove();
	})
	$("#tag").val("");
}
