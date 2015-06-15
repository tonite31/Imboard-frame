$(document).ready(function()
{
	var signedUser = $.api.user.getSignedUser();
	console.log(signedUser);
	if(signedUser.data.id && !signedUser.data.displayId && $.query.piece != "profile")
		location.href = "?piece=profile";

	if(!$.query.piece)
	{
		if($.query.type)
			$(".menu-container a[href='/?type=" + $.query.type + "']").parent().addClass("active");
		else
			$(".menu-container a[href='/']").parent().addClass("active");
	}
	else
	{
		if($.query.piece == "book")
		{
			if($.query.username == signedUser.data.displayId)
			{
				$(".menu-container a[href='?piece=book&username=" + signedUser.data.displayId + "']").parent().addClass("active");
			}
		}
		else if($.query.piece == "bookList")
		{
			$(".menu-container a[href='?piece=bookList']").parent().addClass("active");
		}
		else if($.query.piece == "subscription")
		{
			$(".menu-container a[href='?piece=subscription']").parent().addClass("active");
		}
		else if($.query.piece == "clip")
		{
			$(".menu-container a[href='?piece=clip']").parent().addClass("active");
		}
	}
	
	$("#searchForm").compile(function(param)
	{
		var searchData = {};
		searchData[param.search] = param.searchValue;
		searchData.checkSigninUser = "N";

		var result = $.api.article.getArticleList({searchData : searchData});
		
		if(result.code == 1000)
		{
			$("#paperListBody").templating("articleTemplate", {articleList : result.data});
			cardInfo = [0, 0, 0, 0];
			allocateCard($(".card"), 0);
		}
	});
	
	$("img[data-id='profileImg']").error(function() { $(this).parent().html("<div class='noProfileImg'></div>"); });
	
	$(".tag").on("click", function()
	{
		var tag = $(this).text();
		$("#searchForm input[type='text']").val(tag);
		$("#searchForm input[type='checkbox']").each(function()
		{
			if(this.value == "tag")
				this.checked = true;
			else
				this.checked = false;
		});
		
		$("#search").click();
	});
	
	allocateCard($(".card"), 0);
});

var cardInfo = [0, 0, 0, 0];
function allocateCard(cardList, index)
{
	if(index >= cardList.length)
		return;
	
	var minIndex = 0;
	for(var i=1; i<cardInfo.length; i++)
	{
		if(cardInfo[minIndex] > cardInfo[i])
			minIndex = i;
	}
		
	$(cardList[index]).css("left", minIndex * 360 + "px").css("top", cardInfo[minIndex] + 10 + "px");

	var thumbnailImage = $(cardList[index]).find("article img");
	if(thumbnailImage.length > 0)
	{
		if(thumbnailImage.css("height") == "0px")
		{
			thumbnailImage.on("load", function()
			{
				cardInfo[minIndex] = cardInfo[minIndex] + 10 + new Number($(cardList[index]).css("height").replace("px", ""));
				allocateCard(cardList, index+1);
			});
		}
		else
		{
			cardInfo[minIndex] = cardInfo[minIndex] + 10 + new Number($(cardList[index]).css("height").replace("px", ""));
			allocateCard(cardList, index+1);
		}
	}
	else
	{
		cardInfo[minIndex] = cardInfo[minIndex] + 10 + new Number($(cardList[index]).css("height").replace("px", ""));
		allocateCard(cardList, index+1);
	}
}