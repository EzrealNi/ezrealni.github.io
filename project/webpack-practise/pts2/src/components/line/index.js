/*
 * @Author: xinni
 * @Date: 2017-12-01 10:37:17
 * @Last Modified by: xinni
 * @Last Modified time: 2017-12-15 11:04:29
 */

import './line.scss';
import * as d3 from 'd3';

class Line {
  constructor(myChart) {
    this.myChart = myChart;
  }

  /**
   * 参数验证与缓存
   * @param {array} options 该种类型图形的数据集合
   * @memberof Line
   */
  validate(options = []) {
    const self = this;
    const myChart = self.myChart;
    options.forEach((option, index) => {
      options[index] = self._validateOption(option, index);
    });
    myChart.option.series = myChart.option.series || {};
    myChart.option.series.line = options;
  }

  /**
   * 参数验证与缓存
   * @param {object} option 该种类型图形的数据
   * @param {number} index 该数据的索引值
   * @memberof Line
   */
  _validateOption(option, index) {
    const self = this;
    const myChart = self.myChart;
    const defaultOption = {
      // 图形类型
      type: 'line',
      // 系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
      name: 'line-' + index,
      // 使用的 x 轴的 index，在单个图表实例中存在多个 x 轴的时候有用。
      xAxisIndex: 0,
      // 使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用。
      yAxisIndex: 0,
      // 是否平滑曲线显示。
      smooth: false,
      // 折线拐点的大小
      symbolSize: 8,
      // 折线拐点标志的样式。
      itemStyle: {
        // normal 是图形在默认状态下的样式
        normal: {
          // 点的颜色。 默认取lineStyle.normal.color。
          color: null,
          // color渐变色
          // color: {
          //   type: 'linear',
          //   x: '0%',
          //   y: '0%',
          //   x2: '0%',
          //   y2: '100%',
          //   colorStops: [
          //     {
          //       offset: 0,
          //       color: '#4CAF50',
          //       opacity: 1 // 0% 处的颜色
          //     },
          //     {
          //       offset: 1,
          //       color: '#00897B',
          //       opacity: 1 // 100% 处的颜色
          //     }
          //   ]
          // },
          // 图形的描边颜色。
          borderColor: '#000',
          // 描边线宽。为 0 时无描边。
          borderWidth: 0,
          // 图形透明度。
          opacity: 1
        }
      },
      // 线的样式
      lineStyle: {
        normal: {
          // 线的颜色。 默认从全局调色盘 util.defaultColor 获取颜色。支持渐变色。
          color: myChart.util.defaultColor(index),
          // color渐变色
          // color: {
          //   type: 'linear',
          //   x: '0%',
          //   y: '0%',
          //   x2: '0%',
          //   y2: '100%',
          //   colorStops: [
          //     {
          //       offset: 0,
          //       color: '#4CAF50',
          //       opacity: 1 // 0% 处的颜色
          //     },
          //     {
          //       offset: 1,
          //       color: '#00897B',
          //       opacity: 1 // 100% 处的颜色
          //     }
          //   ]
          // },
          // 线宽。
          width: 2,
          // 图形透明度。
          opacity: 1
        }
      },
      // 区域样式
      areaStyle: {
        normal: {
          // 线的颜色。 默认无即不渲染。
          color: null,
          // color渐变色
          // color: {
          //   type: 'linear',
          //   x: '0%',
          //   y: '0%',
          //   x2: '0%',
          //   y2: '100%',
          //   colorStops: [
          //     {
          //       offset: 0,
          //       color: '#4CAF50',
          //       opacity: 1 // 0% 处的颜色
          //     },
          //     {
          //       offset: 1,
          //       color: '#00897B',
          //       opacity: 1 // 100% 处的颜色
          //     }
          //   ]
          // },
          opacity: 0.5
        }
      },
      // 系列中的数据内容数组。数组项通常为具体的数据项。
      // 每一项为该单位对应的值或者object，长度应与xAxis.data.length 一致。
      // 当每一项为object时，需与formatter属性配合指定value值。
      // eg: data:[{amount:222,unit:'km'},{amount:333,unit:'km'},{amount:233,unit:'km'}]
      // formatter: (d,i) => d.amount
      data: [],
      formatter: (d, i) => d.value
    };

    let currentOption = defaultOption;
    // 检查该数据是否已缓存
    if (myChart.option.series && Array.isArray(myChart.option.series.line)) {
      for (let i = 0; i < myChart.option.series.line.length; i++) {
        if (myChart.option.series.line[i].name === option.name) {
          myChart.option.series.line[i].data = [];
          currentOption = myChart.option.series.line[i];
          break;
        }
      }
    }

    if (option.name === undefined) {
      option.name = 'line-' + index;
    }

    // 补全option缺失的值
    myChart.util.ObjectDeepAssign(currentOption, option);

    // xAxisIndex对应的x轴不存在时取最后一条x轴
    if (currentOption.xAxisIndex > myChart.option.xAxis.length - 1) {
      currentOption.xAxisIndex = myChart.option.xAxis.length - 1;
    }
    // yAxisIndex对应的y轴不存在时取最后一条y轴
    if (currentOption.yAxisIndex > myChart.option.yAxis.length - 1) {
      currentOption.yAxisIndex = myChart.option.yAxis.length - 1;
    }

    // 生成渐变色
    if (myChart.util.isObject(currentOption.lineStyle.normal.color)) {
      currentOption.lineStyle.normal.color = myChart.util.initLinearGradient(
        currentOption.lineStyle.normal.color
      );
    }

    if (currentOption.itemStyle.normal.color === null) {
      currentOption.itemStyle.normal.color = currentOption.lineStyle.normal.color;
    }

    // 生成渐变色
    if (myChart.util.isObject(currentOption.itemStyle.normal.color)) {
      currentOption.itemStyle.normal.color = myChart.util.initLinearGradient(
        currentOption.itemStyle.normal.color
      );
    }

    // 生成渐变色
    if (myChart.util.isObject(currentOption.areaStyle.normal.color)) {
      currentOption.areaStyle.normal.color = myChart.util.initLinearGradient(
        currentOption.areaStyle.normal.color
      );
    }

    // 给图例用
    currentOption.legendColor = currentOption.lineStyle.normal.color;

    // 处理data
    currentOption.dataSource = currentOption.data;
    currentOption.data = currentOption.dataSource.map((d, i) => {
      if (myChart.util.isObject(d)) {
        return currentOption.formatter(d, i);
      }
      return d;
    });

    return currentOption;
  }

