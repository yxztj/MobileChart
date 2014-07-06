var socket = io('https://websocket.btcchina.com:443/');

Highcharts.setOptions({
	global: {
		useUTC: false
	}
});

var priceDecimal = {
	cnybtc: 2,
	cnyltc: 2,
	btcltc: 4,
	usdbtc: 2
},
symbol_src = {
	cnybtc: '¥',
	cnyltc: '¥',
	btcltc: '฿',
	usdbtc: '$'
},
symbol_dest = {
	cnybtc: '฿',
	cnyltc: 'Ł',
	btcltc: 'Ł',
	usdbtc: '฿'
};

var locale = 'en';
var timeunits = {
	    _1m: 60,
	    _3m: 60 * 3,
	    _5m: 60 * 5,
	    _15m: 60 * 15,
	    _30m: 60 * 30,
	    _1h: 60 * 60,
	    _2h: 60 * 60 * 2,
	    _4h: 60 * 60 * 4,
	    _6h: 60 * 60 * 6,
	    _12h: 60 * 60 * 12,
	    _1d: 60 * 60 * 24,
	    _3d: 60 * 60 * 24 * 3,
	    _1w: 60 * 60 * 24 * 7
	};
var markets = ['cnybtc', 'cnyltc', 'btcltc', 'usdbtc'];
var charts = {};
var dataforchart = {
	cnybtc: {
		prices: [],
		volumes: []
	},
	cnyltc: {
		prices: [],
		volumes: []
	},
	btcltc: {
		prices: [],
		volumes: []
	},
	usdbtc: {
		prices: [],
		volumes: []
	}
};
// dataforchart is modified after chart is drawn. so we need another array to keep original data
var originaldata = {
	cnybtc: {
		prices: [],
		volumes: []
	},
	cnyltc: {
		prices: [],
		volumes: []
	},
	btcltc: {
		prices: [],
		volumes: []
	},
	usdbtc: {
		prices: [],
		volumes: []
	}
};
var loading = {cnybtc: {}, cnyltc: {}, btcltc: {}, usdbtc: {}};
var initloading = {cnybtc: {}, cnyltc: {}, btcltc: {}, usdbtc: {}};
var nomoredata = {cnybtc: {}, cnyltc: {}, btcltc: {}, usdbtc: {}};
var currenttimekey = {cnybtc: '_1h', cnyltc: '_1h', btcltc: '_1h', usdbtc: '_1h'};
var charttitles;
if (locale == 'zh') {
	charttitles = {
		cnybtc: 'BTC/CNY 市场',
		cnyltc: 'LTC/CNY 市场',
		btcltc: 'LTC/BTC 市场',
		usdbtc: 'USD/BTC 市场'
	};
}
else {
	charttitles = {
		cnybtc: 'BTC/CNY Market',
		cnyltc: 'LTC/CNY Market',
		btcltc: 'LTC/BTC Market',
		usdbtc: 'USD/BTC Market'
	};
}
var defaulttickcount = 96, preloaddiff = 20, defaultrange = 30;
var phrases;
if (locale == 'zh') {
	phrases = {
		timekey: {
			_1m: '1分钟',
		    _3m: '3分钟',
		    _5m: '5分钟',
		    _15m: '15分钟',
		    _30m: '30分钟',
		    _1h: '1小时',
		    _2h: '2小时',
		    _4h: '4小时',
		    _6h: '6小时',
		    _12h: '12小时',
		    _1d: '日线',
		    _3d: '3日线',
		    _1w: '周线'
		}
	}
}
else {
	phrases = {
		timekey: {
			_1m: '1 minute',
		    _3m: '3 minutes',
		    _5m: '5 minutes',
		    _15m: '15 minutes',
		    _30m: '30 minutes',
		    _1h: '1 hour',
		    _2h: '2 hours',
		    _4h: '4 hours',
		    _6h: '6 hours',
		    _12h: '12 hours',
		    _1d: '1 day',
		    _3d: '3 days',
		    _1w: '1 week'
		}
	}
}

