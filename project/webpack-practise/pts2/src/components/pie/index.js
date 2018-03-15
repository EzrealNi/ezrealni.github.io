/*
 * @Author: xinni
 * @Date: 2017-12-08 15:12:40
 * @Last Modified by: xinni
 * @Last Modified time: 2017-12-15 17:56:18
 */

import './pie.scss';
import * as d3 from 'd3';

class Pie {
  constructor(myChart) {
    this.myChart = myChart;
  }
  /**
   * 参数验证与缓存
   * @param {array} options 该种类型图形的数据集合
   * @memberof Pie
   */
  validate(options = []) {
    const self = this;
    const myChart = self.myChart;
    options.forEach((option, index) => {
      options[index] = self._validateOption(option, index);
    });
    myChart.option.series = myChart.option.series || {};
    myChart.option.series.pie = options;
  }

  /**
   * 参数验证与缓存
   * @param {object} option 该种类型图形的数据
   * @param {number} index 该数据的索引值
   * @memberof Pie
   */
  _validateOption(option, index) {
    const self = this;
    const myChart = self.myChart;
    const defaultOption = {
      // 图形类型
      type: 'pie',
      // 系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
      name: 'pies-' + index,
      // 是否玫瑰图
      // false 非玫瑰图
      // 'radius' 扇区圆心角展现数据的百分比，半径展现数据的大小。
      // 'area' 所有扇区圆心角相同，仅通过半径展现数据大小。
      roseType: false,
      // 每一块之间间距大小
      // 支持数值，支持百分比 0.05 | '5%';
      padAngle: 0,
      // 饼图的半径，数组的第一项是内半径，第二项是外半径。
      // 支持设置成百分比，相对于容器高宽中较小的一项的一半。
      // 可以将内半径设大显示成圆环图（Donut chart）。
      // 支持数值 支持百分比 0.75 | 75%
      // 内径为0时可以简化为 radius: '75%' | radius: '0.75' | radius: ['75%'] | radius: [0.75]
      radius: [0, '100%'],
      // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。
      // 支持设置成百分比，设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高度。
      // 支持数值 支持百分比 0.5 | 50%
      // 横坐标 = 纵坐标 时可以简写为 center: '50%' | center: 0.5 | center: ['50%'] | center: 0.5
      center: ['50%', '50%'],
      // 所有扇区的标签配置。当单个扇区的标签配置缺失时会读取此配置。
      label: {
        // 普通状态下单个扇区显示的样式
        normal: {
          // 是否显示
          show: true,
          // 标签内容格式器，支持回调函数
          formatter: (d, i, data) => d.name,
          // 文字的颜色。支持回调函数。
          color: myChart.util.config.mainColor,
          // 回调函数。 d = data[i];
          // color: (d, i, data) => d.itemStyle.normal.color;
          // 文字字体的风格。 'normal' | 'italic' | 'oblique'
          fontStyle: 'normal',
          // 文字字体的粗细。 'normal' | 'bold' | 'bolder' | 'lighter' | 100 | 200 | 300 | 400...
          fontWeight: 'normal',
          // 文字的字体系列。还可以是 'serif' , 'monospace', 'Arial', 'Courier New', 'Microsoft YaHei', ...
          fontFamily: 'sans-serif',
          // 文字的字体大小。
          fontSize: 12
        }
      },
      // 视觉引导线样式
      labelLine: {
        // 普通状态下视觉引导线的样式。
        normal: {
          // 是否显示视觉引导线。
          show: true,
          // 视觉引导线第一段的长度。
          length: 30,
          // 视觉引导项第二段的长度。
          length2: 20,
          // 线的样式
          lineStyle: {
            // 线的颜色。支持回调函数。
            color: myChart.util.config.mainColor,
            // 回调函数。 d = data[i];
            // color: (d, i, data) => d.itemStyle.normal.color;
            // 线宽。
            width: 1,
            // 图形透明度。
            opacity: 1
          }
        }
      },
      // 饼图样式
      itemStyle: {
        // 默认状态下的样式
        normal: {
          // 图形的颜色。默认从全局调色盘 myChart.util.defaultColor 获取颜色。
          color: (d, i, data) => myChart.util.defaultColor(i),
          // 图形的描边颜色。
          borderColor: myChart.util.config.mainColor,
          // 描边线宽。
          borderWidth: 0,
          // 图形透明度。
          opacity: 1
        }
      },
      // 数据，数组，每一位的配置参照defaultpieOption。
      data: []
    };

    let currentOption = defaultOption;
    // 检查该数据是否已缓存
    if (myChart.option.series && myChart.option.series.pie && myChart.option.series.pie[index]) {
      currentOption = myChart.option.series.pie[index];
    }

    option.data = self._validateOptionData(option, currentOption);

    // 补全option缺失的值
    myChart.util.ObjectDeepAssign(currentOption, option);

    if (!Array.isArray(currentOption.radius)) {
      currentOption.radius = [0, currentOption.radius];
    } else if (currentOption.radius.length === 0) {
      currentOption.radius = [0, '100%'];
    } else if (currentOption.radius.length === 1) {
      currentOption.radius = [0, currentOption.radius[0]];
    }

    if (!Array.isArray(currentOption.center)) {
      currentOption.center = [currentOption.center, currentOption.center];
    } else if (currentOption.center.length === 0) {
      currentOption.center = ['50%', '50%'];
    } else if (currentOption.center.length === 1) {
      currentOption.center = [currentOption.center[0], currentOption.center[0]];
    }

    return currentOption;
  }

