$(document).ready(function()
{
	$("#hiddenFile").on("change", function(e)
	{
		var attachImageData = new FormData();
		
		var files = e.target.files;
		var length = files.length;
		for(var i=0; i<length; i++)
			attachImageData.append("file-" + new Date().getTime() + "-" + i, files[i]);
		
		var param = {
			data : 	attachImageData,
			success : function(result)
			{
				if(result.code != 1000)
				{
					alert("파일업로드 에러 발생");
				}
				else
				{
					result = result.data;
					for(var i=0; i<result.length; i++)
					{
						$(".profileImageContainer").html("<img src='" + result[i].replace("gif", "png") + "' style='width: 100%;'/>");
					}
				}
			},
			error : function(result)
			{
				alert("파일업로드 에러 : " + result);
			}
		};
		
		$.api.article.uploadFileToAWS(param);
	});
	
	$("#userProfileForm").compile(function(param)
	{
		param.profileImgUrl = $(".profileImageContainer img").attr("src");
		
		var user = $.api.user.getSignedUser();
		var result = $.api.user.getUser({displayId : param.displayId});
		if(result.code == 1000)
		{
			if(result.data && result.data.displayId != user.data.displayId)
			{
				$("#userProfileForm input[name='displayId']").css("outline", "1px dashed red");
				$("#displayIdResult").css("display", "block");
			}
			else
			{
				$("#userProfileForm input[name='displayId']").css("outline", "");
				$("#displayIdResult").hide();
				
				result = $.api.user.updateUser(param);
				if(result.code == 1000)
				{
					location.href = "?piece=book&username=" + result.data.displayId;
				}
			}
		}
	});
	
	$("#linkUrlImg").on("click", function()
	{
		$("#urlInput").css("transition", "all 0.5s").css("opacity", "1").css("width", "200px");
		$("#urlInput").focus();
	});
	
	$("#urlInput").on("keyup", function()
	{
		$(".profileImageContainer").html("<img src='" + $(this).val() + "' style='width: 100%;'/>");
	});
});