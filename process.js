function init(){
	slider = document.getElementById('smooth');
	text = document.getElementById('smooth-text');
	now = document.getElementById('smooth-now');
	
	var min = Math.round((data.length - 1) / 200); // not more than 200 data points
	var max = Math.ceil((data.length - 1)/5); // not less than five data points
	var s = Math.floor(Math.pow(data.length - 1, 0.75)*0.1).min(min).clamp(1, max);
	
	slider.max = max.max(s * 2);
	slider.setAttribute('max', slider.max);
	
	slider.value = s;
	text.innerHTML = slider.value === '1' ? 'Off' : slider.value;

	document.getElementById('smooth-total').innerHTML = (data.length - 1);
	
	createChart();
};

function adder(old){
	// for kb/gb seperated to reduce possible rounding errors
	var _kb = 0.0, _kb_old = 0.0, _kb_accu = 0.0;
	var _gb = 0.0, _gb_old = 0.0, _gb_accu = 0.0;
	
	// difference between the last kb of the old adder and the last kb of this adder.
	var _diff = 0.0;

	// copy from old
	if(typeof old !== 'undefined'){
		_kb_old = old.kb;
		_gb_old = old.gb;
		_kb_accu = old.kb_accu;
		_gb_accu = old.gb_accu;
	}
	
	return function(data){
		if(typeof data !== 'undefined'){
			if(data === 'raw'){
				return { kb: _kb, kb_accu: _kb_accu , gb: _gb, gb_accu: _gb_accu};
			}
		
			_kb = kb(data);
			_gb = gb(data);
			
			if (_kb < _kb_old || _gb < _gb_old) {
				_kb_accu += _kb_old;
				_gb_accu += _gb_old;
				_diff += _kb;
			} else {
				_diff += _kb - _kb_old;
			}
			
			_kb_old = _kb;
			_gb_old = _gb;
		}
		return { kb: _kb + _kb_accu, gb: _gb + _gb_accu, diff: _diff };
	}
};

