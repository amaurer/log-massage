

function LogMassage(){

	this.data = [];
	this.stringData = "";
	this.rowDelimiter = "\n";
	this.cellDelimiter = "\",\"";

	if(arguments.length !== 0){
		var constructorArgType = typeof arguments[0];
		if(constructorArgType === "object" && arguments[0] instanceof Buffer){
			constructorArgType = "buffer";
		};
		switch(constructorArgType){
			case "buffer" :
			case "string" :
				this.stringData = arguments[0].toString();
				this.toArrays(this.stringData);
			case "object" :
				/* Config */
				if(arguments[0].data != null) this.data = arguments[0].data;
				if(arguments[0].stringData != null) this.stringData = arguments[0].stringData;
				if(arguments[0].rowDelimiter != null) this.rowDelimiter = arguments[0].rowDelimiter;
				if(arguments[0].cellDelimiter != null) this.cellDelimiter = arguments[0].cellDelimiter;
		};
	};
};

LogMassage.prototype.toArrays = function(stringData){
	if(typeof stringData !== "string") return this;

	var i, ii, len, lenn, x, tmp;
	var logResults = [];
	var rows = stringData.toString().split(this.rowDelimiter);
	var cells = [];
	for (i = 1, len = rows.length; i<len; i++) {
		x = rows[i];
		if(x === "" || x.length === 0) continue;
		cells = x.split(this.cellDelimiter);
		tmp = [];
		for (ii = 0, lenn = cells.length; ii<lenn; ii++) {
			tmp.push(
				cells[ii].replace(/"/g, "").replace(/\r/g, "")
			);
		};
		logResults.push(tmp);
	};
	this.data = logResults;
	return this;
};

LogMassage.prototype.removeRow = function(rowNum){
	this.data = this.data.splice(rowNum, 1);
	return this;
};

LogMassage.prototype.removeRowCells = function(startCell, endCell){
	/* arguments are cells */
	var i, len;
	for (i = 1, len = this.data.length; i<len; i++) {
		this.removeCell.call(this, i, startCell, endCell);
	};
	return this;
};

LogMassage.prototype.removeCell = function(rowNum, startCell, endCell){
	/* Cant do this, cells change poisitions */
	this.data[rowNum].splice(startCell, endCell);
	return this;
};

LogMassage.prototype.eachRow = function(eachFunction, context) {
	var i, len, x;
	for (i = 0, len = this.data.length; i<len; i++) {
		eachFunction.call(context || this, i, this.data[i]);
	};
	return this;
};

LogMassage.prototype.eachCell = function(eachFunction, context) {
	var i, ii, len, lenn, x;
	for (i = 0, len = this.data.length; i<len; i++) {
		x = this.data[i];
		for (ii = 0, lenn = x.length; ii<lenn; ii++) {
			eachFunction.call(context || this, ii, x[ii], i, x);
		};
	};
	return this;
};

LogMassage.prototype.eachCellByPosition = function(pos, eachFunction, context) {
	var i, len, x;
	for (i = 0, len = this.data.length; i<len; i++) {
		x = this.data[i];
		eachFunction.call(context || this, x[pos], i, x);
	};
	return this;
};

LogMassage.prototype.toDate = function() {
	var i, ii, len, lenn, x, fields;
	for (i = 0, len = this.data.length; i<len; i++) {
		x = this.data[i];
		fields = [];
		for (ii = 0, lenn = arguments.length; ii<lenn; ii++) {
			fields.push(x[arguments[ii]]);
			fields.push(" ");
		};
		fields.pop(); // remove extra space
		x.push(
			new Date(fields.join(""))
		);
	};
	return this;
};

module.exports = LogMassage;

