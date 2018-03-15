require('./legend.scss');
import { addPX, arrConvertPX } from './cssRules.js';
var d3 = require('d3');

var Legend = function(myChart, legOpt, seriesColor) {
	this.myChart = myChart;
	this.seriesColor = seriesColor;
	this.legOpt = legOpt;
	this.init();
}

var LegProto = Legend.prototype;

LegProto.init = function() {
	// console.info('legend', 'init');
	var legOpt = this.formatOpt();
	this.render(legOpt);
};

LegProto.formatOpt = function() {
	// debugger;
	var legOpt = {};
	var defaultOpt = LegProto.defaultOption;
	var seriesColor = this.seriesColor;
	for (var i in defaultOpt) {		
		if (i === 'data') {
			var dataOpt = [];
			this.legOpt[i].map(function(opt){
				var singer = seriesColor.filter(function(item){
								return item.name === (opt.name || opt)
							});
				//option 中 data配置有误
				if (singer.length === 0) return;
				var name = opt.name || opt;
				var icon = opt.icon || (singer[0].type === 'line' ? 'circle' : 'roundRect');
				dataOpt.push({ name:name, icon:icon, iconColor: singer[0].color})
			})
			legOpt[i] = defaultOpt[i] = dataOpt;
		} else if (i === 'textStyle'){
			legOpt[i] = {...defaultOpt[i], ...this.legOpt[i]};
		} else {
			legOpt[i] = this.legOpt[i] || defaultOpt[i];			
		}
	}
	return legOpt;
};

LegProto.render = function(legOpt) {
	var myChart = this.myChart;
	// var series = this.series;
	// console.info('myChart', myChart);
	var svgWidth = myChart.svg.attr('width');
	var svgHeight = myChart.svg.attr('height');
	var wrap = document.getElementById(myChart.wrapSelector.substr(1));

	wrap.style.position = 'relative';
	// debugger;
	if( wrap.getElementsByClassName('legBox').length > 0){
		wrap.removeChild(wrap.getElementsByClassName('legBox')[0]);
	}
	var legUL = document.createElement('ul');
		legUL.className = 'legBox ' + legOpt.orient;

	//legUL图例样式
	var ulStyle = {
		position: ['left', 'top', 'right', 'bottom'],
		bgbdStyle: ['backgroundColor', 'borderColor', 'borderRadius', 'borderWidth']
	};
	//['zIndex', 'padding', 'textStyle'];
	legUL.style.zIndex = legOpt.zIndex;
	for (var s in legOpt.textStyle) {
		legUL.style[s] = addPX(legOpt.textStyle[s]);
	}
	legUL.style.padding = arrConvertPX(legOpt.padding);
	ulStyle.position.forEach(function(s){
		var horizon = ['left', 'center', 'right'];
		var vertical = ['top', 'middle', 'bottom'];		
		var horIdx = horizon.indexOf(legOpt[s]);
		var verIdx = vertical.indexOf(legOpt[s]);

		if ( horIdx !== -1 && horizon.includes(s)) {
			if (horIdx === 1) {
				legUL.style.left = '50%';
				legUL.style.transform = 'translate(-50%, 0)';				
			} else {
				legUL.style[horizon[horIdx]] = '0px';				
			}
		} else if ( verIdx !== -1 && vertical.includes(s)) {
			// debugger;
			if (verIdx === 1) {
				legUL.style.top = '50%';
				legUL.style.transform = 'translate(0, -50%)';				
			} else {
				legUL.style[vertical[verIdx]] = '0px';				
			}
		} else {
			legUL.style[s] = addPX(legOpt[s]);			
		}
	});
	ulStyle.bgbdStyle.forEach(function(s){
		legUL.style[s] = s === 'borderRadius' ? arrConvertPX(legOpt[s]) : addPX(legOpt[s]);
	});
	

	for (var i=0; i<legOpt.data.length; i++) {
 
		var legLi = document.createElement('li');
		var domI = document.createElement('i');
		var domSpan = document.createElement('span');		


		domSpan.appendChild(document.createTextNode(legOpt.formatter(legOpt.data[i].name)));		
		
		//legLi每组item样式
		//legLi.className = legOpt.orient;
		var gapS = legOpt.orient === 'horizontal' ? 'marginRight' : 'marginBottom';
		legLi.style[gapS] = addPX(legOpt.itemGap);
		//domI 图标样式
		domI.style.width = addPX(legOpt.itemWidth);
		domI.style.height = addPX(legOpt.itemHeight);
		
		var icon = legOpt.data[i].icon;
		if (icon.split('//').length > 1) {
			domI.className = 'image';
			domI.style.backgroundImage = icon.split('//')[1];
		} else {
			domI.className = icon;
			domI.style.backgroundColor = legOpt.data[i].iconColor;			
		}
		
		legLi.appendChild(domI);
		legLi.appendChild(domSpan)

		legUL.appendChild(legLi);
	}
	wrap.appendChild(legUL);

};

LegProto.defaultOption = {
    // 层叠
    zIndex: 0,   
    // 布局方式，默认为水平布局，可选为: 'horizontal' | 'vertical'
    orient: 'horizontal',
    // 水平方向位置 'left', 'center', 'right'; 具体数值: 34，'34px'; 百分比: '20%'
    left: 0, 
    // right: 'center',
    // 竖直方向位置 'top', 'middle', 'bottom'; 具体数值: 34，'34px'; 百分比: '20%'
    top: 0,  
    // bottom: 0,
    // 图例背景颜色
    backgroundColor: 'rgba(0,0,0,0)',    
    // 图例边框颜色
    borderColor: '#fff',
    // 图例圆角半径，单位px，默认为0, 支持传入数组分别指定 4 个圆角半径
    borderRadius: 0,
    // 图例边框线宽，单位px，默认为0（无边框）
    borderWidth: 0,    
    // 图例内边距，单位px，默认各方向内边距为5; 接受数组分别设定上右下左边距，同css: [2,3]; [3,3,3,3]
    padding: 5,
    textStyle: {
        // 图例文字颜色
        color: '#fff',
        // fontSize: 20
    },

    // 各个item之间的间隔，单位px，默认为10; 横向布局时为水平间隔，纵向布局时为纵向间隔
    itemGap: 10,
    
    // 图例图形宽度
    itemWidth: 25,
    // 图例图形高度
    itemHeight: 14,

    formatter: function(value) {
    	return value;
    },
    // 图例内容（详见legend.data，数组中每一项代表一个item
    	//name: 图例项的名称; 
    	//icon: bar默认roundRect, line 默认lineDot
    			//提供 'circle', 'rect', 'roundRect', 'triangle', 'diamond'; 
    			//'image://url' (svg,png,jpg...)
    data: []
}

export default Legend;