function createChart() {
	// Preprocessing
	for(var i = data.length - 2; i >= 0; i--){
		// Date-Object from String
		data[i].date = datetime(data[i][0]);
	}
	
	// first and last day of the year
	if(data.length > 1){
		var d_min = new Date(data[0].date.getTime());
		var d_max = new Date(data[data.length - 2].date.getTime());
		if (d_max.getTime() - d_min.getTime() <= 370*24*60*60*1000 && data.length >= 55) {
			d_min.setMonth(0); d_min.setDate(1); d_min.setHours(0); d_min.setMinutes(0); d_min.setSeconds(0);
			d_max.setMonth(11); d_max.setDate(31); d_max.setHours(23); d_max.setMinutes(59); d_max.setSeconds(59);
		}
	}
	// visual settings
	var s_opt = {
		hAxis:{title:'Time [Timestamp]', textPosition:'none', 
			gridlines:{count: -1, color:'#888'}, //minorGridlines:{color:'none',count:0}, 
			viewWindowMode: 'explicit', viewWindow:{min: d_min, max: d_max}},
		vAxis:{title:'Amount of data [GB]', gridlines:{count: 6, color:'#888'}},
		legend:'none', backgroundColor:'none',
		chartArea:{left:'8%', top:'5%', width:"91%", height:"85%"}, pointSize: 3,
		colors: ['#00ff00'],
		interpolateNulls: false
	};
	var r_opt = {
		hAxis:{title:'Time [Timestamp]', textPosition:'none', 
			gridlines:{count: -1, color:'#888'}, 
			viewWindowMode: 'explicit', viewWindow:{min: d_min, max: d_max}},
		vAxis:{title:'Amount of data [GB]', gridlines:{count: 6, color:'#888'}}, 
		//viewWindowMode: 'explicit', viewWindow:{min: d_min, max: d_max},
		legend:'none', backgroundColor:'none',
		chartArea:{left:'8%', top:'5%', width:"91%", height:"85%"}, pointSize: 3,
		colors: ['#ff0000'],
		interpolateNulls: false
	};
	var t_opt = {
		hAxis:{title:'Time [Timestamp]', textPosition:'none', 
			gridlines:{count: -1, color:'#888'}, 
			viewWindowMode: 'explicit', viewWindow:{min: d_min, max: d_max}},
		vAxis:{title:'Amount of data [GB]', gridlines:{count: 6, color:'#888'}}, 
		legend:'none', backgroundColor:'none',
		chartArea:{left:'8%', top:'5%', width:"91%", height:"85%"}, pointSize: 3,
		colors: ['#8888ff'],
		interpolateNulls: false
	};
	var ss_opt = {
		hAxis:{title:'Time [Timestamp]', textPosition:'none', 
			gridlines:{count: -1, color:'#888'}, 
			viewWindowMode: 'explicit', viewWindow:{min: d_min, max: d_max}},
		vAxis:{title:'Goodput [kbit/s]', gridlines:{count: 6, color:'#888'}},
		legend:'none', backgroundColor:'none',
		chartArea:{left:'8%', top:'5%', width:"91%", height:"85%"}, pointSize: 3,
		colors: ['#00ff00'],
		interpolateNulls: false
	};
	var rs_opt = {
		hAxis:{title:'Time [Timestamp]', textPosition:'none', 
			gridlines:{count: -1, color:'#888'}, 
			viewWindowMode: 'explicit', viewWindow:{min: d_min, max: d_max}},
		vAxis:{title:'Goodput [kbit/s]', gridlines:{count: 6, color:'#888'}},
		legend:'none', backgroundColor:'none',
		chartArea:{left:'8%', top:'5%', width:"91%", height:"85%"}, pointSize: 3,
		colors: ['#ff0000'],
		interpolateNulls: false
	};
	
	
	// DOM-Element selection
	var v_s = new google.visualization.AreaChart(document.getElementById('sent'));
	var v_r = new google.visualization.AreaChart(document.getElementById('received'));
	var v_t = new google.visualization.AreaChart(document.getElementById('traffic'));
	var v_ss = new google.visualization.LineChart(document.getElementById('sentspeed'));
	var v_rs = new google.visualization.LineChart(document.getElementById('receivedspeed'));
	
	
	// insert data into chart
	var fillChart = function(){
	
		// get smooth value
		var old = slider.getAttribute('value');
		var smooth = Number(slider.value);
		if(old == smooth) { return; }
		slider.setAttribute('value', slider.value);
		text.innerHTML = slider.value === '1' ? 'Off' : slider.value;
		
		
		// chart data structure
		var sent = new google.visualization.DataTable();
		var rcvd = new google.visualization.DataTable();
		var traff = new google.visualization.DataTable();
		var sentspeed = new google.visualization.DataTable();
		var rcvdspeed = new google.visualization.DataTable();
		sent.addColumn('datetime', 'Time [Timestamp]');
		sent.addColumn('number', 'Amount of data [GB]');
		rcvd.addColumn('datetime', 'Time [Timestamp]');
		rcvd.addColumn('number', 'Amount of data [GB]');
		traff.addColumn('datetime', 'Time [Timestamp]');
		traff.addColumn('number', 'Amount of data [GB]');
		sentspeed.addColumn('datetime', 'Time [Timestamp]');
		sentspeed.addColumn('number', 'Goodput [kbit/s]');
		//sentspeed.addColumn({type: 'boolean', role: 'certainty'});
		rcvdspeed.addColumn('datetime', 'Time [Timestamp]');
		rcvdspeed.addColumn('number', 'Goodput [kbit/s]');
		//rcvdspeed.addColumn({type: 'boolean', role: 'certainty'});

		
		// actual computation
		var n = 0;
		var m = smooth;
		var s_old = adder(); s_old(data[0][1]);
		var r_old = adder(); r_old(data[0][2]);
		for(var i = 0; i < data.length - 1; i += m){
			n++;

			var certainty = true;
			
			var s = adder(s_old('raw'));
			var r = adder(r_old('raw'));
			s_old = s;
			r_old = r;

			var d_last = null;
			var time = 0;
			var m = (i + smooth < data.length ? smooth : data.length - i - 1);
			
			// check if two dates are too far away to combine
			for(var j = i + 1; j < i + m + 1 && j < data.length - 1; j++) {
				var d_a = data[j-1].date;
				var d_b = data[j].date;
				if( d_b.getTime() - d_a.getTime() >= 24*60*60*1000) { // 1 day
					m = (j - i).clamp(1, m);
					certainty = false;
					break;
				}
			}
			
			// add all together
			for(var j = i; j < i + m; j++){
				s(data[j][1]);
				r(data[j][2]);
				d_last = data[j].date; // last date of this timeframe
				time += d_last.getTime() / m;
			}
			var d = new Date(time); // average date for view
			
			sent.addRow([d, round(s().gb)]);
			rcvd.addRow([d, round(r().gb)]);
			traff.addRow([d, round(s().gb + r().gb)]);
			
			if(i > 0 || m > 1){
				var oldd = data[i === 0 ? 0 : i - 1].date;
				var time_ms = d_last.getTime() - oldd.getTime();
				var s_kbps = s().diff * 8000.0 / time_ms;
				var r_kbps = r().diff * 8000.0 / time_ms;
				sentspeed.addRow([d, round(s_kbps)]);
				rcvdspeed.addRow([d, round(r_kbps)]);
			}
			else{
				sentspeed.addRow([d, 0.0]);
				rcvdspeed.addRow([d, 0.0]);
			}
			
			if(! certainty){
				sentspeed.addRow([d, null]);
				rcvdspeed.addRow([d, null]);
			}
		}
		
		
		now.innerHTML = n;
		
		// draw the chart
		var drawChart = function(){
			v_s.draw(sent, s_opt);
			v_r.draw(rcvd, r_opt);
			v_t.draw(traff, t_opt);
			v_ss.draw(sentspeed,ss_opt);
			v_rs.draw(rcvdspeed,rs_opt);
			var texts = document.querySelectorAll("svg > g > g > g > text[text-anchor='start']");
			for (var text of texts) { text.setAttribute('text-anchor', 'end'); }
		}
		drawChart();
		window.onresize = drawChart;
		
	};
	fillChart();
	slider.onchange = fillChart;
	//slider.oninput = fillChart;
	
}