  /**
   * 验证与补全option.data
   * @param {object} option 该种类型图形的数据
   * @param {object} storageOption 该种类型图形的缓存数据
   * @memberof Pie
   */
  _validateOptionData(option, storageOption) {
    const self = this;
    if (option.data && !Array.isArray(option.data)) {
      option.data = [option.data];
    }
    option.data.forEach((pieOpt, pieIndex) => {
      option.data[pieIndex] = self._validateArcOption(pieOpt, pieIndex, option, storageOption);
    });
    return option.data;
  }

  /**
   * 验证每一个扇形区域的参数
   * @param {object} option 该扇形区域的数据
   * @param {number} index 该数据的索引值
   * @param {object} option 该种类型图形的数据
   * @param {object} storageOption 该种类型图形的缓存数据
   * @memberof Pie
   */
  _validateArcOption(pieOpt, pieIndex, option, storageOption) {
    const self = this;
    const myChart = self.myChart;
    const defaultpieOption = {
      // 数据值。
      value: 0,
      // 数据项名称。
      name: 'pie' + pieIndex,
      // 所有扇区的标签配置。当单个扇区的标签配置缺失时会读取此配置。
      label: {
        // 普通状态下单个扇区显示的样式
        normal: {
          // 是否显示
          show: true,
          // 标签内容格式器，支持回调函数
          formatter: (d, i, data) => d.name,
          // 文字的颜色。支持回调函数。
          color: myChart.util.config.mainColor,
          // 回调函数。 d = data[i];
          // color: (d, i, data) => {
          //   return d.itemStyle.normal.color;
          // },
          // 文字字体的风格。 'normal' | 'italic' | 'oblique'
          fontStyle: 'normal',
          // 文字字体的粗细。 'normal' | 'bold' | 'bolder' | 'lighter' | 100 | 200 | 300 | 400...
          fontWeight: 'normal',
          // 文字的字体系列。还可以是 'serif' , 'monospace', 'Arial', 'Courier New', 'Microsoft YaHei', ...
          fontFamily: 'sans-serif',
          // 文字的字体大小。
          fontSize: 12
        }
      },
      // 视觉引导线样式
      labelLine: {
        // 普通状态下视觉引导线的样式。
        normal: {
          // 是否显示视觉引导线。
          show: true,
          // 视觉引导线第一段的长度。
          length: 30,
          // 视觉引导项第二段的长度。
          length2: 20,
          // 线的样式
          lineStyle: {
            // 线的颜色。
            color: myChart.util.config.mainColor,
            // 回调函数。 d = data[i];
            // color: (d, i, data) => {
            //   return d.itemStyle.normal.color;
            // },
            // 线宽。
            width: 1,
            // 图形透明度。
            opacity: 1
          }
        }
      },
      // 饼图样式
      itemStyle: {
        // 默认状态下的样式
        normal: {
          // 图形的颜色。支持回调函数。
          color: myChart.util.defaultColor(pieIndex),
          // 颜色回调函数
          // color: (d,i,data) => myChart.util.defaultColor(pieIndex),
          // 图形的描边颜色。
          borderColor: myChart.util.config.mainColor,
          // 描边线宽。
          borderWidth: 0,
          // 图形透明度。
          opacity: 1
        }
      }
    };

    let currentpieOption = defaultpieOption;

    // 检查该数据是否已缓存
    if (Array.isArray(storageOption.data) && storageOption.data[pieIndex]) {
      currentpieOption = storageOption.data[pieIndex];
    }

    // option.data[i].label 缺失时取 option.label 的配置
    if (option.label) {
      pieOpt.label = pieOpt.label || {};
      pieOpt.label = myChart.util.ObjectDeepAssign(option.label, pieOpt.label);
    }

    // option.data[i].labelLine 缺失时取 option.labelLine 的配置
    if (option.labelLine) {
      pieOpt.labelLine = pieOpt.labelLine || {};
      pieOpt.labelLine = myChart.util.ObjectDeepAssign(option.labelLine, pieOpt.labelLine);
    }
    // option.data[i].itemStyle 缺失时取 option.itemStyle 的配置
    if (option.itemStyle) {
      pieOpt.itemStyle = pieOpt.itemStyle || {};
      pieOpt.itemStyle = myChart.util.ObjectDeepAssign(option.itemStyle, pieOpt.itemStyle);
    }

    // 补全option缺失的值
    myChart.util.ObjectDeepAssign(currentpieOption, pieOpt);
    // 给图例用
    currentpieOption.legendColor = currentpieOption.itemStyle.normal.color;
    return currentpieOption;
  }

