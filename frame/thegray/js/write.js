$(document).ready(function()
{
	TypeWriter.compile({selector : "#typewriter"});
	
	if($.query.boardId)
	{
		var target = $("#boardList a[data-value='" + $.query.boardId + "']");
		if(target.length > 0)
		{
			target.attr("data-name", "boardId");
			$(".dropdown-toggle").html($(target).text() + ' <span class="caret"></span>');
		}
	}
	
	$("#boardList a").on("click", function()
	{
		$("#boardList a").removeAttr("data-name");
		$(this).attr("data-name", "boardId");
		
		$(".dropdown-toggle").html($(this).text() + ' <span class="caret"></span>');
	});

	$("#writeForm").compile(function(data)
	{
		if(!data.boardId)
		{
			$("#boardIdSelect").makeValidationMessage("게시판을 선택하세요.");
			return;
		}
		
		data.content = TypeWriter.instances.typewriter.getData().content;

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
