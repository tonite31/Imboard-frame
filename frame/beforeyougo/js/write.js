var savedSeq = null;
var selectedBoardId = null;
$(document).ready(function()
{
	savedSeq = $.query.seq;
	
	CKEDITOR.replace("ckeditor", { height: 500 });
	
	if($.query.boardId)
	{
		$("#boardName").text($("#boardList a[data-value='" + $.query.boardId + "']").text());
		selectedBoardId = $.query.boardId;
	}
	
	$("#boardList a").on("click", function()
	{
		$("#boardList a").removeAttr("data-name");
		$(this).attr("data-name", "boardId");
		
		$(".dropdown-toggle").html($(this).text() + ' <span class="caret"></span>');
	});
	
	$("#boardList a").on("click", function()
	{
		selectedBoardId = $(this).attr("data-value");
	});
	
	$("#writeForm").compile(function(param)
	{
		if($("#uploadImage").isProcessing() || $("#uploadYoutube").isProcessing())
		{
			alert("업로드 중입니다. 잠시 후 다시 시도해주세요.");
		}
		else
		{
			var body = CKEDITOR.instances.ckeditor.document.$.body;
			var firstImg = $(body).find("img:first");
			
			if(firstImg.length > 0)
			{
				var urls = firstImg.attr('src');
				param.thumbnailUrl = urls;
			}
			
			if(!param.thumbnailUrl)
				param.thumbnailUrl = $(body).find("iframe[data-thumbnail-url]:first").attr("data-thumbnail-url");
			
			if(!selectedBoardId)
			{
				$("#boardIdSelect").makeValidationMessage("게시판을 선택해주세요");
				return;
			}
			
			param.boardId = selectedBoardId;
			param.content = CKEDITOR.instances.ckeditor.getData();
			
			$("#tag-area span").each(function()
			{
				param.tag += $(this).text() + " ";
			});
			
			if(savedSeq != null)
			{
				param.seq = savedSeq;
				result = $.api.article.updateArticle(param);
			}
			else
			{
				result = $.api.article.writeArticle(param);
			}
			
			if(result != null)
			{
				if(result.code == -9998)
				{
					alert("글쓰기 권한이 없습니다");
				}
				else
				{
					var body = "";
					if($.query.boardId == "live" || $.query.boardId == "photo")
						body = "gallery";
					else if($.query.boardId == "training")
						body = "training";
					else if($.query.boardId == "qna")
						body = "qna";
					
					location.href = "?fragment=list&boardId=" + $.query.boardId;
				}
			}
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
	
	$("#tag-area span").on("click", function()
	{
		$(this).remove();
	});
	
	$("#uploadImage").compile(function(e)
	{
		var attachImageData = new FormData();
		
		var files = e.target.files;
		
		var length = files.length;
		for(var i=0; i<length; i++)
		{
			attachImageData.append("file-" + new Date().getTime() + "-" + i, files[i]);
		}

		var param = {
			data : 	attachImageData,
			success : function(result)
			{
				if(result.code != 1000)
				{
					alert("파일업로드 에러 발생");
				}
				else
				{
					result = result.data;
					for(var i=0; i<result.length; i++)
					{
						var src = result[i];
						
						var img = document.createElement("img");
						img.src = src.replace(".gif", ".png");
						CKEDITOR.instances.ckeditor.insertHtml(img.outerHTML);
					}
				}
			},
			error : function(result)
			{
				alert("파일업로드 에러 : " + result);
			}
		};

		var result = $.api.article.uploadFile(param);
		console.log(result);
	});
	
	$("#uploadYoutube").on("click", function()
	{
		var text = prompt("URL을 입력해주세요");
		if(text)
		{
			var v = text.replace(/http[s]?:\/\/youtu.be\//gi, "").replace(/http[s]?:\/\/www.youtube.com\/watch\?v=/gi, "");
			var html = "<iframe data-focus='true' style='width:640px; height:360px;' data-thumbnail-url='http://img.youtube.com/vi/" + v + "/mqdefault.jpg' src='//www.youtube.com/embed/" + v + "' frameborder='0' allowfullscreen></iframe>";
			CKEDITOR.instances.ckeditor.insertHtml(html);
		}
	});
});

function addTag()
{
	var tag = $("#tag").val();
	$("#tag-area p:first").append("<span class='label label-primary'>" + tag + "</span>");
	$("#tag-area span:last").on("click", function(){
		$(this).remove();
	})
	$("#tag").val("");
}