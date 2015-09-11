$(document).ready(function()
{
    $("#profile-container").css("width", $("#profile-container").get(0).offsetWidth + "px");
    $("#profile-container").compile();
    
    if($.query.boardId)
    {
    	$(".list-group-item.active").removeClass("active");
    	$(".list-group-item a[href='?boardId=" + $.query.boardId + "']").parent().addClass("active");
    }
});
