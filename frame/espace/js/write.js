var savedSeq = null;
$(document).ready(function()
{
	savedSeq = $.query.seq;
	
//	CKEDITOR.replace("ckeditor", { height: 500 });
	
	$("#writeForm").compile(function(param)
	{
		if($("#uploadImage").isProcessing() || $("#uploadYoutube").isProcessing())
		{
			alert("업로드 중입니다. 잠시 후 다시 시도해주세요.");
		}
		else
		{
			var firstImg = $("#editor").find("img:first");
			
			if(firstImg.length > 0)
			{
				var urls = firstImg.attr('src');
				param.thumbnailUrl = urls;
			}
			
			if(!param.thumbnailUrl)
				param.thumbnailUrl = $("#editor").find("iframe[data-thumbnail-url]:first").attr("data-thumbnail-url");
			
			param.boardId = $.query.boardId;
			param.content = $("#editor").html();
			
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
					if(savedSeq)
						location.href = "?menu=article&seq=" + $.query.seq;
					else
						location.href = "/";
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
	
	$("#tag").on("keydown", function(e)
	{
		if(e.keyCode == 32)
		{
			e.preventDefault();
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
						$("#editor").append(img.outerHTML);
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
			$("#editor").append(html);
//			CKEDITOR.instances.ckeditor.insertHtml(html);
		}
	});
	
	$("#editor").on("focus", function()
	{
		$("#editor").css("overflow", "none").css("height", "auto").css("min-height", "500px");

		setTimeout(function()
		{
			var node = document.getSelection().anchorNode;
			if(node.nodeName == "DIV")
			{
				$("body").animate({scrollTop : node.getBoundingClientRect().top});
			}
		}, 500);
	});
	
	$("#editor").on("blur", function()
	{
		$("#editor").css("overflow", "").css("height", "").css("min-height", "");
	});
});

function addTag()
{
	var tag = $("#tag").val();
	$("#tag-area p:first").append("<span class='label label-primary'>" + tag + "</span> ");
	$("#tag-area span:last").on("click", function(){
		$(this).remove();
	})
	$("#tag").val("");
}