  init() {
    var self = this;
    var myChart = self.myChart;
    myChart.grid
      .selectAll('g.lines')
      .data(new Array(1))
      .enter()
      .append('g')
      .classed('lines', true);
    myChart.option.series.line.forEach(function(lineOpt, lineIndex) {
      self._initSingleLine(lineOpt, lineIndex);
    });

    myChart.grid
      .select('g.lines')
      .selectAll('g.line-item.last')
      .remove();

    myChart.grid
      .select('g.lines')
      .selectAll('g.line-item')
      .classed('last', true);
  }

  _initSingleLine(lineOpt, lineIndex) {
    const self = this;
    const myChart = self.myChart;
    const lineName = myChart.util.AsciiToUnicode(lineOpt.name);

    const _x = (d, i) => {
      const xSacle = myChart.xScale[lineOpt.xAxisIndex];
      const xAxisOpt = myChart.option.xAxis[lineOpt.xAxisIndex];
      let x = xSacle(xAxisOpt.data[i]);
      if (xAxisOpt.type !== 'value') {
        x += myChart.xScale[lineOpt.xAxisIndex].bandwidth() / 2;
      }
      return x;
    };

    const _y = function(d, i) {
      return myChart.yScale[lineOpt.yAxisIndex](d);
    };
    const lineBuilder = d3
      .line()
      .x(_x)
      .y(_y);

    if (lineOpt.smooth === true) {
      lineBuilder.curve(d3.curveMonotoneX);
    }

    myChart.grid
      .select('g.lines')
      .selectAll('g.line-item#line-item' + lineName)
      .data(new Array(1))
      .enter()
      .append('g')
      .classed('line-item', true)
      .attr('id', 'line-item' + lineName);

    const lineItem = myChart.grid
      .select('g.lines')
      .select('g.line-item#line-item' + lineName)
      .classed('last', false);

    const line = lineItem.selectAll('path.line').data(new Array(1));

    // exit
    line.exit().remove();

    // enter
    line
      .enter()
      .datum(lineOpt.data)
      .append('path')
      .classed('line', true)
      .style('fill', 'none')
      .style(
        'stroke',
        Array.isArray(lineOpt.lineStyle.normal.color)
          ? lineOpt.lineStyle.normal.color[0]
          : lineOpt.lineStyle.normal.color
      )
      .style('stroke-width', lineOpt.lineStyle.normal.width)
      .style('opacity', lineOpt.lineStyle.normal.opacity)
      .attr('d', lineBuilder)
      .style('stroke-dasharray', function() {
        return this.getTotalLength !== undefined ? this.getTotalLength() : 2000;
      })
      .style('stroke-dashoffset', function() {
        return this.getTotalLength !== undefined ? this.getTotalLength() : 2000;
      })
      .transition()
      .duration(myChart.util.config.transitionDurationTime)
      .ease(d3.easeExpInOut)
      .style('stroke-dashoffset', 0);

    // update
    line
      .datum(lineOpt.data)
      .style('stroke-dasharray', 0)
      .transition()
      .duration(myChart.util.config.transitionDurationTime)
      .ease(d3.easeExpInOut)
      .style('fill', 'none')
      .style(
        'stroke',
        Array.isArray(lineOpt.lineStyle.normal.color)
          ? lineOpt.lineStyle.normal.color[0]
          : lineOpt.lineStyle.normal.color
      )
      .style('stroke-width', lineOpt.lineStyle.normal.width)
      .style('opacity', lineOpt.lineStyle.normal.opacity)
      .attr('d', lineBuilder);

    lineItem
      .selectAll('g.nodes')
      .data(new Array(1))
      .enter()
      .append('g')
      .classed('nodes', true);

    let nodes = lineItem
      .select('g.nodes')
      .selectAll('circle.node')
      .data(lineOpt.data);

    nodes.exit().remove();

    nodes
      .enter()
      .append('circle')
      .classed('node', true)
      .attr('cx', _x)
      .attr('cy', _y)
      .attr(
        'fill',
        Array.isArray(lineOpt.itemStyle.normal.color)
          ? lineOpt.itemStyle.normal.color[0]
          : lineOpt.itemStyle.normal.color
      )
      .attr('stroke', lineOpt.itemStyle.normal.borderColor)
      .attr('stroke-width', lineOpt.itemStyle.normal.borderWidth)
      .attr('opacity', lineOpt.itemStyle.normal.opacity)
      .attr('r', 0);

    nodes = lineItem.select('g.nodes').selectAll('circle.node');

    nodes
      .transition()
      .duration(myChart.util.config.transitionDurationTime)
      .ease(d3.easeExpInOut)
      .attr('cx', _x)
      .attr('cy', _y)
      .attr(
        'fill',
        Array.isArray(lineOpt.itemStyle.normal.color)
          ? lineOpt.itemStyle.normal.color[0]
          : lineOpt.itemStyle.normal.color
      )
      .attr('stroke', lineOpt.itemStyle.normal.borderColor)
      .attr('stroke-width', lineOpt.itemStyle.normal.borderWidth)
      .attr('opacity', lineOpt.itemStyle.normal.opacity)
      .attr('r', lineOpt.symbolSize);

    if (lineOpt.areaStyle.normal.color !== null) {
      const areaBuilder = d3
        .area()
        .x(_x)
        .y1(_y)
        .y0(myChart.yScale[lineOpt.yAxisIndex](0));

      if (lineOpt.smooth === true) {
        areaBuilder.curve(d3.curveMonotoneX);
      }

      const area = lineItem.selectAll('path.area').data(new Array(1));

      area.exit().remove();

      area
        .enter()
        .datum(lineOpt.data)
        .append('path')
        .classed('area', true)
        .attr('d', areaBuilder)
        .style(
          'fill',
          Array.isArray(lineOpt.areaStyle.normal.color)
            ? lineOpt.areaStyle.normal.color[0]
            : lineOpt.areaStyle.normal.color
        )
        .style('opacity', 0)
        .transition()
        .duration(myChart.util.config.transitionDurationTime)
        .ease(d3.easeExpInOut)
        .style('opacity', lineOpt.areaStyle.normal.opacity);

      area
        .datum(lineOpt.data)
        .style(
          'fill',
          Array.isArray(lineOpt.areaStyle.normal.color)
            ? lineOpt.areaStyle.normal.color[0]
            : lineOpt.areaStyle.normal.color
        )
        .transition()
        .duration(myChart.util.config.transitionDurationTime)
        .ease(d3.easeExpInOut)
        .attr('d', areaBuilder)
        .style('opacity', lineOpt.areaStyle.normal.opacity);
    }
  }
}
export default Line;
