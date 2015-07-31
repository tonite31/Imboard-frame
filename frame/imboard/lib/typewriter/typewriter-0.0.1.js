TypeWriter = {};

(function($t)
{
	$t.setCaretPosition = function(node, index)
	{
		var range = document.createRange();
		var sel = window.getSelection();
		range.setStart(node, index);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
	};
	
	$t.clearSpan = function(divParent)
	{
		$(divParent).find("span").filter(function(){
			return !$(this).text();
		}).remove();
		
		for(var i=1; i<divParent.children.length; i++)
		{
			var prev = divParent.children[i-1];
			var current = divParent.children[i];
			
			var isEquals = false;
			if(prev.style.length == current.style.length)
			{
				for(var j=0; j<prev.style.length; j++)
				{
					if(prev.style[prev.style[j]] != current.style[prev.style[j]])
					{
						isEquals = false;
						break;
					}
					else
					{
						isEquals = true;
					}
				}
			}
			
			if(isEquals)
			{
				var position = -1;
				if(prev.hasCaret)
					position = prev.hasCaret;
				else if(current.hasCaret)
					position = prev.innerText.length + current.hasCaret;
				
				prev.innerText += current.innerText;
				current.parentElement.removeChild(current);

				if(position > -1)
					$t.setCaretPosition(prev.firstChild, position);
				
				i--;
			}
		}
		
		$(divParent).find("span").each(function(){this.hasCaret = null;});
	};
	
	$t.makeSpan = function(target, remainText, selectedText, style, isEnd)
	{
		if(target.parentElement.nodeName == "SPAN")
		{
			//분리
			if(!style.value)
			{
				if(target.parentElement.style.length > 1)
				{
					var span = document.createElement("span");
					span.style.cssText = target.parentElement.style.cssText;
					span.style[style.key] = style.value;
					span.innerText = selectedText;
					
					if(!isEnd)
					{
						var next = target.parentElement.nextSibling;
						if(next)
							target.parentElement.parentElement.insertBefore(span, next);
						else
							target.parentElement.parentElement.appendChild(span);
						
						target.parentElement.innerText = remainText;	
					}
					else
					{
						target.parentElement.parentElement.insertBefore(span, target.parentElement);
						target.parentElement.innerText = remainText;
						
						$t.setCaretPosition(span.firstChild, span.firstChild.length);
						span.hasCaret = span.firstChild.length;
					}
				}
				else
				{
					if(!isEnd)
					{
						var next = target.parentElement.nextSibling;
						if(next)
							target.parentElement.parentElement.insertBefore(document.createTextNode(selectedText), next);
						else
							target.parentElement.parentElement.appendChild(document.createTextNode(selectedText));
						
						target.parentElement.innerText = remainText;
					}
					else
					{
						var node = document.createTextNode(selectedText);
						target.parentElement.parentElement.insertBefore(node, target.parentElement);
						target.parentElement.innerText = remainText;
						
						$t.setCaretPosition(node, node.length);
					}
				}
			}
			else
			{
				var span = document.createElement("span");
				span.style.cssText = target.parentElement.style.cssText;
				span.style[style.key] = style.value;
				span.innerText = selectedText;
				
				if(!isEnd)
				{
					var next = target.parentElement.nextSibling;
					if(next)
						target.parentElement.parentElement.insertBefore(span, next);
					else
						target.parentElement.parentElement.appendChild(span);
					
					target.parentElement.innerText = remainText;
				}
				else
				{
					target.parentElement.parentElement.insertBefore(span, target.parentElement);
					target.parentElement.innerText = remainText;
					
					$t.setCaretPosition(span.firstChild, span.firstChild.length);
					span.hasCaret = span.firstChild.length;
				}
			}
		}
		else
		{
			var span = document.createElement("span");
			span.style[style.key] = style.value;
			span.innerText = selectedText;
			
			var node = null;
			
			if(!style.value)
				node = document.createTextNode(selectedText);
			else
				node = span;
			
			if(!isEnd)
			{
				var next = target.nextSibling;
				if(next)
					target.parentElement.insertBefore(node, next);
				else
					target.parentElement.appendChild(node);
				
				target.parentElement.insertBefore(document.createTextNode(remainText), node);
				
				target.parentElement.removeChild(target);
			}
			else
			{
				var remainNode = document.createTextNode(remainText);
				target.parentElement.insertBefore(node, target);
				target.parentElement.insertBefore(remainNode, target);
				target.parentElement.removeChild(target);
				
				if(node == span)
				{
					$t.setCaretPosition(node.firstChild, node.firstChild.length);
					node.hasCaret = node.firstChild.length;
				}
				else
				{
					$t.setCaretPosition(node, node.length);
				}
			}
		}
	};
	
	$t.controller = {};
	$t.controller["fontweight"] = function(editor)
	{
		$(this).on("click", function()
		{
			if (window.getSelection)
			{
				var selection = window.getSelection();
				var text = selection.toString();
				if(selection.rangeCount > 0)
				{
					var range = selection.getRangeAt(0);
					
					var ancestor = range.commonAncestorContainer; 
					var sc = range.startContainer;
					var ec = range.endContainer;
					
					//가장 먼저 sc ~ ec를 뽑아낸다.
					
					if(!$(editor).has(sc) || !$(editor).has(ec))
					{
						return;
					}
					
					if(ancestor.nodeName == "DIV" || ancestor.nodeName == "#text")
					{
						//한줄인경우
						if(sc == ec)
						{
							//같은경우
							var before = sc.nodeValue.substring(0, range.startOffset);
							var after = sc.nodeValue.substring(range.endOffset);
							
							if(sc.parentElement.nodeName == "SPAN") // SPAN 하위에 있는경우
							{
								var span = document.createElement("span");
								span.style.cssText = sc.parentElement.style.cssText;
								span.innerText = before;
								
								sc.parentElement.parentElement.insertBefore(span, sc.parentElement);
								
								if(sc.parentElement.style.fontWeight == "bold")
								{
									if(sc.parentElement.style.length > 1)
									{
										span = document.createElement("span");
										span.style.cssText = sc.parentElement.style.cssText;
										span.style.fontWeight = "";
										span.innerText = text;
										
										sc.parentElement.parentElement.insertBefore(span, sc.parentElement);
									}
									else
									{
										sc.parentElement.parentElement.insertBefore(document.createTextNode(text), sc.parentElement);
									}
								}
								else
								{
									span = document.createElement("span");
									span.style.cssText = sc.parentElement.style.cssText;
									span.style.fontWeight = "bold";
									span.innerText = text;
									
									sc.parentElement.parentElement.insertBefore(span, sc.parentElement);
								}
								
								span = document.createElement("span");
								span.style.cssText = sc.parentElement.style.cssText;
								span.innerText = after;
								
								sc.parentElement.parentElement.insertBefore(span, sc.parentElement);
								
								sc.parentElement.parentElement.removeChild(sc.parentElement);
							}
							else
							{
								sc.parentElement.insertBefore(document.createTextNode(before), sc);
								
								var span = document.createElement("span");
								span.style.fontWeight = "bold";
								span.innerText = text;
								
								sc.parentElement.insertBefore(span, sc);
								
								sc.parentElement.insertBefore(document.createTextNode(after), sc);
								
								sc.parentElement.removeChild(sc);
							}
						}
						else
						{
							var list = [sc];
							
							if(sc != ec)
							{
								var target = sc.parentElement != editor ? sc.parentElement.nextSibling : sc.nextSibling;
								while(target && target != ec && target != ec.parentElement)
								{
									list.push(target);
									target = target.nextSibilng;
								}
								
								list.push(ec);
							}

							var isBold = true;
							for(var i=0; i<list.length; i++)
							{
								if(list[i].nodeName == "#text" && list[i].parentElement.nodeName == "SPAN")
								{
									isBold = isBold && (list[i].parentElement.style.fontWeight == "bold");
								}
								else if(list[i].nodeName == "SPAN")
								{
									isBold = isBold && (list[i].style.fontWeight == "bold");
								}
								else
								{
									isBold = false;
									break;
								}
							}
							
							for(var i=0; i<list.length; i++)
							{
								if(list[i] == sc)
								{
									$t.makeSpan(sc, sc.nodeValue.substring(0, range.startOffset), sc.nodeValue.substring(range.startOffset), {key : "font-weight", value : (isBold ? "" : "bold")}, false);
								}
								else if(list[i] == ec)
								{
									$t.makeSpan(ec, ec.nodeValue.substring(range.endOffset), ec.nodeValue.substring(0, range.endOffset), {key : "font-weight", value : (isBold ? "" : "bold")}, true);
								}
								else
								{
									if(list[i].nodeName == "SPAN")
									{
										if(isBold)
										{
											if(list[i].style.length > 1)
												list[i].style.fontWeight = "";
											else
												list[i].parentElement.replaceChild(document.createTextNode(list[i].innerText), list[i]);
										}
										else
										{
											list[i].style.fontWeight = "bold";
										}
									}
									else
									{
										if(!isBold)
										{
											var span = document.createElement("span");
											span.style.fontWeight = "bold";
											span.innerText = list[i].innerText;
											
											list[i].parentElement.replaceChild(span, list[i]);
										}
									}
								}
							}
						}
						
						var divParent = ancestor;
						
						while(divParent.nodeName != "DIV")
						{
							divParent = divParent.parentElement;
							if(!divParent)
							{
								var div = document.createElement("div");
								div.innerHTML = editor.innerHTML;
								
								editor.innerHTML = "";
								editor.appendChild(div);
								
								divParent = div;
							}
						}
						
						$t.clearSpan(divParent);
					}
					else
					{
						//여러줄인경우
					}
					
//					
//					var before = sc.nodeValue.substring(0, range.startOffset);
//					var after = ec.nodeValue.substring(range.endOffset);
//					
//					console.log(ancestor);
//					if(ancestor.nodeName == "DIV") // 한줄선택 sc != ec sc와 ec사이에 뭔가 있을 수 있음.
//					{
//						var target = null;
//						if(sc.parentElement.nodeName == "SPAN")
//						{
//							target = sc.parentElement.nextSibling;
//							
//							if(sc.parentElement.style.fontWeight != "bold")
//							{
//								//before를 분리시켜야한다.
//								
//								var span = document.createElement("span");
//								span.style.cssText = sc.parentElement.style.cssText;
//								span.style.fontWeight = "bold";
//								span.innerText = sc.nodeValue.substring(range.startOffset);
//								
//								var next = sc.parentElement.nextSibling;
//								if(next)
//									sc.parentElement.parentElement.insertBefore(span, next);
//								else
//									sc.parentElement.appendChild(span);
//								
//								if(before)
//									sc.parentElement.innerText = before;
//								else
//									sc.parentElement.parentElement.removeChild(sc.parentElement);
//							}
//							else
//							{
//								//선택된 텍스트가 전부 span으로 쌓여있고 전부 볼드인경우 해제가 가능하다.
//							}
//						}
//						else
//						{
//							target = sc.nextSibling;
//							
//							var span = document.createElement("span");
//							span.style.fontWeight = "bold";
//							span.innerText = sc.nodeValue.substring(range.startOffset);
//							
//							sc.parentElement.insertBefore(document.createTextNode(before), sc);
//							sc.parentElement.insertBefore(span, sc);
//							sc.parentElement.removeChild(sc);
//						}
//						
//						while(target && target != ec && target != ec.parentElement)
//						{
//							if(target.nodeName == "#text")
//							{
//								var span = document.createElement("span");
//								span.style.fontWeight = "bold";
//								span.innerText = target.nodeValue;
//								
//								target.parentElement.insertBefore(span, target);
//								target.parentElement.removeChild(target);
//							}
//							else
//							{
//								//span인경우
//								target.style.fontWeight = "bold";
//							}
//							
//							target = target.nextSibling;
//						}
//						
//						if(ec.parentElement.nodeName == "SPAN")
//						{
//							if(ec.parentElement.style.fontWeight != "bold")
//							{
//								var span = document.createElement("span");
//								span.style.cssText = ec.parentElement.style.cssText;
//								span.style.fontWeight = "bold";
//								span.innerText = ec.nodeValue.substring(0, range.endOffset);
//								
//								var next = ec.parentElement.nextSibling;
//								if(next)
//									ec.parentElement.parentElement.insertBefore(span, next);
//								else
//									ec.parentElement.appendChild(span);
//								
//								if(after)
//									ec.parentElement.innerText = after;
//								else
//									ec.parentElement.parentElement.removeChild(ec.parentElement);
//							}
//						}
//						else
//						{
//							var span = document.createElement("span");
//							span.style.fontWeight = "bold";
//							span.innerText = ec.nodeValue.substring(0, range.endOffset);
//							
//							ec.parentElement.insertBefore(span, ec);
//							ec.parentElement.insertBefore(document.createTextNode(after), ec);
//							ec.parentElement.removeChild(ec);
//						}
//						
//						$t.clearSpan(ancestor);
//					}
//					else if(ancestor.nodeName == "#text") //텍스트만 선택한경우 sc와 ec가 같다.  한줄선택
//					{
//						var divParent = null;
//						
//						if(ancestor.parentElement.nodeName == "DIV")
//						{
//							divParent = ancestor.parentElement;
//							//폰트설정이 아무것도 안되어있는경우
//							//span으로 감싸서 볼드처리 하면 됨.
//							
//							if(before)
//								sc.parentElement.insertBefore(document.createTextNode(before), sc);
//							
//							var span = document.createElement("span");
//							span.style.fontWeight = "bold";
//							span.innerText = text;
//							
//							sc.parentElement.insertBefore(span, sc);
//							
//							if(after)
//								ec.parentElement.insertBefore(document.createTextNode(after), ec);
//							
//							if(ec && ec.parentElement)
//								ec.parentElement.removeChild(ec);
//							if(sc && sc.parentElement)
//								sc.parentElement.removeChild(sc);
//						}
//						else
//						{
//							divParent = ancestor.parentElement.parentElement;
//							
//							//무언가 폰트설정이 되어있는경우
//							var isBold = ancestor.parentElement.style.fontWeight == "bold";
//							if(before)
//							{
//								var span = document.createElement("span");
//								span.setAttribute("style", ancestor.parentElement.style.cssText);
//								span.innerText = before;
//								
//								sc.parentElement.parentElement.insertBefore(span, sc.parentElement);
//							}
//							
//							if(after)
//							{
//								var span = document.createElement("span");
//								span.setAttribute("style", ancestor.parentElement.style.cssText);
//								span.innerText = after;
//								
//								if(ancestor.parentElement.nextSibling)
//									ancestor.parentElement.parentElement.insertBefore(span, ancestor.parentElement.nextSibling);
//								else
//									ancestor.parentElement.parentElement.appendChild(span);
//							}
//							
//							ancestor.parentElement.style.fontWeight = isBold ? "" : "bold";
//							ancestor.parentElement.innerText = text;
//						}
//						
//						$t.clearSpan(divParent);
//					}
//					else
//					{
//						//여러줄 선택한경우
//					}
				}
			}
			else if (document.selection && document.selection.type != "Control")
			{
		        var text = document.selection.createRange().text;
		        console.log("하이텍스트 : ", text);
		    }
		});
	};
	
	$t.controller["fontItalic"] = function(instance)
	{
		var type = $(this).attr("data-controller");
		$(this).on("click", function()
		{
//			var node = instance.getSelectedNode();
//			if(node != null)
//				node = [node];
//			
//			var sel = window.getSelection();
//			if(sel.rangeCount > 0)
//			{
//				node = [];
//				var originText = sel.baseNode.nodeValue;
//				var range = sel.getRangeAt(0);
//				
//				var startContainer = range.startContainer;
//				var endContainer = range.endContainer;
//				
//				if(startContainer == endContainer)
//				{
//					//selection이 한줄인경우
//					var startIndex = sel.baseOffset;
//					var endIndex = sel.focusOffset;
//					if(startIndex > endIndex)
//					{
//						var t = endIndex;
//						endIndex = startIndex;
//						startIndex = t;
//					}
//					
//					var selectedText = originText.substring(startIndex, endIndex);
//					if(originText == selectedText)
//					{
//						node = [sel.baseNode];
//					}
//					else
//					{
//						var s = originText.substring(0, startIndex);
//						var e = originText.substring(endIndex);
//						
//						node = sel.baseNode.parentElement;
//						if(node.className == "typewriter-content")
//						{
//							s = "<div>" + s;
//							e = e + "</div>";
//						}
//						
//						node.innerHTML = s + "<span>" + selectedText + "</span>" + e;
//
//						node = [node.querySelector("span")];
//					}
//				}
//				else
//				{
//					var makeSpan = function(node, value, offset, dir)
//					{
//						var originText = value;
//						var selectedText = dir ? originText.substring(offset) : originText.substring(0, offset);
//						var s = dir ? originText.substring(0, offset) : originText.substring(offset);
//						var span = "<span>" + selectedText + "</span>";
//						
//						var parent = node.parentElement;
//						if(parent.className == "typewriter-content")
//						{
//							parent.removeChild(parent.firstChild);
//							var div = document.createElement("div");
//							div.innerHTML = dir ? s + span : span + s;
//							parent.insertBefore(div, parent.children[0]);
//						}
//						else
//						{
//							var parent = node.parentElement;
//							parent.innerHTML = dir ? s + span : span + s;
//						}
//					};
//					
//					var getSelectedNode = function(sel, dir)
//					{
//						var firstNode = dir ? sel.focusNode.parentElement : sel.baseNode.parentElement;
//						makeSpan(sel.baseNode, sel.baseNode.nodeValue, sel.baseOffset, dir);
//						makeSpan(sel.focusNode, sel.focusNode.nodeValue, sel.focusOffset, dir);
//						
//						var nodeList = [firstNode];
//						
//						var next = firstNode.previousElementSibling;
//						
//						while(next)
//						{
////							if(next == sel.focusNode.parentElement) // 마지막 노드
////							{
////								selectedText = dir ? sel.focusNode.nodeValue.substring(0, sel.focusOffset) : sel.focusNode.nodeValue.substring(sel.focusOffset);
////								
////								if(sel.focusNode.parentElement.innerText == selectedText)
////								{
////									nodeList.push(next);
////								}
////								else
////								{
////									var span = "<span>" + selectedText + "</span>";
////									var parent = sel.focusNode.parentElement;
////									parent.innerHTML = dir ? span + sel.focusNode.nodeValue.substring(sel.focusOffset) : sel.focusNode.nodeValue.substring(sel.focusOffset) + span;
////									nodeList.push(parent.querySelector("span"));
////								}
////								console.log("마지막 선택된 텍스트 : ", selectedText);
////								break;
////							}
////							else
////							{
////								nodeList.push(next);
////								console.log("중간 텍스트 : ", next.innerText);
////							}
//							
//							next = next.previousElementSibling;
//						}
//						
//						return nodeList;
//					};
//					//base가 시작이고 focus가 커서가 있는 노드임
//					if(sel.baseNode == startContainer)
//					{
//						//위에서 아래로 블럭지정
//						node = getSelectedNode(sel, true);
//					}
//					else if(sel.focusNode == startContainer)
//					{
//						//아래서 위로 블럭지정
//						node = getSelectedNode(sel, false);
//					}
//				}
//			}
//			
//			if(node && node.length > 0)
//			{
//				for(var i=0; i<node.length; i++)
//				{
//					if(node[i].className == "typewriter-contentplaceholder")
//						continue;
//					
//					if(node[i].className == "typewriter-content")
//					{
//						var text = node[i].firstChild.textContent;
//						node[i].innerHTML = "<div>" + text + "</div>";
//						node[i] = node[i].firstChild;
//					}
//					
//					if(type == "fontBold")
//					{
//						if(node[i].style.fontWeight)
//							node[i].style.fontWeight = "";
//						else
//							node[i].style.fontWeight = "bold";
//					}
//					else if(type == "fontItalic")
//					{
//						if(node[i].style.fontStyle)
//							node[i].style.fontStyle = "";
//						else
//							node[i].style.fontStyle = "italic";
//					}
//					
//					if(node[i].firstChild.nodeType == 3)
//						instance.setCaretPosition(node[i].firstChild, node[i].firstChild.length);
//					else
//						node[i].focus();
//				}
//			}
		});
	};
	
	$t.controller["alignLeft"] = $t.controller["alignCenter"] = $t.controller["alignRight"] = function(instance)
	{
		var el = instance.target;
		var options = instance.options;
		var type = $(this).attr("data-controller");
		
		$(this).on("click", function()
		{
			var node = instance.getFocusedElement();
			
			if(node)
			{
				if(node.className == "typewriter-contentplaceholder")
					return;
				
				if(node.className == "typewriter-content")
				{
					var text = node.firstChild.textContent;
					node.innerHTML = "<div>" + text + "</div>";
					node = node.firstChild;
				}
				
				if(type == "alignLeft")
					node.style.textAlign = "left";
				else if(type == "alignCenter")
					node.style.textAlign = "center";
				else if(type == "alignRight")
					node.style.textAlign = "right";
				
				if(node.firstChild.nodeType == 3)
					instance.setCaretPosition(node.firstChild, node.firstChild.length);
				else
					node.focus();
				
				if(node.children[0].refreshResizable)
					node.children[0].refreshResizable();
			}
		});
	};
	
	$t.controller["image"] = $t.controller["video"] = $t.controller["file"] = function(instance)
	{
		var el = instance.target;
		var options = instance.options;
		var target = $(el).find(".typewriter-content");
		var type = $(this).attr("data-controller");
		var style = $(this).attr("data-style");

		var position = $(this).css("position");
		if(position == "static")
			$(this).css("position", "relative");
		
		var file = document.createElement("input");
		file.type = "file";
		file.className = "typewriter-hiddenfile";
		file.setAttribute("tabindex", "-1");
		$(this).append(file);

		$(this)._on("click", function()
		{
			file.click();
		});
		
		$(file).on("change", function(e)
		{
			$(instance.target).find('[data-toggle="tooltip"]').tooltip("hide");
			instance.uploadFile(el, options, target, e.target.files);
		});
	};
	
	$t.controller["youtube"] = $t.controller["link"] = function(instance)
	{
		var el = instance.target;
		var options = instance.options;
		var target = $(el).find(".typewriter-content");
		var type = $(this).attr("data-controller");
		var style = $(this).attr("data-style");
		
		$(this).on("click", function()
		{
			var div = null;
			if(type == "youtube")
			{
				var text = prompt("유투브 URL을 입력하세요");
				if(text)
				{
					var v = text.replace(/http[s]?:\/\/youtu.be\//gi, "").replace(/http[s]?:\/\/www.youtube.com\/watch\?v=/gi, "");
					
					var styleHtml = "";
					if(style)
						styleHtml = "style='" + style + "'";
					else
						styleHtml = "style='width:640px; height:360px;'";
					
					var html = "<iframe data-focus='true' " + styleHtml + " data-thumbnail-url='http://img.youtube.com/vi/" + v + "/mqdefault.jpg' src='//www.youtube.com/embed/" + v + "' frameborder='0' allowfullscreen></iframe><br/>";

					div = document.createElement("div");
					div.innerHTML = html;
					$(target).find(".typewriter-contentplaceholder").remove();
				}
			}
			else if(type == "link")
			{
				var text = prompt("URL을 입력하세요");
				if(text)
				{
					div = document.createElement("div");
					div.innerHTML = "<a href='" + text + "' target='_blank' style='cursor:pointer;'>" + text + "</a>";
					$(target).find(".typewriter-contentplaceholder").remove();
				}
			}
			
			if(div)
			{
				var node = instance.getFocusedElement();
				if(!node)
				{
					$(target).append(div);
				}
				else
				{
					if(node)
					{
						if(node.nodeType == 3)
						{
							var parent = node.parentNode.className == "typewriter-content" ? node : node.parentNode;
							var next = parent.nextElementSibling;
							if(next)
								parent.parentElement.insertBefore(div, next);
							else
								parent.parentElement.appendChild(div);
						}
						else
						{
							$(target).append(div);
						}
					}
					else
					{
						$(target).append(div);
					}
				}
				
				if(type == "youtube")
					instance.setResizeController(div.children[0]);
				
				instance.setCaretPosition(div.childNodes[1], 0);
			}
//			TypeWriterPrompt.show("유투브 URL을 입력하세요", function(text)
//			{
//				var v = text.replace(/http[s]?:\/\/youtu.be\//gi, "").replace(/http[s]?:\/\/www.youtube.com\/watch\?v=/gi, "");
//				var html = "<iframe width='560' height='315' data-thumbnail-url='http://img.youtube.com/vi/" + v + "/mqdefault.jpg' src='//www.youtube.com/embed/" + v + "' frameborder='0' allowfullscreen></iframe><br/>";
//				console.log("얍");
//			});
		});
	};
	
	$t.getEditor = function(option)
	{
		if(!option)
			option = {};
		
		var editor = {};
		editor.typewriter = document.createElement("div");
		editor.typewriter.className = "typewriter";
		
		editor.controlPanel = document.createElement("div");
		editor.controlPanel.className = "typewriter-controlPanel";
		
		editor.contentArticle = document.createElement("div");
		editor.contentArticle.className = "typewriter-content";
		editor.contentArticle.setAttribute("contenteditable", "true");
		editor.contentArticle.innerHTML = "가나<span style='font-weight:bold;text-decoration:underline;'>다라마</span>바사";
		
		editor.typewriterProgress = document.createElement("div");
		editor.typewriterProgress.className = "typewriter-progress";
		
		editor.typewriter.appendChild(editor.controlPanel);
		editor.typewriter.appendChild(editor.contentArticle);
		editor.typewriter.appendChild(editor.typewriterProgress);
		
		if(!option.controller)
		{
			option.controller = [[{id : "fontweight", name : "B"}]];
		}
		
		for(var i=0; i<option.controller.length; i++)
		{
			var groupPanel = document.createElement("div");
			groupPanel.className = "typewriter-controlGroup";
			
			var group = option.controller[i];
			for(var j=0; j<group.length; j++)
			{
				var button = document.createElement("button");
				button.type = "button";
				button.setAttribute("data-toggle", "tooltip");
				button.setAttribute("data-placement", "bottom");
				button.setAttribute("title", "ALT + B");
				button.setAttribute("tabindex", "-1");
				
				button.innerHTML = "<span>" + group[i].name + "</span>";
				
				groupPanel.appendChild(button);
				
				$t.controller[group[i].id].call(button, editor.contentArticle);
			}
			
			editor.controlPanel.appendChild(groupPanel);
		}
		
		return editor;
	};
	
	$t.instances = {};
	$t.compile = function(options)
	{
		if(typeof options == "object")
		{
			var selector = options.selector;
			
			var target = document.querySelector(selector);
			if(target)
			{
				$t.instances[target.id] = new instance(target, options);
			}
			else
			{
				console.error(selector + " is not found");
			}
		}
		else
		{
			console.error("options is not an object");
		}
	};
	
	var instance = function(target, options)
	{
		this.target = target;
		this.options = options;
		this.keyState = {};
		
		this.init();
	};
	
	instance.prototype.getSelectedNode = function()
	{
		var sel = window.getSelection();
		if(sel.rangeCount > 0)
		{
			node = [];
			var originText = sel.baseNode.nodeValue;
			var range = sel.getRangeAt(0);

			var startContainer = range.startContainer;
			var endContainer = range.endContainer;
			var ancestor = range.commonAncestorContainer; // typewriter-content가 나오는경우는 여러줄. div 또는 text가 나오는경우는 한줄이다.
			//div 또는 text가 나온경우 한줄인데...
			if(ancestor.nodeName == "#text")
			{
				var value = startContainer.data;
				var selectedValue = value.substring(range.startOffset, range.endOffset);
				var parent = startContainer.parentElement;
				if(parent.className == "typewriter-content")
				{
					$(parent).prepend("<div>" + value.substring(0, range.startOffset) + "<span style='font-weight:bold;'>" + selectedValue + "</span>" + value.substring(range.endOffset) + "</div>");
					parent.removeChild(startContainer);
				}
				else
				{
					//div인 경우
					parent.innerHTML = value.substring(0, range.startOffset) + "<span style='font-weight:bold;'>" + selectedValue + "</span>" + value.substring(range.endOffset);
				}
			}
			else if(ancestor.localName == "div")
			{
				//text와 span이 섞여있는경우
				var childNodes = ancestor.childNodes;
				for(var i=0; i<childNodes.length; i++)
				{
					if(childNodes[i] == startContainer || childNodes[i] == startContainer.parentElement)
					{
						console.log("시작 : ", childNodes[i]);
					}
					else if(childNodes[i] == endContainer || childNodes[i] == endContainer.parentElement)
					{
						console.log("끝 : ", childNodes[i]);
						break;
					}
				}
			}
			
//			if(startContainer == endContainer || startContainer.nextElementSibling == endContainer.parentElement || startContainer.parentElement == endContainer.previousElement || startContainer.parentElement.nextElementSibling == endContainer.parentElement)
//			{
//				if(range.startOffset == range.endOffset)
//				{
//					//블럭지정이 안된경우
//					console.log("노블럭");
//				}
//				else
//				{
//					var value = startContainer.data;
//					var selectedValue = value.substring(range.startOffset, range.endOffset);
//					var parent = startContainer.parentElement;
//					if(parent.className == "typewriter-content")
//					{
//						$(parent).prepend("<div>" + value.substring(0, range.startOffset) + "<span style='font-weight:bold;'>" + selectedValue + "</span>" + value.substring(range.endOffset) + "</div>");
//						parent.removeChild(startContainer);
//					}
//				}
//			}
//			else
//				console.log("여러줄");
			
			console.log(range);
		}
	};
	
	instance.prototype.uploadFile = function(el, options, target, files)
	{
		$(".typewriter-progress").show();
		
		var focusedNode = this.getFocusedElement();
		
		var that = this;
		var attachImageData = new FormData();
		
		var typeList = [];
		var length = files.length;
		for(var i=0; i<length; i++)
		{
			typeList.push(files[i].type);
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
						
						var type = typeList[i];
						if(type.indexOf("image") != -1)
							type = "image";
						else if(type.indexOf("video") != -1)
							type = "video";
						else
							type = "file";
						
						var div = document.createElement("div");
						if(type == "image")
						{
							var html = "<img data-thumbnail-url='" + src.replace(".gif", ".png") + "' src='" + src + "'/>";
							
							var img = document.createElement("img");
							img.src = src;
							img.onload = function(evt)
							{
					            var width = this.width;
					            var rect = $(that.target).find(".typewriter-content").getRect();
					            if(rect.width < width)
					            	this.style.width = "100%";
					            else
					            	this.style.width = width + "px";
					        };

							div.appendChild(img);
						}
						else if(type == "video")
						{
							var html = "<video width='320' height='240' controls><source src='" + src + "' type='video/mp4'>";
						}
						else if(type == "file")
						{
							var fileName = src.split("/");
							fileName = fileName[fileName.length-1];
							var html = "<a href='" + src + "' style='cursor:pointer;'>" + fileName + "</a>";
							div.innerHTML = html;
						}

						if(div)
						{
							div.appendChild(document.createTextNode(""));

							if(focusedNode)
								$(div).insertAfter(focusedNode);
							else
								$(that.target).find(".typewriter-content").append(div);
								
							targetNode = div;
							
							if(type != "file")
								that.setResizeController(div.children[0]);
							
							that.setCaretPosition(div.childNodes[1], 0);
						}
					}
					
					$(target).find(".typewriter-contentplaceholder").remove();
				}
				
				$(".typewriter-progress").hide();
			},
			error : function(result)
			{
				alert("파일업로드 에러 : " + result);
				$(".typewriter-progress").hide();
			}
		};

		if(options)
			options.upload(param);
		else
			console.error("upload function is undefiend");
	};
	
	instance.prototype.getFocusedElement = function()
	{
		var node = document.getSelection().anchorNode;
		if(node != null)
		{
			if(node.nodeType == 3)
				node = node.parentElement;
			
			if($(node).parents(".typewriter-content").length > 0)
				return node;
		}
		
		node = $(this.target).find(".typewriter-content > div:last").get(0);
		if(!node)
		{
			node = document.createElement("div");
			$(this.target).find(".typewriter-content").append(node);
		}
		
		return node;
	};
	
	instance.prototype.setCaretPosition = function(node, index)
	{
		if(node)
		{
			var range = document.createRange();
			var sel = window.getSelection();
			range.setStart(node, index);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);
		}
	};
	
	instance.prototype.init = function()
	{
		var that = this;
		this.editor = $t.getEditor();
		this.target.innerHTML = "";
		this.target.appendChild(this.editor.typewriter);
		
//		$(window).one("blur", function()
//		{
//			$(that.target).find('[data-toggle="tooltip"]').tooltip("hide");
//		});
//		
//		$(this.target).find('[data-toggle="tooltip"]').tooltip();
//		this.compile();
//		
//		if(this.options.data)
//			$(this.target).find(".typewriter-content").html(this.options.data);
//		
//		$(this.target).find(".typewriter-content").get(0).onkeydown = function(e)
//		{
//			$(this).children(".typewriter-contentplaceholder").remove();
//			this.onkeydown = null;
//		};
//		
//		$(this.target).find(".typewriter-content").on('dragover', function(e)
//		{
//			e.stopPropagation();
//		    e.preventDefault();
//		    e.originalEvent.dataTransfer.dropEffect = 'copy';
//		});
//		
//		$(this.target).find(".typewriter-content").on('drop', function(e)
//		{
//			e.stopPropagation();
//		    e.preventDefault();
//		    
//		    var el = that.target;
//			var options = that.options;
//			var target = $(el).find(".typewriter-content");
//		    
//		    var items = e.originalEvent.dataTransfer.items;
//		    if(items && items.length > 0)
//		    {
//		    	var item = items[0];
//				var div = document.createElement("div");
//				
//				var img = document.createElement("img");
//				img.src = url;
//				img.setAttribute("style", "width:100%;");
//
//				div.appendChild(img);
//				if(div)
//				{
//					div.appendChild(document.createTextNode(""));
//
//					var node = document.getSelection().anchorNode;
//					if(node)
//					{
//						if(node.nodeType == 3)
//						{
//							var parent = node.parentNode.className == "typewriter-content" ? node : node.parentNode;
//							var next = parent.nextElementSibling;
//							if(next)
//								parent.parentElement.insertBefore(div, next);
//							else
//								parent.parentElement.appendChild(div);
//						}
//						else
//						{
//							$(target).append(div);
//						}
//					}
//					else
//					{
//						$(target).append(div);
//					}
//					
//					that.setResizeController(div.children[0]);
//					that.setCaretPosition(div.childNodes[1], 0);
//				}
//		    }
//		    
//		    var files = e.originalEvent.dataTransfer.files; // FileList object.
//
//		    if(files && files.length > 0)
//		    {
//				that.uploadFile(el, options, target, files);
//		    }
//			
//			return false;
//		});
//		
//		$(this.target).find(".typewriter-content").on('paste', function(e)
//		{
//			console.log(e);
//		});
//		
//		$(this.target).find(".typewriter-content").on("click", function(e)
//		{
//			$(this).find(".typewriter-focus").removeAttr("class");
//			$(this).find(".typewriter-resizebar").remove();
//			$(this).find(".typewriter-relative").removeClass("typewriter-relative");
//			
//			var node = that.getFocusedElement();
//			var target = $(node).find("[data-focus='true']").get(0);
//			if(target != null)
//				that.setResizeController(target);
//		});
//		
//		$(this.target).find(".typewriter-content").on("keydown", function(e)
//		{
//			if(e.keyCode == 17)
//			{
//				that.keyState.ctrlPressed = true;
//			}
//			else if(e.keyCode == 16)
//			{
//				that.keyState.shiftPressed = true;
//			}
//			else if(e.keyCode == 18)
//			{
//				if(!that.keyState.altPressed)
//					$(that.target).find('[data-toggle="tooltip"]').tooltip("show");
//				that.keyState.altPressed = true;
//			}
//			else if(e.keyCode == 8 || e.keyCode == 13 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40)
//			{
//				$(this).find(".typewriter-focus").removeAttr("class");
//				$(this).find(".typewriter-resizebar").remove();
//				$(this).find(".typewriter-relative").removeClass("typewriter-relative");
//				$(that.target).find('[data-toggle="tooltip"]').tooltip("hide");
//			}
//			else if(e.keyCode == 188 || e.keyCode == 190)
//			{
//				if(that.keyState.altPressed)
//					e.preventDefault();
//			}
//			else
//			{
//				if(that.keyState.altPressed)
//				{
//					e.preventDefault();
//				}
//			}
//		});
//		
//		$(this.target).find(".typewriter-content").on("keyup", function(e)
//		{
//			if(e.keyCode == 17)
//			{
//				that.keyState.ctrlPressed = false;
//			}
//			else if(e.keyCode == 16)
//			{
//				that.keyState.shiftPressed = false;
//			}
//			else if(e.keyCode == 18)
//			{
//				that.keyState.altPressed = false;
//				$("body").find('[data-toggle="tooltip"]').tooltip("hide");
//				e.preventDefault();
//			}
//			else if(e.keyCode == 8 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40)
//			{
//				var node = that.getFocusedElement();
//				var img = $(node).find("img").get(0);
//				if(img)
//					that.setResizeController(img);
//			}
//			else if(e.keyCode == 188 || e.keyCode == 190) // < >
//			{
//				if(that.keyState.altPressed)
//				{
//					var offset = -1;
//					if(e.keyCode == 190)
//						offset = 1;
//					
//					var node = that.getFocusedElement();
//					var img = $(node).find("img").get(0);
//					if(img)
//					{
//						var width = img.style.width;
//						if(!width)
//							width = getComputedStyle(img).width;
//						
//						var postfix = "";
//						if(width.indexOf("%") != -1)
//						{
//							width = new Number(width.replace("%", ""));
//							postfix = "%";
//						}
//						else if(width.indexOf("px") != -1)
//						{
//							width = new Number(width.replace("px", ""));
//							postfix = "px";
//						}
//						
//						if(that.keyState.ctrlPressed)
//							width += offset;
//						else
//							width += offset * 10;
//						
//						img.style.width = width + postfix;
//						
//						var rect = img.getBoundingClientRect();
//						img.resizeBar.right.style.left = rect.width + "px";
//						img.resizeBar.right.style.height = rect.height + "px";
//						
//						$(img.resizeBar.right).tooltip("show");
//					}
//					
//					e.preventDefault();
//				}
//			}
//			else
//			{
//				if(that.keyState.altPressed)
//				{
//					if(e.keyCode == 66)
//					{
//						$("button[data-controller='fontBold']:first").click();
//					}
//					else if(e.keyCode == 73)
//					{
//						$("button[data-controller='fontItalic']:first").click();
//					}
//					else if(e.keyCode == 76)
//					{
//						$("button[data-controller='alignLeft']:first").click();
//					}
//					else if(e.keyCode == 67)
//					{
//						$("button[data-controller='alignCenter']:first").click();
//					}
//					else if(e.keyCode == 82)
//					{
//						$("button[data-controller='alignRight']:first").click();
//					}
//					else if(e.keyCode == 80)
//					{
//						$("button[data-controller='image']:first")._emit("click");
//						that.keyState.altPressed = false;
//						$('[data-toggle="tooltip"]').tooltip("hide");
//					}
//					else if(e.keyCode == 86)
//					{
//						$("button[data-controller='video']:first")._emit("click");
//						that.keyState.altPressed = false;
//						$('[data-toggle="tooltip"]').tooltip("hide");
//					}
//					else if(e.keyCode == 70)
//					{
//						$("button[data-controller='file']:first")._emit("click");
//						that.keyState.altPressed = false;
//						$('[data-toggle="tooltip"]').tooltip("hide");
//					}
//					else if(e.keyCode == 89)
//					{
//						$("button[data-controller='youtube']:first").click();
//						that.keyState.altPressed = false;
//						$('[data-toggle="tooltip"]').tooltip("hide");
//					}
//					else if(e.keyCode == 75)
//					{
//						$("button[data-controller='link']:first").click();
//						that.keyState.altPressed = false;
//						$('[data-toggle="tooltip"]').tooltip("hide");
//					}
//
//					e.preventDefault();
//				}
//			}
//		});
	};
	
	instance.prototype.setResizeController = function(node)
	{
		$(node).load(function(e)
		{
			var div = document.createElement("div");
			div.className = "typewriter-resizable";
			div.style.left = node.offsetLeft + "px";
			div.style.top = node.offsetTop + "px";
			div.style.width = e.target.width + "px";
			div.style.height = e.target.height + "px";
			div.setAttribute("contenteditable", "false");
			div.setAttribute("data-toggle", "tooltip");
			div.setAttribute("data-placement", "bottom");
			div.setAttribute("title", "오른쪽 모서리를 클릭하면 크기를 조절할 수 있습니다.");
			
			var rightBar = document.createElement("div");
			rightBar.className = "typewriter-right-resizebar";
			
			var bottomBar = document.createElement("div");
			bottomBar.className = "typewriter-bottom-resizebar";

			rightBar.onmousedown = function(e)
			{
				this.prevX = e.pageX;
				
				var rect = node.getBoundingClientRect();
				document.onmousemove = function(e)
				{
					//마우스의 x좌표에서 rect.left 를 하면 width가 나온다.
					var dx = (e.pageX - rect.left);
					var width = node.style.width;
					if(!width)
						width = getComputedStyle(node).width;
					
					var height = (dx * rect.height) / rect.width;

					node.style.width = dx + "px";
					node.style.height = height + "px";
					
					div.style.width = dx + "px";
					div.style.height = height + "px";
					
					$(div).tooltip("hide");
				};
				
				document.onmouseup = function(e)
				{
					document.onmousemove = null;
					document.onmouseup = null;
					
					$(div).tooltip("hide");
				};
			};
			
			div.appendChild(rightBar);
			div.appendChild(bottomBar);
			
			node.parentElement.appendChild(div);
			
			$(div).tooltip();
			node.resizable = div;
		});
		
		node.refreshResizable = function()
		{
			this.resizable.style.left = this.offsetLeft + "px";
		};
	};
	
	instance.prototype.setData = function(data)
	{
		$(this.target).find(".typewriter-content").html(data);
	};
	
	instance.prototype.getData = function()
	{
		var clone = $(this.target).find(".typewriter-content").clone(true);
		
		clone.find(".typewriter-contentplaceholder").remove();
		clone.find(".typewriter-resizable").remove();
		
		var content = clone.html();

		var thumbnailTarget = $(this.target).find(".typewriter-content *[data-thumbnail-url]:first").get(0);
		var thumbnailUrl = thumbnailTarget ? thumbnailTarget.getAttribute("data-thumbnail-url") : "";
		if(!thumbnailTarget)
		{
			thumbnailTarget = $(this.target).find(".typewriter-content img:first").get(0);
			thumbnailUrl = thumbnailTarget ? thumbnailTarget.getAttribute("src") : "";
		}
		
		//인젝션 대비.
		content = content.replace(/<script[^<]*<\/script>/gi, "").replace(/onmousedown[^"]*"[^"]*"/gi, "").replace(/onmouseup[^"]*"[^"]*"/gi, "");
		
		return {content : content, thumbnailTarget : thumbnailTarget, thumbnailUrl : thumbnailUrl};
	};
	
	instance.prototype.compile = function()
	{
		var that = this;
		$(this.target).find("*[data-controller]").each(function()
		{
			var type = $(this).attr("data-controller");
			if($t.controller.hasOwnProperty(type))
				$t.controller[type].call(this, that);
		});
	};
}(TypeWriter));

(function($) {
    $.fn.attrr = function(key)
    {
    	var value = $(this).attr(key);
    	$(this).removeAttr(key);
    	return value;
    };
    
    $.fn._on = function(key, callback)
    {
    	var el = this.get(0);
    	if(!el.event)
    		el.event = {};
    	
    	el.event[key] = callback;
    };
    
    $.fn._emit = function(key, param)
    {
    	var el = this.get(0);
    	if(el.event && el.event[key])
    		el.event[key].call(el, param);
    };
}(jQuery));