  init() {
    var self = this;
    var myChart = self.myChart;
    myChart.grid
      .selectAll('g.pies')
      .data(new Array(1))
      .enter()
      .append('g')
      .classed('pies', true);

    myChart.grid
      .select('g.pies')
      .selectAll('g.pie-item')
      .data(myChart.option.series.pie)
      .exit()
      .remove();

    myChart.grid
      .select('g.pies')
      .selectAll('defs.surround-fonts')
      .data(new Array(1))
      .enter()
      .append('defs')
      .classed('surround-fonts', true);
    myChart.option.series.pie.forEach(function(pieOpt, pieIndex) {
      self._initSinglePie(pieOpt, pieIndex);
    });
  }

  /**
   * 绘制单个饼图
   * @param {object} pieOpt 该饼图的参数
   * @param {number} pieIndex 该饼图的索引
   * @memberof Pie
   */
  _initSinglePie(pieOpt, pieIndex) {
    const self = this;
    const drawPie = {
      pieOpt: pieOpt,
      pieIndex: pieIndex
    };
    self._initPieItem(drawPie);
    self._initBuilder(drawPie);
    self._initSurroundFonts(drawPie);
    self._initArcs(drawPie);
    self._initPath(drawPie);
    self._initLabelLine(drawPie);
    self._initLabel(drawPie);
  }

  /**
   * 绘制/更新 pie-item
   * @param {object} drawPie 绘制该饼图的配置
   * @memberof Pie
   */
  _initPieItem(drawPie) {
    const self = this;
    const myChart = self.myChart;
    const { pieOpt, pieIndex } = drawPie;
    const pieItem = myChart.grid
      .select('g.pies')
      .selectAll('g.pie-item#pie-item-' + pieIndex)
      .data(new Array(1));

    pieItem
      .enter()
      .append('g')
      .classed('pie-item', true)
      .attr('id', 'pie-item-' + pieIndex)
      .attr(
        'transform',
        'translate(' +
          myChart.width * myChart.util.PercentToFloat(pieOpt.center[0]) +
          ',' +
          myChart.height * myChart.util.PercentToFloat(pieOpt.center[1]) +
          ')'
      );

    // center
    pieItem
      .transition()
      .duration(myChart.util.config.transitionDurationTime)
      .attr(
        'transform',
        'translate(' +
          myChart.width * myChart.util.PercentToFloat(pieOpt.center[0]) +
          ',' +
          myChart.height * myChart.util.PercentToFloat(pieOpt.center[1]) +
          ')'
      );

    drawPie.pieItem = myChart.grid.select('g.pies').select('g.pie-item#pie-item-' + pieIndex);
  }

