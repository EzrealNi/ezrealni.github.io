require('./legend.scss');
import { addPX, arrConvertPX, handlePosition } from './cssRules.js';

class Legend {
  constructor(myChart) {
    this.myChart = myChart;
  }

  validate(option = []) {
    const self = this;
    const myChart = self.myChart;
    if (!Array.isArray(option)) {
      option = [option];
    }

    option.forEach((legendOpt, legendIndex) => {
      option[legendIndex] = self._validateOption(legendOpt, legendIndex);
    });
    myChart.option.legend = option;
  }

  _validateOption(legendOpt, legendIndex) {
    const self = this;
    const myChart = self.myChart;
    const defaultOption = {
      // 层叠
      zIndex: 0,
      // 是否显示
      show: true,
      // 布局方式，默认为水平布局，可选为: 'horizontal' | 'vertical'
      orient: 'horizontal',
      // 水平方向位置 'left', 'center', 'right'; 具体数值: 34，'34px'; 百分比: '20%'
      // 优先级right > left 默认值right: 0
      left: undefined,
      right: undefined,
      // 竖直方向位置 'top', 'middle', 'bottom'; 具体数值: 34，'34px'; 百分比: '20%'
      // 优先级top > bottom 默认值top: 0
      bottom: undefined,
      top: undefined,
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
        color: myChart.util.config.mainColor,
        fontSize: 14
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
      // name: 图例项的名称;
      // icon: bar默认roundRect, line 默认lineDot
      // 提供 'line', 'circle', 'rect', 'roundRect', 'triangle', 'diamond';
      // 'image://url' (svg,png,jpg...)
      // 图例的颜色
      // iconStyle: {
      //   backgroundColor: '#ccc'
      // }
      data: []
    };

    // 无历史配置时取初始化配置
    let currentOption = defaultOption;

    // 有历史配置时取历史配置
    if (myChart.option.legend && myChart.option.legend[legendIndex]) {
      myChart.option.legend[legendIndex].data = [];
      currentOption = myChart.option.legend[legendIndex];
    }

    // 补全legendOpt缺省的值
    myChart.util.ObjectDeepAssign(currentOption, legendOpt);
    if (legendOpt.right !== undefined) {
      delete currentOption.left;
    } else if (legendOpt.left !== undefined) {
      delete currentOption.right;
    }

    if (currentOption.left === undefined && currentOption.right === undefined) {
      currentOption.right = myChart.option.grid.right;
    }

    if (legendOpt.top !== undefined) {
      delete currentOption.bottom;
    } else if (legendOpt.bottom !== undefined) {
      delete currentOption.top;
    }

    if (currentOption.top === undefined && currentOption.bottom === undefined) {
      currentOption.top = 4;
    }

    return currentOption;
  }

  setLegendData() {
    const self = this;
    const myChart = self.myChart;
    myChart.option.legend.forEach((legendOpt, legendIndex) => {
      self._setSingleLegendData(legendOpt, legendIndex);
    });
    let defs = myChart.grid.selectAll('defs.clipPath');
    if (!defs.nodes().length) {
      defs = myChart.grid.append('defs').attr('class', 'clipPath');
    }
    let lineClipPath = defs
      .append('clipPath')
      .attr('id', 'lineClipPath')
      .attr('clipPathUnits', 'objectBoundingBox');
    lineClipPath
      .append('rect')
      .attr('height', 0.2)
      .attr('width', 1)
      .attr('y', 0.4)
      .attr('x', 0);
    lineClipPath
      .append('ellipse')
      .attr('cx', 0.5)
      .attr('cy', 0.5)
      .attr('ry', 0.45)
      .attr('rx', 0.25);
  }

