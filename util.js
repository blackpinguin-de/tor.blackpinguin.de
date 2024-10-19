Number.prototype.min = function(min){ return Math.max(min, this); }
Number.prototype.max = function(max){ return Math.min(max, this); }
Number.prototype.clamp = function(min, max){
	if (min <= max) { return this.min(min).max(max); }
	else            { return this.min(max).max(min); }
}

function datetime(str){
	//var str = "2008-12-20 09:46:01";
	bound = str.indexOf(' ');
	date = str.slice(0, bound).split('-');
	time = str.slice(bound + 1).split(':');
	return new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2]);
}


function seperateB(str){
	bound = str.indexOf('B');
	value = parseFloat(str.slice(0, bound-1));
	unit = str.slice(bound-1);
	return new Array(value,unit);
}


function  kb(str){
	z = seperateB(str);
	if(z[1] == "MB"){z[0] *= 1000.0;}
	else if(z[1] == "GB"){z[0] *= 1000000.0;}
	else if(z[1] == "TB"){z[0] *= 1000000000.0;}
	return z[0];
}


function mb(str){
	z = seperateB(str);
	if(z[1] == "kB"){z[0] /= 1000.0;}
	else if(z[1] == "GB"){z[0] *= 1000.0;}
	else if(z[1] == "TB"){z[0] *= 1000000.0;}
	return z[0];
}


function gb(str){
	z = seperateB(str);
	if(z[1] == "kB"){z[0] /= 1000000.0;}
	else if(z[1] == "MB"){z[0] /= 1000.0;}
	else if(z[1] == "TB"){z[0] *= 1000.0;}
	return z[0];
}


function tb(str){
	z = seperateB(str);
	if(z[1] == "kB"){z[0] /= 1000000000.0;}
	else if(z[1] == "MB"){z[0] /= 1000000.0;}
	else if(z[1] == "GB"){z[0] /= 1000.0;}
	return z[0];
}


function round(x){
	return Math.round(x * 100) / 100;
}
