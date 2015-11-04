var currentPage = 1;
var cardPosition = [0, 0, 0];

$(document).ready(function()
{
	allocateCard($(".card"), 0);
	
	$(window).on("scroll", function(e)
	{
		if($(window).scrollTop() + $(window).height() == $(document).height())
		{
			var result = $.api.article.getArticleList({boardId : $.query.boardId, searchData : {startIndex : (10*currentPage+1), endIndex : (10*(currentPage+1))}});
			if(result.code == 1000 && result.data.length > 0)
			{
				var template = Handlebars.compile($("#articleListTemplate").html());
				
				var div = document.createElement("div");
				$("#articleList").append(template({articleList : result.data}));
				
				allocateCard($(".card"), currentPage*10);
				
				currentPage++;
			}
		}
	});
});

function allocateCard(cardList, i)
{
	if(i >= cardList.length)
	{
		return;
	}
	
//	var index = i % cardPosition.length;
	
	var index = getMinIndex();
	
	var card = cardList[i];
	
	//셋중 가장 높이가 낮은아이를 찾아서.
	
	var top = cardPosition[index] + 30;
	
	var width = new Number($(card).css("width").replace("px", ""));
	
	var left = (10 + width) * index;
	
//	var prev = $(card).prev();
	
//	var left = 10;
//	if(index > 0 && i > 0)
//		left += new Number($(prev).css("left").replace("px", "")) + new Number($(prev).css("width").replace("px", ""));
	
	$(card).css("position", "absolute").css("left", left + "px").css("top", top + "px").css("display", "block");
	
	setTimeout(function()
	{
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
	}, 10);
}

function getMinIndex()
{
	var min = 0;
	for(var i=1; i<cardPosition.length; i++)
	{
		if(cardPosition[min] > cardPosition[i])
			min = i;
	}
	
	return min;
}