  /**
   * 创建饼图/扇形/玫瑰图生成器
   * @param {any} drawPie 绘制该饼图的配置
   * @memberof Pie
   */
  _initBuilder(drawPie) {
    const self = this;
    const myChart = self.myChart;
    // 该grid下允许绘制的最大的圆半径
    drawPie.totalRadius = Math.min(myChart.width, myChart.height) / 2;
    const { pieOpt, totalRadius } = drawPie;
    // value、padAngle
    drawPie.pieBuilder = d3
      .pie()
      .sort(null)
      .value(d => {
        return d.value;
      })
      .padAngle(myChart.util.PercentToFloat(pieOpt.padAngle));

    // radius
    drawPie.pathBuilder = d3
      .arc()
      .innerRadius(totalRadius * myChart.util.PercentToFloat(pieOpt.radius[0]))
      .outerRadius(totalRadius * myChart.util.PercentToFloat(pieOpt.radius[1]));

    // roseType
    if (pieOpt.roseType !== false) {
      const dataList = pieOpt.data.map(d => parseInt(d.value, 10));
      drawPie.roseLinear = d3
        .scaleLinear()
        .domain([0, d3.max(dataList)])
        .range([
          totalRadius * myChart.util.PercentToFloat(pieOpt.radius[0]),
          totalRadius * myChart.util.PercentToFloat(pieOpt.radius[1])
        ]);
    }
  }

  /**
   * 绘制/更新环绕字体所需的path
   * @param {object} drawPie 绘制该饼图的配置
   * @memberof Pie
   */
  _initSurroundFonts(drawPie) {
    const self = this;
    const myChart = self.myChart;
    const { pieOpt, pieIndex, pieBuilder, pathBuilder, roseLinear } = drawPie;

    // 环绕字体
    const surroundFonts = myChart.grid.select('g.pies').select('defs.surround-fonts');
    surroundFonts
      .selectAll('def.def#def-' + pieIndex)
      .data(new Array(1))
      .enter()
      .append('def')
      .classed('def', true)
      .attr('id', 'def-' + pieIndex);

    const def = surroundFonts.select('def.def#def-' + pieIndex);

    // 生成环绕字体的扇形区域
    const defPathParams = pieBuilder(pieOpt.data);
    defPathParams.forEach((d, i, propData) => {
      // 有padAngle时的偏移量
      propData[i].startAngle =
        d.startAngle + propData[propData.length - 1].endAngle * d.padAngle / propData.length / 2;
      // 360°
      propData[i].endAngle = d.startAngle + propData[propData.length - 1].endAngle;
    });

    const defPath = def.selectAll('path').data(defPathParams);

    // exit
    defPath.exit().remove();

    // enter & update
    defPath
      .enter()
      .append('path')
      .merge(defPath)
      .attr('id', (d, i) => 'def-path-' + pieIndex + '-' + i)
      .transition()
      .duration(myChart.util.config.transitionDurationTime)
      .attr('d', d => {
        if (!pieOpt.roseType === false) {
          pathBuilder.outerRadius(roseLinear(parseInt(d.value, 10)));
        }
        return pathBuilder(d);
      });
  }

  /**
   * 绘制/更新每个扇形的外层容器
   * @param {object} drawPie 绘制该饼图的配置
   * @memberof Pie
   */
  _initArcs(drawPie) {
    const { pieOpt, pieBuilder, pieItem } = drawPie;
    drawPie.arcsParams = pieBuilder(pieOpt.data);
    // 生成扇形
    drawPie.arcs = pieItem.selectAll('g.arc').data(drawPie.arcsParams);

    drawPie.arcs.exit().remove();

    drawPie.arcsEnter = drawPie.arcs.enter().append('g');
    drawPie.arcsEnter.merge(drawPie.arcs).attr('class', (d, i) => 'arc arc-' + i);
  }

