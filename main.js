var fs = require("fs");
var LogMassage = require("./log-massage.js");

var logFilePath = "X:\\JRun4\\servers\\OEMLR_Sean\\cfusion.ear\\cfusion.war\\WEB-INF\\cfusion\\logs\\Dean.log";


fs.readFile(logFilePath, function(e, data){

	var count = 0;
	var lm = new LogMassage(data)
		.toDate(2, 3)
		.removeRowCells(1, 4)
		.filterBetween(
			new Date("12/03/12"),
			new Date("12/04/12"),
			2
		)
		.eachRow(function(rowIndex, row){
			count++;
			return true;
		});

	//console.log(lm);
	console.log(count);

});
