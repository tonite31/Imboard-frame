var articleSeq = null;
var fixedContainerRect = null;
var tipsRect = null;

$(document).ready(function()
{
	$("[data-toggle]").tooltip();
	
	var user = $.api.user.getSignedUser();
	
	var result = $.api.user.getUser({displayId : $.query.username});
	if(result.code == 1000 && (!result.data || result.data.displayId != $.query.username))
	{
		console.log(result);
		$("#body").html("<h2 style='text-align:center;'>존재하지 않는 북페이지 입니다.</h2>");
	}
	else
	{
		var result = $.api.article.getArticleListCount({searchData : {displayId : $.query.username}});
		var active = "";
		if(!$.query.boardId)
			active = " active";
		
		$(".list-group").prepend("<li class='list-group-item " + active + "'><a href='?piece=book&username=" + $.query.username + "'>전체 <span class='badge'>" + result.data + "</span></a></li>");

		if(user.code == 1000 && user.data.id && user.data.id == $.query.username)
		{
			result = $.api.article.getArticleListCount({searchData : {displayId : $.query.username, status : 0}});
			$(".list-group").append("<li class='list-group-item'><a href='?piece=book&username=" + $.query.username + "'>미발행 페이퍼 <span class='badge'>" + result.data + "</span></a></li>");
		}
		
		var userId = user.data.id;
		if(userId)
		{
			var result = $.api.menu.getMenu({id : userId});
			if(!result.data)
			{
				$.api.menu.insertMenu({id : userId, name : name});
			}
		}
		
		$("#profileImg").error(function() { $(".noProfileImg").show(); $(this).hide(); });
		
		$("a[data-id='publish']").on("click", function()
		{
			var boardId = $(this).attr("data-board-id");
			var seq = $(this).attr("data-seq");
			var result = $.api.article.updateStatus({boardId : boardId, seq : seq, status : 1});
			if(result.code == 1000)
			{
				$(this).parent().parent().parent().attr("class", "panel panel-primary");
				$(this).parent().parent().parent().find(".unpublished-paper").remove();
				$(this).parent().parent().parent().find(".boardName").attr("class", "label label-primary");
				$(this).remove();
			}
		});
		
		$("span[data-id='deletePaper']").on("click", function()
		{
			$(this.nextElementSibling).toggle();
		});
		
		$("span[data-id='deleteConfirm']").on("click", function()
		{	
			var boardId = $(this).attr("data-board-id");
			var seq = $(this).attr("data-seq");
			
			var result = $.api.article.deleteArticle({boardId : boardId, seq : seq, isRemove : "Y"});
			if(result.code == 1000)
			{
				$(this).parent().parent().parent().remove();
				if($(".paper").length <= 0)
				{
					location.reload();
				}
			}
			else
			{
				console.error("페이퍼삭제 실패 : ", result);
			}
		});
	}
});