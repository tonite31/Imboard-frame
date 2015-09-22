var cardPosition = [0, 0, 0];

$(document).ready(function()
{
	allocateCard($(".card"), 0);
});

function allocateCard(cardList, i)
{
	if(i >= cardList.length)
	{
		return;
	}
	
	var index = i % cardPosition.length;
	
	var card = cardList[i];
	var prev = $(card).prev();
	
	var left = 10;
	if(index > 0 && i > 0)
		left += new Number($(prev).css("left").replace("px", "")) + new Number($(prev).css("width").replace("px", ""));
	
	var top = cardPosition[index] + 30;
	
	$(card).css("position", "absolute").css("left", left + "px").css("top", top + "px").show();
	
	var img = $(card).find("img");
	if(img.length > 0 && img.css("height") == "0px")
	{
		img.on("load", function()
		{
			var height = $(card).css("height");
			cardPosition[index] = top + new Number(height.replace("px", ""));
			
			allocateCard(cardList, i + 1);
		});
	}
	else
	{
		var height = $(card).css("height");
		cardPosition[index] = top + new Number(height.replace("px", ""));
		allocateCard(cardList, i + 1);
	}
}