var savedSeq = null;

$(document).ready(function()
{
	if($.query.boardId == "qna")
		$("#isNotice").get(0).checked = true;
	
	CKEDITOR.replace("ckeditor", { height: 500 });
	
	savedSeq = $.query.seq;
	
//	if($.query.seq != null)
//	{
//		savedSeq = $.query.seq;
//		var article = $.api.article.getArticle({boardId : $.query.boardId, seq : savedSeq});
//		if(article.code == 1000)
//		{
//			article = article.data;
//			$("#subject").val(article.subject);
//			$("#tag").val(article.tag);
//			$("#isNotice").get(0).checked = (article.isNotice == "Y");
//			CKEDITOR.on('instanceReady', function(e)
//			{
//				CKEDITOR.instances.ckeditor.insertHtml(article.content);
//			});
//		}
//	}
			
	$("#form").compile(function(param)
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
			
			param.boardId = $.query.boardId;
			param.content = CKEDITOR.instances.ckeditor.getData();
			
			if(savedSeq != null)
			{
				param.seq = savedSeq;
				param.status = 0;
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
					location.href = "?body=" + $.query.prevBody + ($.query.boardId ? "&boardId=" + $.query.boardId);
				}
			}
		}
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
						img.src = src;
						CKEDITOR.instances.ckeditor.document.$.body.appendChild(img);
					}
					
//					for(var i=0; i<result.length; i++)
//					{
//						var src = result[i];
//						
//						var type = typeList[i];
//						if(type.indexOf("image") != -1)
//							type = "image";
//						else if(type.indexOf("video") != -1)
//							type = "video";
//						else
//							type = "file";
//						
//						var div = document.createElement("div");
//						if(type == "image")
//						{
//							var html = "<img data-thumbnail-url='" + src.replace(".gif", ".png") + "' src='" + src + "'/>";
//							
//							var img = document.createElement("img");
//							img.src = src;
//							img.onload = function(evt)
//							{
//					            var width = this.width;
//					            var rect = $(that.target).find(".typewriter-content").getRect();
//					            if(rect.width < width)
//					            	this.style.width = "100%";
//					            else
//					            	this.style.width = width + "px";
//					        };
//
//							div.appendChild(img);
//						}
//						else if(type == "video")
//						{
//							var html = "<video width='320' height='240' controls><source src='" + src + "' type='video/mp4'>";
//						}
//						else if(type == "file")
//						{
//							var fileName = src.split("/");
//							fileName = fileName[fileName.length-1];
//							var html = "<a href='" + src + "' style='cursor:pointer;'>" + fileName + "</a>";
//							div.innerHTML = html;
//						}
//
//						if(div)
//						{
//							div.appendChild(document.createTextNode(""));
//
//							if(focusedNode)
//								$(div).insertAfter(focusedNode);
//							else
//								$(that.target).find(".typewriter-content").append(div);
//								
//							targetNode = div;
//							
//							if(type != "file")
//								that.setResizeController(div.children[0]);
//							
//							that.setCaretPosition(div.childNodes[1], 0);
//						}
//					}
//					
//					$(target).find(".typewriter-contentplaceholder").remove();
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
});