$(document).ready(function()
{
	$("#profileForm").compile(function(data)
	{
		var result = $.api.user.updateUser(data);
		if(result.code == 1000)
		{
			$("#nickname").text(data.displayId);
		}
	});
});