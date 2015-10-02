var TypeWriterModuleCallback = {};
var TypeWriterModules = {};
var TypeWriter = function(id)
{
	this.container = document.getElementById(id);
	if(!this.container)
	{
		console.error("에디터를 찾지 못했습니다.");
	}
};

(function()
{
	this.getSelection = function(editor)
	{
		if(window.getSelection)
		{
			var selection = window.getSelection();
			if(selection.rangeCount > 0)
			{
				var range = selection.getRangeAt(0);
				var ancestor = range.commonAncestorContainer;
				if(!this.contains(editor, ancestor))
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
					
					var offset = range.endOffset;
					
					var parent = ec;
					while((parent = parent.parentElement) && parent != editor && parent.nodeName != "DIV");
					
					if(parent == editor)
					{
						var div = document.createElement("div");
						editor.insertBefore(div, ec);
						div.appendChild(ec);
						
						return {div : div, node : ec, position : offset};
					}
					else
					{
						return {div : parent, node : ec, position : offset};
					}	
				}
			}
		}
	};
	
	this.contains = function(a, b)
	{
		var target = b;
		while((target = target.parentElement) && a != target);

		return target == a;
	};

	this.setCaretPosition = function(node, index)
	{
		var range = document.createRange();
		var sel = window.getSelection();
		range.setStart(node, index);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
	};
}).call(TypeWriter);

TypeWriter.prototype.init = function(options)
{
	if(!options)
		options = {};
	
	this.container.className = "typewriter-container";
	
	this.toolbar = document.createElement("div");
	this.toolbar.className = "typewriter-toolbar";
	
	this.editorContainer = document.createElement("div");
	this.editorContainer.className = "typewriter-editor-container";
	
	this.editor = document.createElement("div");
	this.editor.className = "typewriter-editor";
	this.editor.setAttribute("contenteditable", "true");
	
	if(options.hasOwnProperty("minHeight"))
		this.editor.style.minHeight = options.minHeight;
	
	this.editorContainer.appendChild(this.editor);

	this.container.appendChild(this.toolbar);
	this.container.appendChild(this.editorContainer);
	
	this.checkKey = [];
	
	this.editor.focus();
	
	this.makeToolbar();
	this.bindKeyEvent();
};

TypeWriter.prototype.makeToolbar = function()
{
	for(var key in TypeWriterModules)
	{
		var moduleGroup = TypeWriterModules[key];
		
		var group = document.createElement("div");
		group.className = "typewriter-module-group";
		group.innerHTML = "<span class='typewriter-module-group-title'>" + moduleGroup.name + "</span>";
		
		for(var i=0; i<moduleGroup.moduleList.length; i++)
		{
			var button = document.createElement("button");
			button.type = "button";
			button.innerText = moduleGroup.moduleList[i].name;
			
			button.addEventListener("click", moduleGroup.moduleList[i].callback.bind(this.editor));
			
			var f = function(keyset)
			{
				return function(e)
				{
					for(var key in keyset)
					{
						if(key == "keyCode")
						{
							if(keyset[key].toUpperCase() != String.fromCharCode(e[key]).toUpperCase())
								return false;
						}
						else if(keyset[key] != e[key])
						{
							return false;
						}
					}
					
					return true;
				};
			};
			
			this.checkKey.push({callback : moduleGroup.moduleList[i].callback, check : f(moduleGroup.moduleList[i].keyset)});
			group.appendChild(button);
		}
		
		this.toolbar.appendChild(group);
	}
};

TypeWriter.prototype.bindKeyEvent = function()
{
	var that = this;
	window.onkeydown = function(e)
	{
		if(e.ctrlKey || e.altKey || e.metaKey || e.shiftKey)
		{
			for(var i=0; i<that.checkKey.length; i++)
			{
				var result = that.checkKey[i].check(e);
				if(result)
				{
					console.log("콜콜");
					that.checkKey[i].callback.call(that.editor);
					e.stopPropagation();
					e.preventDefault();
					return false;
				}
			}
		}
	};
//	this.editor.onkeypress = function(e)
//	{
//		console.log(e);
//	};
};

TypeWriter.prototype.getHtml = function()
{
	return this.editor.innerHTML;
};

TypeWriter.prototype.getThumbnailUrl = function()
{
	
};