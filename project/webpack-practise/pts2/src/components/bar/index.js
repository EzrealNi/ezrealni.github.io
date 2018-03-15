/*
 * @Author: xinni
 * @Date: 2017-11-28 13:37:44
 * @Last Modified by: xinni
 * @Last Modified time: 2018-03-05 18:09:34
 */
import './bar.scss';
import * as d3 from 'd3';

class Bar {
  constructor(myChart) {
    this.myChart = myChart;
  }

  /**
   * 参数验证与缓存
   * @param {array} options 该种类型图形的数据集合
   * @memberof Bar
   */
  validate(options = []) {
    const self = this;
    const myChart = self.myChart;
    // 记录bar的位置数据(根据轴)
    self.barGapData = {};
    options.forEach((option, index) => {
      options[index] = self.__validateOption(option, index, options.length);
    });
    myChart.option.series = myChart.option.series || {};
    myChart.option.series.bar = options;
    self.__countBarGapData();
  }

  /**
   * 参数验证与缓存
   * @param {object} option 该种类型图形的数据
   * @param {number} index 该数据的索引值
   * @param {number} length 数组长度
   * @memberof Bar
   */
  __validateOption(option, index, length) {
    const self = this;
    const myChart = self.myChart;
    const defaultOption = {
      // 图形类型
      type: 'bar',
      // 系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
      name: 'bar-' + index,
      // 柱形上的值标注
      markPoint: {
        // 是否显示
        show: false,
        // 标注背景形状
        symbol: 'rect',
        // 标注背景尺寸
        symbolSize: [30, 20],
        // 标注偏移量 [x,y]
        symbolOffset: [0, 0],
        // 标注文本控制
        label: {
          normal: {
            // 文字的颜色。
            color: myChart.util.config.mainColor,
            // 文字字体的风格  'normal'|'italic'|'oblique'
            fontStyle: 'normal',
            // 文字字体的粗细 'normal'|'bold'|'bolder'|'lighter'|100 | 200 | 300 | 400...
            fontWeight: 'normal',
            // 文字的字体系列 'serif' , 'monospace', 'Arial', 'Courier New', 'Microsoft YaHei', ...
            fontFamily: 'sans-serif',
            // 文字的字体大小
            fontSize: 12,
            // 标签内容格式器
            // d-当前个体图形的数据 i-当前个体图形的索引值 data-当前图形的数据形成的数组
            formatter: (d, i, data) => d
          }
        },
        // 标注的样式。
        itemStyle: {
          normal: {
            // 图形的颜色。
            color: '#051c22',
            // 图形的描边颜色。
            borderColor: 'transparent',
            // 描边线宽。
            borderWidth: 0,
            // 图形透明度。
            opacity: 1
          }
        }
      },
      // 使用的 x 轴的 index，在单个图表实例中存在多个 x 轴的时候有用。
      xAxisIndex: 0,
      // 使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用。
      yAxisIndex: 0,
      // 图形样式
      itemStyle: {
        // normal 是图形在默认状态下的样式
        normal: {
          // 柱条的颜色。 默认从全局调色盘 util.defaultColor 获取颜色。支持渐变色。支持回调函数。
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
          //       opacity: 0.5 // 0% 处的颜色
          //     },
          //     {
          //       offset: 1,
          //       color: '#00897B',
          //       opacity: 0.8 // 100% 处的颜色
          //     }
          //   ]
          // },
          // color回调函数。
          // color: (d, i, nodes)=> {
          //   return i > 5 ? '#ff0000' : '#000';
          // }
          // 柱条的描边颜色。
          borderColor: '#000',
          // 柱条的描边宽度，默认不描边。
          borderWidth: 0,
          // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
          opacity: 1
        }
      },
      // 柱条的宽度，不设时自适应。支持设置成相对于类目宽度的百分比。
      barWidth: 1 / (length * 2),
      // 柱间距离，可设百分比（如 '30%'，表示柱子宽度的 30%）。
      // 如果想要两个系列的柱子重叠，可以设置 barGap 为 '-100%'。这在用柱子做背景的时候有用。
      // 在同一坐标系上，此属性会被多个 'bar' 系列共享。此属性应设置于此坐标系中最后一个 'bar' 系列上才会生效，并且是对此坐标系中所有 'bar' 系列生效。
      barGap: '30%',
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
    if (myChart.option.series && Array.isArray(myChart.option.series.bar)) {
      for (let i = 0; i < myChart.option.series.bar.length; i++) {
        if (myChart.option.series.bar[i].name === option.name) {
          myChart.option.series.bar[i].data = [];
          currentOption = myChart.option.series.bar[i];
          break;
        }
      }
    }

    if (option.name === undefined) {
      option.name = 'bar-' + index;
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
    if (myChart.util.isObject(currentOption.itemStyle.normal.color)) {
      currentOption.itemStyle.normal.color = myChart.util.initLinearGradient(
        currentOption.itemStyle.normal.color
      );
    }

    // 生成barGapData 以计算barGap
    if (myChart.option['xAxis'][currentOption.xAxisIndex].type === 'category') {
      self.barGapData.xAxis = self.barGapData.xAxis || {};
      if (self.barGapData.xAxis[currentOption.xAxisIndex] === undefined) {
        self.barGapData.xAxis[currentOption.xAxisIndex] = {
          barGap: myChart.util.PercentToFloat(currentOption.barGap)
        };
      }
    } else if (myChart.option['yAxis'][currentOption.yAxisIndex].type === 'category') {
      self.barGapData.yAxis = self.barGapData.yAxis || {};

      if (self.barGapData.yAxis[currentOption.yAxisIndex] === undefined) {
        self.barGapData.yAxis[currentOption.yAxisIndex] = {
          barGap: myChart.util.PercentToFloat(currentOption.barGap)
        };
      }
    }
    // 给图例用
    currentOption.legendColor = currentOption.itemStyle.normal.color;

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

  /**
   * 生成barGapData
   * 根据barGapData.xAxis || barGapData.yAxis判断图形是否旋转
   * barGapData: {
   *   xAxis: {
   *     0: {
   *       barGap: 0.5,
   *       barWidths: [0.1, 0.2, 0.3],
   *       barGaps: [0.05, 0.1, 0.15],
   *       barStarts: [0.05, 0.2, 0.5]
   *     }
   *   }
   * };
   * @memberof Bar
   */
  __countBarGapData() {
    const self = this;
    const myChart = self.myChart;
    myChart.option.series.bar.forEach(option => {
      self.__countBarPosition(option, 'xAxis');
      self.__countBarPosition(option, 'yAxis');
    });
  }

  /**
   * 计算柱形的位置信息
   * @param {object} option 单个bar的配置
   * @param {string} axisType 轴类型
   * @memberof Bar
   */
  __countBarPosition(option, axisType) {
    const self = this;
    const myChart = self.myChart;
    const axisIndex = axisType + 'Index';
    if (
      myChart.option[axisType].length > 0 &&
      myChart.option[axisType][option[axisIndex]].type === 'category'
    ) {
      const barGapObj = self.barGapData[axisType][option[axisIndex]];
      barGapObj.barWidths = barGapObj.barWidths || [];
      barGapObj.barGaps = barGapObj.barGaps || [];
      // 柱形宽度占类目宽度的比例
      barGapObj.barWidths.push(myChart.util.PercentToFloat(option.barWidth));
      // 柱形间隔占类目宽度的比例
      barGapObj.barGaps.push(myChart.util.PercentToFloat(option.barWidth) * barGapObj.barGap);
    }
  }

  /**
   * 计算barStarts
   * @param {object} barPosition bar的位置信息
   * {
   *  barGap: 0.5,
   *  barWidths: [0.1, 0.2, 0.3],
   *  barGaps: [0.05, 0.1, 0.15],
   *  barStarts: [0.05, 0.2, 0.5]
   * }
   * @memberof Bar
   */
  __countBarStarts(barPosition) {
    const totalBarWidth = d3.sum(barPosition.barWidths);
    const totalBarGap =
      d3.sum(barPosition.barGaps) - barPosition.barGaps[barPosition.barGaps.length - 1];
    // 左间距 使图形居中
    const paddingLeft = (1 - totalBarWidth - totalBarGap) / 2;
    barPosition.barStarts = [];
    Object.keys(barPosition.barWidths).forEach((barWidth, index) => {
      let currentBarStart;
      if (index === 0) {
        currentBarStart = paddingLeft;
      } else {
        const preBarStart = barPosition.barStarts[index - 1];
        const preBarWidth = barPosition.barWidths[index - 1];
        const preBarGap = barPosition.barGaps[index - 1];
        currentBarStart = preBarStart + preBarWidth + preBarGap;
      }
      barPosition.barStarts.push(currentBarStart);
    });
  }

  /**
   * 渲染
   * @memberof Bar
   */
  init() {
    this.__initBars();
  }

  /**
   * 渲染柱形图
   * @memberof Bar
   */
  __initBars() {
    const self = this;
    const myChart = self.myChart;
    myChart.grid
      .selectAll('g.bars')
      .data(new Array(1))
      .enter()
      .append('g')
      .classed('bars', true);

    // 计算该bar在该axis上的索引
    const axisIndex = {};
    myChart.option.series.bar.forEach((option, index) => {
      axisIndex[option.xAxisIndex] = axisIndex[option.xAxisIndex] || 0;
      self.__initSingleBar(option, axisIndex[option.xAxisIndex]);
      axisIndex[option.xAxisIndex]++;
    });

    // 本次未改动的删掉(手动exit()部分)
    myChart.grid
      .select('g.bars')
      .selectAll('g.bar-item.last')
      .remove();

    myChart.grid
      .select('g.bars')
      .selectAll('g.bar-item')
      .classed('last', true);
  }

  /**
   * 渲染单个类目的柱形图
   * @param {object} option 配置参数
   * @param {number} index 索引
   * @memberof Bar
   */
  __initSingleBar(option, index) {
    const self = this;
    const myChart = self.myChart;
    const itemName = myChart.util.AsciiToUnicode(option.name);
    myChart.grid
      .select('g.bars')
      .selectAll('g.bar-item#bar-item' + itemName)
      .data(new Array(1))
      .enter()
      .append('g')
      .classed('bar-item', true)
      .attr('id', 'bar-item' + itemName, true);

    const barItem = myChart.grid
      .select('g.bars')
      .select('g.bar-item#bar-item' + itemName)
      .classed('last', false);
    const barsAttribute = self.__countBarsAttribute(option, index);

    let bars = barItem.selectAll('rect.bar').data(barsAttribute);
    bars.exit().remove();

    bars
      .enter()
      .append('rect')
      .classed('bar', true)
      .attr('width', d => d.width)
      .attr('height', 0)
      .style('fill', d => d.fill)
      .style('stroke', d => d.stroke)
      .style('stroke-width', d => d.strokeWidth)
      .style('opacity', d => d.opacity)
      .attr('x', d => d.x)
      .attr('y', myChart.yScale[option.yAxisIndex](0));

    bars = barItem.selectAll('rect.bar');
    bars
      .transition()
      .duration(myChart.util.config.transitionDurationTime)
      .ease(d3.easeExpInOut)
      .attr('width', d => d.width)
      .attr('height', d => d.height)
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .style('fill', d => d.fill)
      .style('stroke', d => d.stroke)
      .style('stroke-width', d => d.strokeWidth)
      .style('opacity', d => d.opacity);

    if (option.markPoint.show === true) {
      const barMarkPoints = barItem.selectAll('rect.bar-mark-point').data(barsAttribute);
      barMarkPoints.exit().remove();

      // enter opacity 0 ==> 1
      barMarkPoints
        .enter()
        .append('rect')
        .classed('bar-mark-point', true)
        .attr('width', option.markPoint.symbolSize[0])
        .attr('height', option.markPoint.symbolSize[1])
        .style('fill', option.markPoint.itemStyle.normal.color)
        .style('stroke', option.markPoint.itemStyle.normal.borderColor)
        .style('stroke-width', option.markPoint.itemStyle.normal.borderWidth)
        .style('opacity', 0)
        .attr('x', d => {
          const markPointX =
            d.x - (option.markPoint.symbolSize[0] - d.width) / 2 + option.markPoint.symbolOffset[0];
          return markPointX;
        })
        .attr('y', d => {
          const defaultOffset = 5;
          const offset = option.markPoint.symbolOffset[1] + defaultOffset;
          let markPointY = 0;
          if (d.value < 0) {
            markPointY = d.y + d.height + offset;
          } else {
            markPointY = d.y - option.markPoint.symbolSize[1] - offset;
          }
          return markPointY;
        })
        .transition()
        .delay(myChart.util.config.transitionDurationTime / 2)
        .duration(myChart.util.config.transitionDurationTime)
        .ease(d3.easeExpInOut)
        .style('opacity', option.markPoint.itemStyle.normal.opacity);

      // update
      barMarkPoints
        .style('opacity', 0)
        .attr('width', option.markPoint.symbolSize[0])
        .attr('height', option.markPoint.symbolSize[1])
        .style('fill', option.markPoint.itemStyle.normal.color)
        .style('stroke', option.markPoint.itemStyle.normal.borderColor)
        .style('stroke-width', option.markPoint.itemStyle.normal.borderWidth)
        .attr('x', d => {
          const markPointX =
            d.x - (option.markPoint.symbolSize[0] - d.width) / 2 + option.markPoint.symbolOffset[0];
          return markPointX;
        })
        .attr('y', d => {
          const defaultOffset = 5;
          const offset = option.markPoint.symbolOffset[1] + defaultOffset;
          let markPointY = 0;
          if (d.value < 0) {
            markPointY = d.y + d.height + offset;
          } else {
            markPointY = d.y - option.markPoint.symbolSize[1] - offset;
          }
          return markPointY;
        })
        .transition()
        .delay(myChart.util.config.transitionDurationTime / 2)
        .duration(myChart.util.config.transitionDurationTime)
        .ease(d3.easeExpInOut)
        .style('opacity', option.markPoint.itemStyle.normal.opacity);

      const barMarkPointLabels = barItem.selectAll('text.bar-mark-point-label').data(barsAttribute);
      barMarkPointLabels.exit().remove();

      // enter opacity 0==>1
      barMarkPointLabels
        .enter()
        .append('text')
        .classed('bar-mark-point-label', true)
        .text((d, i) => option.markPoint.label.normal.formatter(d.value, i, option.data))
        .style('fill', option.markPoint.label.normal.color)
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'middle')
        .style('font-family', option.markPoint.label.normal.fontFamily)
        .style('font-weight', option.markPoint.label.normal.fontWeight)
        .style('font-style', option.markPoint.label.normal.fontStyle)
        .style('font-size', option.markPoint.label.normal.fontSize)
        .attr('transform', d => {
          const translateX = d.x + d.width / 2;
          const defaultOffset = 5;
          const offset = option.markPoint.symbolOffset[1] + defaultOffset;
          let markPointY = 0;
          if (d.value < 0) {
            markPointY = d.y + d.height + offset + option.markPoint.symbolSize[1] / 2;
          } else {
            markPointY = d.y - offset - option.markPoint.symbolSize[1] / 2;
          }
          return 'translate(' + translateX + ',' + markPointY + ')';
        })
        .style('opacity', 0)
        .transition()
        .delay(myChart.util.config.transitionDurationTime / 2)
        .duration(myChart.util.config.transitionDurationTime)
        .ease(d3.easeExpInOut)
        .style('opacity', 1);

      // update
      barMarkPointLabels
        .text((d, i) => option.markPoint.label.normal.formatter(d.value, i, option.data))
        .style('fill', option.markPoint.label.normal.color)
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'middle')
        .style('font-family', option.markPoint.label.normal.fontFamily)
        .style('font-weight', option.markPoint.label.normal.fontWeight)
        .style('font-style', option.markPoint.label.normal.fontStyle)
        .style('font-size', option.markPoint.label.normal.fontSize)
        .attr('transform', d => {
          const translateX = d.x + d.width / 2;
          const defaultOffset = 5;
          const offset = option.markPoint.symbolOffset[1] + defaultOffset;
          let markPointY = 0;
          if (d.value < 0) {
            markPointY = d.y + d.height + offset + option.markPoint.symbolSize[1] / 2;
          } else {
            markPointY = d.y - offset - option.markPoint.symbolSize[1] / 2;
          }
          return 'translate(' + translateX + ',' + markPointY + ')';
        })
        .style('opacity', 0)
        .transition()
        .delay(myChart.util.config.transitionDurationTime / 2)
        .duration(myChart.util.config.transitionDurationTime)
        .ease(d3.easeExpInOut)
        .style('opacity', 1);
    } else {
      barItem.selectAll('rect.bar-mark-point').remove();
      barItem.selectAll('text.bar-mark-point-label').remove();
    }
  }

  /**
   * 计算绘制柱形图的参数
   * @param {object} option 配置参数
   * @param {number} index 索引
   * @returns {array} 柱形图的参数对象数组
   * @memberof Bar
   */
  __countBarsAttribute(option, index) {
    const self = this;
    const myChart = self.myChart;
    // 当x轴为value y轴为category时绘图旋转90度
    let axisRotate = false;
    const configXScale = myChart.xScale[option.xAxisIndex];
    const configYScale = myChart.yScale[option.yAxisIndex];
    const configXAxis = myChart.option.xAxis[option.xAxisIndex];
    const configYAxis = myChart.option.yAxis[option.yAxisIndex];

    if (configXAxis.type !== 'category' && configYAxis.type === 'category') {
      axisRotate = true;
    }

    const xScale = axisRotate ? configYScale : configXScale;
    const xAxis = axisRotate ? configYAxis : configXAxis;
    const yScale = axisRotate ? configXScale : configYScale;
    const yAxis = axisRotate ? configXAxis : configYAxis;
    const barPosition = axisRotate
      ? self.barGapData.yAxis[option.yAxisIndex]
      : self.barGapData.xAxis[option.xAxisIndex];
    const barsAttribute = option.data.map((d, i, data) => {
      const barAttribute = {
        value: d,
        rotate: axisRotate,
        xAxis: xAxis,
        yAxis: yAxis,
        xScale: xScale,
        yScale: yScale
      };

      // width
      barAttribute.width =
        barAttribute.xScale.step() * myChart.util.PercentToFloat(option.barWidth);

      // height
      barAttribute.height =
        d < 0
          ? barAttribute.yScale(d) - barAttribute.yScale(0)
          : barAttribute.yScale(0) - barAttribute.yScale(d);

      if (axisRotate) {
        [barAttribute.width, barAttribute.height] = [barAttribute.height, barAttribute.width];
      }

      // fill
      if (typeof option.itemStyle.normal.color === 'function') {
        barAttribute.fill = option.itemStyle.normal.color(d, i, data);
      } else if (Array.isArray(option.itemStyle.normal.color)) {
        barAttribute.fill = option.itemStyle.normal.color[0];
      } else {
        barAttribute.fill = option.itemStyle.normal.color;
      }

      // stroke
      barAttribute.stroke = option.itemStyle.normal.borderColor;

      // stroke-width
      barAttribute.strokeWidth = option.itemStyle.normal.borderWidth;

      // opacity
      barAttribute.opacity = option.itemStyle.normal.opacity;

      // x
      const scaleX = barAttribute.xScale(xAxis.data[i]);
      if (!barPosition.hasOwnProperty('barStarts')) {
        self.__countBarStarts(barPosition);
      }
      // 偏移长度
      const offsetX = barPosition.barStarts[index] * barAttribute.xScale.step();
      // 实际x
      let x = scaleX + offsetX;
      // boundaryGap: false
      if (barAttribute.xScale.bandwidth() === 0) {
        x -= barAttribute.xScale.step() / 2;
      }
      barAttribute.x = x;

      // y
      barAttribute.y = d < 0 ? barAttribute.yScale(0) : barAttribute.yScale(d);

      return barAttribute;
    });
    return barsAttribute;
  }
}

export default Bar;
