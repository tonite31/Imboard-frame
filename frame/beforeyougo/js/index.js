var _cardSystem = {};
var page = 2;
var cpp = 10;

(function()
{
	(function()
	{
		this.cardPosition = [];
		this.ccpl = 0;
		this.cardWidth = 380;

		this.resizeTimer = null;
		
	}).call(this);
	
	(function()
	{
		var that = this;
		$(window).on("resize", function()
		{
			if(window.innerWidth >= 800)
			{
				if(that.resizeTimer)
				{
					clearTimeout(that.resizeTimer);
					that.resizeTimer = null;
				}
				
				this.resizeTimer = setTimeout(function()
				{
					var temp = parseInt((window.innerWidth) / that.cardWidth); // 한줄에 배치할 수 있는 카드 숫자.
					if(that.ccpl != temp)
					{
						that.refresh();
					}
				}, 500);
			}
		});
	}).call(this);
	
	this.refresh = function()
	{
		if(window.innerWidth >= 800)
		{
			this.cardPosition = [];
			this.ccpl = 3;
			for(var i=0; i<this.ccpl; i++)
				this.cardPosition[i] = 0;
			
			this.arrange($(".card"), 0);
		}
	};
	
	this.arrange = function(cardList, i)
	{
		if(i >= cardList.length)
		{
			return;
		}
		
		var index = this.getMinIndex();
		
		var card = cardList[i];
		
		var top = this.cardPosition[index] + 10;
		
		var width = new Number($(card).css("width").replace("px", ""));
		
		var left = (width + 10) * index - 10;
		
		$(card).css("left", left + "px").css("top", top + "px").css("display", "block");
		
		var that = this;
		setTimeout(function()
		{
			var img = $(card).find("img");
			if(img.length > 0 && img.css("height") == "0px")
			{
				img.on("load", function()
				{
					var height = $(card).css("height");
					that.cardPosition[index] = top + new Number(height.replace("px", ""));
					
					that.arrange(cardList, i + 1);
				});
			}
			else
			{
				var height = $(card).css("height");
				that.cardPosition[index] = top + new Number(height.replace("px", ""));
				that.arrange(cardList, i + 1);
			}
		}, 10);
	};
	
	this.getMinIndex = function()
	{
		var min = 0;
		for(var i=1; i<this.ccpl; i++)
		{
			if(this.cardPosition[min] > this.cardPosition[i])
				min = i;
		}
		
		return min;
	}
	
}).call(_cardSystem);

$(document).ready(function()
{
	if($.query.fragment)
	{
		$(".nav-tabs li").removeAttr("class");
		$(".nav-tabs li a[href='?boardId=" + $.query.boardId + "']").parent().attr("class", "active");
	}
	
	_cardSystem.refresh();
	
	$(window).on("scroll", function()
	{
		if($(window).scrollTop() + $(window).height() == $(document).height())
		{
			var result = $.api.article.getArticleList({boardId : $.query.boardId, searchData : {startIndex : (page-1) * cpp, endIndex : cpp, withContent : true}});
			if(result && result.code == 1000 && result.data.length > 0)
			{
				page++;
				var html = $("#articleListTemplate").html();
				var template = Handlebars.compile(html);
				
				$("#articleList").append(template({articleList : result.data}));
				_cardSystem.refresh();
			}
		}
	});
});