var fs = require("fs");
var LogMassage = require("./log-massage.js");

var logFilePath = "mylog.log";


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

	console.log(lm);
	console.log(count);

});