  /**
   * 绘制/更新每个扇形的path
   * @param {object} drawPie 绘制该饼图的配置
   * @memberof Pie
   */
  _initPath(drawPie) {
    const self = this;
    const myChart = self.myChart;
    const { pieOpt, pathBuilder, roseLinear, arcs, arcsEnter, pieItem, arcsParams } = drawPie;
    // 生成扇形区域
    arcsEnter.append('path');

    pieItem
      .selectAll('g.arc')
      .selectAll('path')
      .nodes()
      .forEach((d, i) => {
        d3.select(d).data([arcsParams[i]]);
      });

    // 本次append的总角度
    const totalAngle = arcsEnter.nodes().reduce(function(sum, node) {
      const nodeData = node.__data__;
      return sum + (nodeData.endAngle - nodeData.startAngle);
    }, 0);
    // enter
    arcsEnter
      .selectAll('path')
      .style('fill', d => {
        const color = d.data.itemStyle.normal.color;
        if (typeof color === 'function') return color(d.data, d.index, pieOpt.data);
        return color;
      })
      .style('opacity', d => d.data.itemStyle.normal.opacity)
      .style('stroke', d => d.data.itemStyle.normal.borderColor)
      .style('stroke-width', d => d.data.itemStyle.normal.borderWidth + 'px')
      .transition()
      .delay(d => {
        const startDurationAngle = d.startAngle - arcsEnter.nodes()[0].__data__.startAngle;
        const delayTime =
          myChart.util.config.transitionDurationTime * (startDurationAngle / totalAngle);
        return delayTime;
      })
      .duration(d => {
        const durationAngle = d.endAngle - d.startAngle;
        const durationTime =
          myChart.util.config.transitionDurationTime * (durationAngle / totalAngle);
        return durationTime;
      })
      .ease(d3.easeLinear)
      .attrTween('d', function(d) {
        this._current = myChart.util.deepCopy(d);
        this._current.endAngle = this._current.startAngle;
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return t => {
          if (pieOpt.roseType !== false) {
            pathBuilder.outerRadius(roseLinear(parseInt(d.value, 10)));
          }
          return pathBuilder(interpolate(t));
        };
      });

    // update
    arcs
      .selectAll('path')
      .transition()
      .duration(myChart.util.config.transitionDurationTime)
      .style('fill', d => {
        const color = d.data.itemStyle.normal.color;
        if (typeof color === 'function') return color(d.data, d.index, pieOpt.data);
        return color;
      })
      .style('opacity', d => d.data.itemStyle.normal.opacity)
      .style('stroke', d => d.data.itemStyle.normal.borderColor)
      .style('stroke-width', d => d.data.itemStyle.normal.borderWidth + 'px')
      .attrTween('d', function(d) {
        this._current = this._current || d;
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return t => {
          if (pieOpt.roseType !== false) {
            pathBuilder.outerRadius(roseLinear(parseInt(d.value, 10)));
          }
          return pathBuilder(interpolate(t));
        };
      });
  }

  /**
   * 绘制/更新每个扇形的牵引线
   * @param {object} drawPie 绘制该饼图的配置
   * @memberof Pie
   */
  _initLabelLine(drawPie) {
    const self = this;
    const myChart = self.myChart;
    const { arcs, pieOpt, arcsEnter, pieItem, arcsParams } = drawPie;

    arcsEnter.append('polyline');
    pieItem
      .selectAll('g.arc')
      .selectAll('polyline')
      .nodes()
      .forEach((d, i) => {
        d3.select(d).data([arcsParams[i]]);
      });

    arcsEnter
      .merge(arcs)
      .selectAll('polyline')
      .transition()
      .duration(myChart.util.config.transitionDurationTime)
      .style('display', d => (d.data.labelLine.normal.show === false ? 'none' : 'inline'))
      .attrTween('points', function(d) {
        this._current = this._current || d;
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return t => self._polylineBuilder(interpolate(t), drawPie);
      })
      .style('fill', 'none')
      .style('stroke', d => {
        const color = d.data.labelLine.normal.lineStyle.color;
        if (typeof color === 'function') return color(d.data, d.index, pieOpt.data);
        return color;
      })
      .style('stroke-width', d => d.data.labelLine.normal.lineStyle.width + 'px')
      .style('opacity', d => d.data.labelLine.normal.lineStyle.opacity);
  }