socket.emit('subscribe', 
	['marketdata_cnybtc', 
	'marketdata_cnyltc', 
	'marketdata_btcltc']);   

socket.on('connect', function(){
	socket.on('trade', function (data) {
         //console.log(data);
       });
});

var charts = {
	cnybtc: {},
	cnyltc: {}
};

var loadedMarket = [];

function loadChart(market){
	if ($.inArray(market, loadedMarket) != -1) {
		return true;
	}

	loadedMarket.push(market);

	charts[market] = new Highcharts.StockChart({
		chart: {
			renderTo: 'chart_container',
			events: {
				redraw: function (event) {
					if (charts[market].xAxis && !initloading[market][currenttimekey[market]] && !nomoredata[market][currenttimekey[market]]) {
						var extremes = charts[market].xAxis[0].getExtremes();
						if (extremes && extremes.min < extremes.dataMin + timeunits[currenttimekey[market]] * preloaddiff * 1000) {
							console.log("time to load more data!");
							loadData(null, Math.round(extremes.dataMin / 1000));
						}
					}
				}
	//			load: addChartCrosshairs
			},
			backgroundColor: '#000000',
			marginRight: 30,
			marginBottom: 20,
			marginTop: 20,
			resetZoomButton: {
        theme: {
          fill: 'gray',
          stroke: 'gray',
          r: 0,
          states: {
            hover: {
              fill: '#41739D',
              style: {
                  color: 'white'
              }
            }
          }
        }
      },
      pinchType: 'x'
		},

		// title: {
		// 	text: charttitles[market]
		// },

		credits: {
			enabled: false
		},
		rangeSelector: {
			enabled: false
			// buttons: [
			// 	{
			// 		type: 'day',
			// 		count: 1,
			// 		text: '1d',
			// 		onclick: function(e) {
			// 			e.preventDefault();
			// 		}
			// 	},
			// 	{
			// 		type: 'day',
			// 		count: 2,
			// 		text: '2d'
			// 	}
			// ],
			// inputEnabled: false,
			// buttonTheme: { // styles for the buttons
	  //   		fill: '#1c1c1c',
	  //   		stroke: 'white',
	  //   		'stroke-width': 0,
	  //   		r: 2,
	  //   		style: {
	  //   			color: 'white',
	  //   			fontWeight: 'bold'
	  //   		},
	  //   		states: {
	  //   			hover: {
	  //   			},
	  //   			select: {
	  //   				fill: '#848484',
	  //   				style: {
	  //   					color: 'white'
	  //   				}
	  //   			}
	  //   		}
	  //   	},
		},

		tooltip: {
			positioner: function () {
				return { x: 0, y: 0 };
			},
			style: {
				color: 'white',
				fontSize: '8px',
				padding: '4px'
			},
			borderWidth: 1,
			borderRadius: 0,
			borderColor: 'black',
			backgroundColor: 'black',
			shadow: false,
			animation: true,
			crosshairs: true,
			followTouchMove: true,
			formatter: function () {
				if (this.points[1]) {
					if (locale == 'zh') {
						return Highcharts.dateFormat('%m-%d %H:%M', this.x) + ' <b>开</b>:' + symbol_src[market] + this.points[0].point.open + ' <b>高</b>:' + symbol_src[market] + this.points[0].point.high + ' <b>低</b>:' + symbol_src[market] + this.points[0].point.low + ' <b>收</b>:' + symbol_src[market] + this.points[0].point.close + ' <b>量</b>:' + symbol_dest[market] + Math.round(this.points[1].y * 1000) / 1000;
					}
					else {
						return Highcharts.dateFormat('%m-%d %H:%M', this.x) + ' <b>Open</b>:' + symbol_src[market] + this.points[0].point.open + ' <b>High</b>:' + symbol_src[market] + this.points[0].point.high + ' <b>Low</b>:' + symbol_src[market] + this.points[0].point.low + ' <b>Close</b>:' + symbol_src[market] + this.points[0].point.close + ' <b>Vol</b>:' + symbol_dest[market] + Math.round(this.points[1].y * 1000) / 1000;
					}
				}
				return '';
			}
		},
		exporting: {
			buttons: {
				contextButton: {
					symbol: '',
					text: '导出',
					enabled: false
				},
				_1dBtn: {
					text: phrases.timekey._1d,
					onclick: function () {
						loadData('_1d');
					}
				},
				_1hBtn: {
					text: phrases.timekey._1h,
					onclick: function () {
						loadData('_1h');
					}
				}
			}
		},

		plotOptions: {
			candlestick: {
				upLineColor: 'green',
				upColor: 'black',
				color: '#d02c2b',
				lineColor: '#d02c2b',
				animation: true
			},
			column: {
				color: '#606060',
				lineWidth: 1
			},
			trendline: {
				lineWidth: 1
			}
		},

		navigator: {
			xAxis: {
				dateTimeLabelFormats: {
					second: '%H:%M:%S',
					minute: '%H:%M',
					hour: '%H:%M',
					day: '%m-%d',
					week: '%m-%d',
					month: '%Y-%m',
					year: '%Y'
				}

			},
			enabled: false
		},

		xAxis: {
			type: 'datetime',
			range: 2.5 * 24 * 3600 * 1000, // 2.5 days by default
			dateTimeLabelFormats: {
				second: '%H:%M:%S',
				minute: '%H:%M',
				hour: '%H:%M',
				day: '%m-%d',
				week: '%m-%d',
				month: '%Y-%m',
				year: '%Y'
			},
			labels: {
				style: {
					color: 'gray',
					fontSize: '8px'
				},
				y: 15
			},
			lineColor: 'gray',
			tickInterval: 12 * 3600 * 1000,
			tickLength: 5,
			tickColor: 'gray',
			events: {
				setExtremes: function(e) {

					//prevent reset zoom function
					if(e.min == null) {
						e.preventDefault();
						setTimeout(function() {
							manualReset();
						}, 10);
						
					}
					
				}
			}

		},

		yAxis: [
		{
			opposite: false,
			offset: -40,
			height: '85%',
			top: '15%',
			gridLineWidth: 0,
			labels: {
				enabled: false
			},
			gridLineColor: 'gray'
		},
		{
			offset: -10,
			opposite: true,
			labels: {
				format: symbol_src[market] + '{value}',
				style: {
					color: 'gray',
					fontSize: '8px'
				},
				y: 3
			},
			gridLineColor: 'gray'
		}
		],

		series: [
		{
			type: 'candlestick',
			name: 'Prices',
			yAxis: 1,
			dataGrouping: {
				enabled: false
			},
			id: 'primary',
			zIndex: 10
		},
		{
			type: 'column',
			name: 'Volumes',
			yAxis: 0,
			dataGrouping: {
				enabled: false
			}
		},
		{
			name: '7-day SMA',
			linkedTo: 'primary',
			type: 'trendline',
			algorithm: 'SMA',
			periods: 7,
			yAxis: 1,
			color: '#0D86FF',
			marker: {
				radius: 2
			}
		},
		{
			name: '30-day SMA',
			linkedTo: 'primary',
			type: 'trendline',
			algorithm: 'SMA',
			periods: 30,
			yAxis: 1,
			color: '#FF9C2A',
			marker: {
				radius: 2
			}
		}
		],

		loading: {
			style: {
				backgroundColor: 'black'
			},
			labelStyle: {
				color: 'white'
			}
		},

		scrollbar: {
			enabled: false,
			liveRedraw: false
		}

	});

	socket.on('chartdata_' + market, function (data) {
		console.log('chartdata_' + market + ': ', data);
		loading[market][currenttimekey[market]] = false;

		if ($.isEmptyObject(data)) {
			// All data of current market:timekey has been loaded. We shouldn't load data for this any more
			nomoredata[market][currenttimekey[market]] = true;
			charts[market].hideLoading();
			return;
		}

		var localdata = {
			prices: [],
			volumes: []
		};
		var rangeperiod = defaultrange * timeunits[currenttimekey[market]] * 1000;

		var extremes = charts[market].xAxis[0].getExtremes();
		for (var i in data) {
			var prices = [], volumes = [];
			prices.push(i * 1000);
			volumes.push(i * 1000);
			for (var j in data[i]) {
				prices.push(Number(data[i][j]));
			}
			volumes.push(Number(data[i][4]));
			localdata.prices.push(prices);
			localdata.volumes.push(volumes);
		}

		dataforchart[market].prices = localdata.prices.concat(dataforchart[market].prices);
		dataforchart[market].volumes = localdata.volumes.concat(dataforchart[market].volumes);
		//					originaldata[market].prices = localdata.prices.concat(originaldata[market].prices);
		//					originaldata[market].volumes = localdata.volumes.concat(originaldata[market].volumes);
		charts[market].series[0].setData(dataforchart[market].prices, false);
		charts[market].series[1].setData(dataforchart[market].volumes, false);

		if (typeof extremes.min !== 'undefined') {
			var min = extremes.min, max = extremes.max;

			// Make sure the scollbar is in data range after data load
			if (initloading[market][currenttimekey[market]]) {
				// If switch to another timekey, we need to reset range
				max = localdata.prices[localdata.prices.length - 1][0];
				min = Math.round(max - rangeperiod);
			}
			else {
				if (extremes.min < extremes.dataMin) {
					min = extremes.dataMin;
					max = Math.round(min + rangeperiod);
				}
				else if (extremes.max > extremes.dataMax) {
					max = extremes.dataMax;
					min = Math.round(max - rangeperiod);
				}
			}

			charts[market].xAxis[0].setExtremes(
				min,
				max, false
			);
		}
		// defaultrange * timeunits[currenttimekey[market]] * 1000;
		// charts[market].xAxis[0].setExtremes(
		// 	min,
		// 	max, false
		// );
		
		charts[market].redraw();
		console.log(charts[market].xAxis[0].getExtremes());
		charts[market].hideLoading();
		initloading[market][currenttimekey[market]] = false;
	});

function manualReset() {
	var max = charts[market].xAxis[0].getExtremes().dataMax;
	var min = max - defaultrange * timeunits[currenttimekey[market]] * 1000;

	charts[market].xAxis[0].setExtremes(
		min,
		max
	);
}

	function loadData(unit, totime) {
		if (loading[market][currenttimekey[market]] && (!unit || unit == currenttimekey[market])) {
			return;
		}

		totime = totime || Math.round(new Date() / 1000);

		if (unit) {
			dataforchart[market] = {
				prices: [],
				volumes: []
			};
			currenttimekey[market] = unit;
			initloading[market][currenttimekey[market]] = true;
			nomoredata[market][currenttimekey[market]] = false;
			charts[market].xAxis[0].range = defaultrange * timeunits[currenttimekey[market]] * 1000;

			// set chart title
			//charts[market].setTitle({text: charttitles[market] + ' (' + phrases.timekey[currenttimekey[market]] + ')'});
		}
		else {
			initloading[market][currenttimekey[market]] = false;
		}
		loading[market][currenttimekey[market]] = true;

		unit = unit || currenttimekey[market];

		charts[market].showLoading();

		socket.emit('getChartData', {
			market: market,
			unit: unit,
			totime: totime - 1,
			itemcount: defaulttickcount
		});
	}

	loadData('_2h');
}


function getModTime(time, mod) {
    return time - time % mod;
}

