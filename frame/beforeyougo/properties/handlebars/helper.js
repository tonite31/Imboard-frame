try
{
	if(require)
		Handlebars = require("handlebars");
}
catch(err)
{

}

Handlebars.registerHelper("textThumbnail", function(content, token, count)
{
	var html = "";

	if(content)
	{
		content = content.replace(/<p>&nbsp;<\/p>/gi, "");
		var split = content.split(token);
		for(var i=0; i<count && i<split.length; i++)
		{
			html += split[i] + ((i == count-1 || i == split.length-1) && count < split.length ? "..." : "") + token;
		}
	}

	return html;
});

Handlebars.registerHelper("parseTag", function(tag)
{
	if(tag)
	{
		var split = tag.split(" ");
		var html = "";
		for(var i=0; i<split.length; i++)
		{
			html += "<span>#" + split[i] + "</span>";
		}

		return html;
	}
	else
	{
		return "";
	}
});
