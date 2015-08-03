$(document).ready(function()
{
	$("#imageUploader").compile(function(e)
	{
		var files = e.target.files;
		var attachImageData = new FormData();
		var length = files.length;
		for(var i=0; i<length; i++)
		{
			if(files[i].type.indexOf("image") != -1)
				attachImageData.append("file-" + new Date().getTime() + "-" + i, files[i]);
			
			console.log(files[i].type);
		}
		
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
						var src = result[i];
						$("#imageUploader").append("<img style='width:100%;' src='" + src + "'/>");
					}
				}
			},
			error : function(result)
			{
				alert("파일업로드 에러 : " + result);
			}
		};
		
		$.api.article.uploadFile(param);
	});
});