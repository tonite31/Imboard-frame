var _cardSystem = {};

(function()
{
	(function()
	{
		this.cardPosition = [];
		this.ccpl = 0;
		this.maxAnimationCount = 10;
		this.sideWidth = 250;
		this.containerPadding = 20;
		this.cardWidth = 400;

		this.resizeTimer = null;
		
	}).call(this);
	
	(function()
	{
		var that = this;
		$(window).on("resize", function()
		{
			if(that.resizeTimer)
			{
				clearTimeout(that.resizeTimer);
				that.resizeTimer = null;
			}
			
			this.resizeTimer = setTimeout(function()
			{
				var temp = parseInt((window.innerWidth - that.sideWidth - that.containerPadding*2) / that.cardWidth); // 한줄에 배치할 수 있는 카드 숫자.
				if(that.ccpl != temp)
				{
					that.refresh();
				}
			}, 500);
		});
	}).call(this);
	
	this.refresh = function()
	{
		this.cardPosition = [];
		this.ccpl = parseInt((window.innerWidth - this.sideWidth - this.containerPadding*2) / this.cardWidth);
		for(var i=0; i<this.ccpl; i++)
			this.cardPosition[i] = 0;
		
		this.arrange($(".card"), 0);
	};
	
	this.arrange = function(cardList, i)
	{
		if(i >= cardList.length)
		{
			return;
		}
		
		var index = this.getMinIndex();
		
		var card = cardList[i];
		
		var top = this.cardPosition[index];
		top += top == 0 ? this.containerPadding : 0;
		
		var width = new Number($(card).css("width").replace("px", ""));
		
		var left = (width) * index + this.containerPadding;
		
		$(card).css("position", "absolute").css("left", left + "px").css("top", top + "px").css("display", "block");
		
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
	if(!$.query.menu)
	{
		var menu = $(".menu li:first").get(0);
		
		var rect = menu.getBoundingClientRect();
		
		$(".menu-arrow").css("top", rect.top + 5 + "px");
	}
	
	_cardSystem.refresh();
});