  /**
   * 计算polyline的路径
   * @param {any} d 该polyline的data数据
   * @param {any} drawPie 绘制该饼图的配置
   * @returns 该polyline的points属性
   * @memberof Pie
   */
  _polylineBuilder(d, drawPie) {
    const self = this;
    const myChart = self.myChart;
    const { pieOpt, totalRadius, roseLinear } = drawPie;
    let arcOuterRadius = totalRadius * myChart.util.PercentToFloat(pieOpt.radius[1]);
    if (pieOpt.roseType !== false) {
      arcOuterRadius = roseLinear(parseInt(d.value, 10));
    }

    const point0Builder = d3
      .arc()
      .outerRadius(arcOuterRadius)
      .innerRadius(arcOuterRadius);
    const point0 = point0Builder.centroid(d);
    const point1Builder = d3
      .arc()
      .outerRadius(
        totalRadius * myChart.util.PercentToFloat(pieOpt.radius[1]) +
          parseInt(d.data.labelLine.normal.length, 10)
      )
      .innerRadius(
        totalRadius * myChart.util.PercentToFloat(pieOpt.radius[1]) +
          parseInt(d.data.labelLine.normal.length, 10)
      );

    const point1 = point1Builder.centroid(d);
    const base = self._midAngle(d) < Math.PI ? 1 : -1;
    const point2 = [point1[0] + parseInt(d.data.labelLine.normal.length2, 10) * base, point1[1]];
    return [point0, point1, point2];
  }

  /**
   * 绘制/更新每个扇形的文本标签
   * @param {object} drawPie 绘制该饼图的配置
   * @memberof Pie
   */
  _initLabel(drawPie) {
    const self = this;
    const myChart = self.myChart;
    const { arcs, arcsEnter, pieOpt, pieIndex, arcsParams, pieItem, totalRadius } = drawPie;

    arcsEnter.append('text');
    pieItem
      .selectAll('g.arc')
      .selectAll('text')
      .nodes()
      .forEach((d, i) => {
        d3.select(d).data([arcsParams[i]]);
      });

    arcsEnter
      .merge(arcs)
      .selectAll('text')
      .html(d => {
        const name = d.data.label.normal.formatter(d.data, d.index, pieOpt.data);
        if (self._judgeHasPolyline(d)) {
          var textPath = '<textPath ';
          textPath += 'xlink:href="#def-path-' + pieIndex + '-' + d.index + '">';
          textPath += name;
          textPath += '</textPath>';
          return textPath;
        }
        return name;
      })
      .transition()
      .duration(myChart.util.config.transitionDurationTime)
      .style('display', d => (d.data.label.normal.show === false ? 'none' : 'inline'))
      .attr('transform', d => {
        if (self._judgeHasPolyline(d)) {
          return '';
        }
        const labelBuilder = d3
          .arc()
          .outerRadius(
            totalRadius * myChart.util.PercentToFloat(pieOpt.radius[1]) +
              parseInt(d.data.labelLine.normal.length, 10)
          )
          .innerRadius(
            totalRadius * myChart.util.PercentToFloat(pieOpt.radius[1]) +
              parseInt(d.data.labelLine.normal.length, 10)
          );
        const basePoint = labelBuilder.centroid(d);

        const base = self._midAngle(d) < Math.PI ? 1 : -1;
        const offsetPoint = [
          basePoint[0] + (parseInt(d.data.labelLine.normal.length2, 10) + 4) * base,
          basePoint[1]
        ];
        return 'translate(' + offsetPoint + ')';
      })
      .style('text-anchor', function(d) {
        if (self._judgeHasPolyline(d)) {
          return '';
        }
        return self._midAngle(d) < Math.PI ? 'start' : 'end';
      })
      .attr('dy', function(d) {
        if (self._judgeHasPolyline(d)) {
          return '-0.35em';
        }
        return '0.35em';
      })
      .style('fill', d => {
        const color = d.data.label.normal.color;
        if (typeof color === 'function') return color(d.data, d.index, pieOpt.data);
        return color;
      })
      .style('font-size', d => d.data.label.normal.fontSize + 'px')
      .style('font-family', d => d.data.label.normal.fontFamily)
      .style('font-style', d => d.data.label.normal.fontStyle)
      .style('font-weight', d => d.data.label.normal.fontWeight);
  }

  /**
   * 计算扇形中间位置的角度
   * @param {object} d 扇形参数
   * @returns 扇形中间位置的角度
   * @memberof Pie
   */
  _midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }

  /**
   * 是否需要polyline
   * @param {object} d 扇形参数
   * @returns true | false
   * @memberof Pie
   */
  _judgeHasPolyline(d) {
    if (
      d.data.labelLine.normal.show === false ||
      (parseInt(d.data.labelLine.normal.length, 10) === 0 &&
        parseInt(d.data.labelLine.normal.length2, 10) === 0)
    ) {
      return true;
    }
    return false;
  }
}

export default Pie;
