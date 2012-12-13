

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
				break;
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
	var i, len, x, resultsArray = [], keep;
	for (i = 0, len = this.data.length; i<len; i++) {
		x = this.data[i];
		keep = eachFunction.call(context || this, i, x);
		if(keep) resultsArray.push(x)
	};
	this.data = resultsArray;
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

LogMassage.prototype.toDate = function(/* 1, 2, 3 cells */) {
	var i, ii, len, lenn, x, fields;
	for (i = 0, len = this.data.length; i<len; i++) {
		x = this.data[i];
		// Just reassign he value if only one param passed
		if(arguments.length === 1){
			this.data[i] = new Date(x);
			continue;
		};
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

LogMassage.prototype.toNumber = function(/* 1, 2, 3 cells */) {
	var i, ii, len, lenn, x;
	for (i = 0, len = this.data.length; i<len; i++) {
		x = this.data[i];
		for (ii = 0, lenn = arguments.length; ii<lenn; ii++) {
			x[arguments[ii]] = Number(x[arguments[ii]]);
		};
	};
	return this;
};

LogMassage.prototype.filterBetween = function(a, b, pos) {
	/* A is the low value and B is the high. Pos is the cell to evaluate */
	var i, len, x, val;
	var dataType = typeof a;
	var keep = false;
	var results = [];

	if(dataType === "object"){
		if(dataType instanceof Date) dataType = "date";
	};

	function betweenCompare(){
		return ( a <= val && b >= val );
	};

	for (i = 0, len = this.data.length; i<len; i++) {
		x = this.data[i];
		val = x[pos];
		switch(dataType){
			case "date" :
				a = a.getTime();
				b = b.getTime();
				if(!val instanceof Date) val = new Date(val).getTime();
				keep = betweenCompare.call(this, a, b, val);
				break;
			case "number" :
				val = Number(val);
				keep = betweenCompare.call(this, a, b, val);
				break;
			default :
				keep = betweenCompare.call(this, a, b, val);
		};
		if(keep) results.push(x);
	};
	this.data = results;
	return this;
};

module.exports = LogMassage;

