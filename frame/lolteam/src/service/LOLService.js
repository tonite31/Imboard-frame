module.exports.test =
{
	cron : "1 * * * * *",
	callback : function()
	{
		console.log("5초마다 발동이 된다");
	}
}

//module.exports.test1 =
//{
//	second : "2",
//	callback : function()
//	{
//		console.log("10초마다 발동이 된다");
//	}
//}
//
//module.exports.test2 =
//{
//	second : "15",
//	minute : "1",
//	callback : function()
//	{
//		console.log("1분 15초마다 발동이 된다");
//	}
//}