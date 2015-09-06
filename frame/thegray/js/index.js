$(document).ready(function()
{
    $("#profile-container").css("width", $("#profile-container").get(0).offsetWidth + "px");
    $("#profile-container").compile();
    
    if($.query.tag)
    {
    	$(".list-group-item.active").removeClass("active");
    	$(".list-group-item a[href='?tag=" + $.query.tag + "']").parent().addClass("active");
    }
});
