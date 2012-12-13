var fs = require("fs");
var LogMassage = require("./log-massage.js");

var logFilePath = "X:\\JRun4\\servers\\OEMLR_Sean\\cfusion.ear\\cfusion.war\\WEB-INF\\cfusion\\logs\\Dean.log";
var filterRange = [
	new Date("12/03/12").getTime(),
	new Date("12/04/12").getTime()
];


fs.readFile(logFilePath, function(e, data){

	var lm = new LogMassage(data)
		.toDate(2, 3)
		.removeRowCells(1, 4)
		.filterBetween(
			new Date("12/03/12").getTime(),
			new Date("12/04/12").getTime(),
			2
		);

	console.log(lm);

});