  _setSingleLegendData(legendOpt, legendIndex) {
    const self = this;
    const myChart = self.myChart;
    // 用户未传入data时检查loadRequire
    if (!(Array.isArray(legendOpt.data) && legendOpt.data.length > 0)) {
      legendOpt.data = [];
      const loadRequire = myChart.util.config.loadRequire;
      Object.keys(loadRequire).forEach(type => {
        if (loadRequire[type].indexOf('legend') > -1) {
          const items = myChart.option.series[type];
          let itemNames = [];
          if (items !== undefined) {
            itemNames = items.reduce((pre, now) => {
              if (type === 'pie') {
                const pieNames = now.data.map(d => d.name);
                return pre.concat(pieNames);
              }
              return pre.concat(now.name);
            }, []);
          }
          legendOpt.data = legendOpt.data.concat(itemNames);
        }
      });
    }

    const tempData = [];
    legendOpt.data.forEach((d, i) => {
      if (!myChart.util.isObject(d)) {
        legendOpt.data[i] = {
          name: d
        };
      }

      let breakFlag = false;
      for (const type of Object.keys(myChart.option.series)) {
        if (breakFlag) break;
        const typeSeries = myChart.option.series[type];
        for (const seriesOpt of typeSeries) {
          if (breakFlag) break;
          const singleLegend = legendOpt.data[i];
          if (type === 'pie') {
            for (const pieOpt of seriesOpt.data) {
              if (pieOpt.name === singleLegend.name) {
                singleLegend.icon =
                  singleLegend.icon || (seriesOpt.type === 'line' ? 'line' : 'roundRect');
                singleLegend.iconStyle = singleLegend.iconStyle || {};
                singleLegend.iconStyle.backgroundColor =
                  singleLegend.iconStyle.backgroundColor || pieOpt.legendColor;
                tempData.push(singleLegend);
                breakFlag = true;
                break;
              }
            }
          } else {
            if (seriesOpt.name === singleLegend.name) {
              singleLegend.icon =
                singleLegend.icon || (seriesOpt.type === 'line' ? 'line' : 'roundRect');
              singleLegend.iconStyle = singleLegend.iconStyle || {};
              singleLegend.iconStyle.backgroundColor =
                singleLegend.iconStyle.backgroundColor || seriesOpt.legendColor;
              tempData.push(singleLegend);
              breakFlag = true;
              break;
            }
          }
        }
      }
    });
    legendOpt.data = tempData;
  }

  init() {
    // debugger;
    const self = this;
    const myChart = self.myChart;
    // console.info('myChart', myChart);
    const wrap = document.getElementById(myChart.wrapSelector.substr(1));

    wrap.style.position = 'relative';
    // debugger;
    var legBoxLen = wrap.getElementsByClassName('legBox').length;
    if (legBoxLen > 0) {
      for (var i = 0; i < legBoxLen; i++) {
        wrap.removeChild(wrap.getElementsByClassName('legBox')[i]);
      }
    }

    myChart.option.legend.forEach((legOpt, legendIndex) => {
      if (!legOpt.show) return;
      const legUL = document.createElement('ul');
      legUL.className = 'legBox legBox' + legendIndex + ' ' + legOpt.orient;

      // legUL图例样式
      const ulStyle = {
        position: ['right', 'bottom', 'left', 'top'],
        bgbdStyle: ['backgroundColor', 'borderColor', 'borderRadius', 'borderWidth']
      };
      // ['zIndex', 'padding', 'textStyle'];
      legUL.style.zIndex = legOpt.zIndex;
      for (var s in legOpt.textStyle) {
        legUL.style[s] = addPX(legOpt.textStyle[s]);
      }
      legUL.style.padding = arrConvertPX(legOpt.padding);

      var position = handlePosition(legOpt, myChart);
      legUL.style[position.hor.type] = addPX(position.hor.value);
      legUL.style[position.ver.type] = addPX(position.ver.value);
      if (position.hor.value === '50%') {
        legUL.style.transform = 'translate(-50%, 0)';
      }
      if (position.ver.value === '50%') {
        legUL.style.transform = 'translate(0, -50%)';
      }

      ulStyle.bgbdStyle.forEach(function(s) {
        legUL.style[s] = s === 'borderRadius' ? arrConvertPX(legOpt[s]) : addPX(legOpt[s]);
      });

      for (var i = 0; i < legOpt.data.length; i++) {
        var legLi = document.createElement('li');
        var domI = document.createElement('i');
        var domSpan = document.createElement('span');

        domSpan.appendChild(document.createTextNode(legOpt.formatter(legOpt.data[i].name)));

        // legLi每组item样式
        // legLi.className = legOpt.orient;
        var gapS = legOpt.orient === 'horizontal' ? 'marginRight' : 'marginBottom';
        legLi.style[gapS] = addPX(legOpt.itemGap);
        // domI 图标样式
        domI.style.width = addPX(legOpt.itemWidth);
        domI.style.height = addPX(legOpt.itemHeight);

        var icon = legOpt.data[i].icon;

        if (icon.split('//').length > 1) {
          domI.className = 'image';
          domI.style.backgroundImage = icon.split('//')[1];
        } else {
          domI.className = icon;
          if (typeof legOpt.data[i].iconStyle.backgroundColor === 'string') {
            domI.style.backgroundColor = legOpt.data[i].iconStyle.backgroundColor;
          } else {
            domI.style.backgroundImage = legOpt.data[i].iconStyle.backgroundColor[1];
          }
        }

        legLi.appendChild(domI);
        legLi.appendChild(domSpan);

        legUL.appendChild(legLi);
      }

      wrap.appendChild(legUL);
    });
  }
}

export default Legend;
