var savedSeq = null;

var selectedResource = null;

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
						
						$(img).on("click load", function()
						{
							selectResource(this);
						});
						
						var node = getSelectedNode($("#editor").get(0));
						if(node.div)
							$(img).insertAfter(node.div);
						else
							$("#editor").append(img);
					}
				}
			},
			error : function(result)
			{
				alert("파일업로드 에러 : " + result);
			}
		};

		var result = $.api.article.uploadFile(param);
		console.log("결과 : ", result);
	});
	
	$("#uploadFile").compile(function(e)
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
						
						var a = document.createElement("a");
						a.href = src;
						a.innerText = src.substring(src.lastIndexOf("/"));
						
						if(node.div)
							$(a).insertAfter(node.div);
						else
							$("#editor").append(a);
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
			
			var iframe = document.createElement("iframe");
			iframe.outerHTML = "<iframe data-focus='true' style='width:640px; height:360px;' data-thumbnail-url='http://img.youtube.com/vi/" + v + "/mqdefault.jpg' src='//www.youtube.com/embed/" + v + "' frameborder='0' allowfullscreen></iframe>";
			
			$(iframe).on("click load", function(e)
			{
				selectResource(this);
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
			});
			
			$(iframe).on("blur", function()
			{
				selectResource(null);
			});
			
			if(node.div)
				$(iframe).insertAfter(node.div);
			else
				$("#editor").append(iframe);
//			CKEDITOR.instances.ckeditor.insertHtml(html);
		}
	});
	
	$("#uploadLink").on("click", function()
	{
		var text = prompt("URL을 입력해주세요");
		if(text)
		{
			var a = document.createElement("a");
			a.href = text;
			a.innerText = text;
			
			if(node.div)
				$(a).insertAfter(node.div);
			else
				$("#editor").append(a);
		}
	});
	
	$('[data-toggle="tooltip"]').tooltip();
	
	$("#editor").on("focus", function()
	{
		$("#editor").css("overflow", "none").css("height", "auto").css("min-height", "700px");

		setTimeout(function()
		{
			var node = document.getSelection().anchorNode;
			if(node && node.nodeName == "DIV")
			{
				$("body").animate({scrollTop : node.getBoundingClientRect().top});
			}
		}, 500);
	});
	
	$("#editor").on("blur", function(e)
	{
		if(e.relatedTarget && $(e.relatedTarget).parent().attr("id") != "toolbar")
			$("#editor").css("overflow", "").css("height", "").css("min-height", "");
	});
	
	var toolbarOffset = $("#toolbar").offset();
	var toolbarRect = $("#toolbar").getRect();
	
	$(window).on("scroll", function()
	{
		if(document.body.scrollTop > toolbarOffset.top)
		{
			$("#toolbar").css("position", "fixed").css("top", "0").css("left", toolbarOffset.left + "px").css("width", toolbarRect.width + "px");
		}
		else
		{
			$("#toolbar").css("position", "").css("top", "").css("left", "");
		}
	});
	
	setToolbar();
});

function setToolbar()
{
	$("#imageWidth").on("blur keyup", function()
	{
		var value = this.value;
		
		if(selectedResource)
		{
			selectedResource.style.width = value + "px";
			var style = getComputedStyle(selectedResource);
			$("#imageHeight").val(style.height.replace("px", ""));
		}
	});
	
	$("#imageHeight").on("keyup", function()
	{
		var value = this.value;
		
		if(selectedResource)
		{
			selectedResource.style.height = value + "px";
		}
	});
	
	$("button[data-tool-id]").each(function()
	{
		var id = $(this).attr("data-tool-id");
		
		$(this).on("click", function()
		{
			var selection = getSelectedNode($("#editor").get(0));
			console.log("셀렉숀 : ", selection);
			if(id == "bold")
			{
				var value = selection.node.nodeValue;
				
				var selectedText = value.substring(selection.startOffset, selection.endOffset);

				var html = value.substring(0, selection.startOffset) + "<span style='font-weight:bold;'>" + selectedText + "</span>" + value.substring(selection.endOffset);
				selection.div.innerHTML = html;
			}
		});
	});
}

function addTag()
{
	var tag = $("#tag").val();
	$("#tag-area p:first").append("<span class='label label-primary'>" + tag + "</span> ");
	$("#tag-area span:last").on("click", function(){
		$(this).remove();
	})
	$("#tag").val("");
}

function selectResource(el)
{
	selectedResource = el;
	
	if(el)
	{
		var style = getComputedStyle(el);
		
		$("#imageWidth").val(style.width.replace("px", ""));
		$("#imageHeight").val(style.height.replace("px", ""));
	}
	else
	{
		$("#imageWidth").val("");
		$("#imageHeight").val("");
	}
}

var getSelectedNode = function(editor)
{
	if(window.getSelection)
	{
		var selection = window.getSelection();
		if(selection.rangeCount > 0)
		{
			var range = selection.getRangeAt(0);
			var ancestor = range.commonAncestorContainer;
			if(!contains(editor, ancestor))
			{
				var div = document.createElement("div");
				if(editor.firstChild)
					editor.insertBefore(div, editor.firstChild);
				else
					editor.appendChild(div);
				
				return {div : div};
			}
			else
			{
				var ec = range.endContainer;
				
				var startOffset = range.startOffset;
				var endOffset = range.endOffset;
				
				var parent = ec;
				while((parent = parent.parentElement) && parent != editor && parent.nodeName != "DIV");
				
				if(parent == editor)
				{
					var div = document.createElement("div");
					editor.insertBefore(div, ec);
					div.appendChild(ec);
					
					return {div : div, node : ec, startOffset : startOffset, endOffset : endOffset};
				}
				else
				{
					return {div : parent, node : ec, startOffset : startOffset, endOffset : endOffset};
				}	
			}
		}
	}
};

var contains = function(a, b)
{
	var target = b;
	while((target = target.parentElement) && a != target);

	return target == a;
};

var setCaretPosition = function(node, index)
{
	var range = document.createRange();
	var sel = window.getSelection();
	range.setStart(node, index);
	range.collapse(true);
	sel.removeAllRanges();
	sel.addRange(range);
};