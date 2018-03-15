/*
 * @Author: ruqichen
 * @Date: 2017-02-27 14:00:00
 */

import * as d3 from 'd3';

class TornadoBar {
  constructor(myChart) {
    this.myChart = myChart;
  }

  validate(options = []) {
    const myChart = this.myChart;
    this.barGapData =  {};
    options.forEach((option, index) => {
      options[index] = this._validateOption(option, index, options.length);
    });
    myChart.option.series = myChart.option.series || {};
    myChart.option.series.tornadoBar = options;
    this._countBarGapData();
  }

  _validateOption(option, index, length) {
    const defaultOption = {
      type: 'tornadoBar',
      name: 'tornadoBar-' + index,
      stack: 'bar',
      // 使用的 x 轴的 index，在单个图表实例中存在多个 x 轴的时候有用。
      xAxisIndex: 0,
      // 使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用。
      yAxisIndex: 0,
      itemStyle: {
        normal: {
          color: this.myChart.util.defaultColor(index),
          borderColor: '#000',
          borderWidth: 0,
          opacity: 1
        }
      },
      barWidth: 1 / (length * 2),
      barGap: '30%',
      data: [],
      formatter: (d, i) => d.value
    }
    let currentOption = defaultOption;
    // 检查该数据是否已缓存
    if (this.myChart.option.series && Array.isArray(this.myChart.option.series.tornadoBar)) {
      for (let i = 0; i < this.myChart.option.series.tornadoBar.length; i++) {
        if (this.myChart.option.series.tornadoBar[i].name === option.name) {
          this.myChart.option.series.tornadoBar[i].data = [];
          currentOption = this.myChart.option.series.tornadoBar[i];
          break;
        }
      }
    }

    if (option.name === undefined) {
      option.name = 'tornadoBar-' + index;
    }

    this.myChart.util.ObjectDeepAssign(currentOption, option);

    // 生成barGapData 以计算barGap
    if (this.myChart.option['xAxis'][currentOption.xAxisIndex].type === 'category') {
      this.barGapData.xAxis = this.barGapData.xAxis || {};
      if (this.barGapData.xAxis[currentOption.xAxisIndex] === undefined) {
        this.barGapData.xAxis[currentOption.xAxisIndex] = {
          barGap: this.myChart.util.PercentToFloat(currentOption.barGap)
        };
      }
    } else if (this.myChart.option['yAxis'][currentOption.yAxisIndex].type === 'category') {
      this.barGapData.yAxis = this.barGapData.yAxis || {};

      if (this.barGapData.yAxis[currentOption.yAxisIndex] === undefined) {
        this.barGapData.yAxis[currentOption.yAxisIndex] = {
          barGap: this.myChart.util.PercentToFloat(currentOption.barGap)
        };
      }
    }

    // 图例
    currentOption.legendColor = currentOption.itemStyle.normal.color;

    // 处理data
    currentOption.dataSource = currentOption.data;
    currentOption.data = currentOption.dataSource.map((d, i) => {
      if (this.myChart.util.isObject(d)) {
        return currentOption.formatter(d, i);
      }
      return d;
    })

    return currentOption;
  }


  _countBarGapData() {
    const myChart = this.myChart;
    // 以第一类柱形图配置为准
    const tornadoBarOption = myChart.option.series.tornadoBar[0];
    // 根据龙卷风图的特性，y轴是类目型，因此对y轴进行BarGap计算
    this._countBarPosition(tornadoBarOption, 'yAxis');
  }

  _countBarPosition(option, axisType) {
    const myChart = this.myChart;
    const axisIndex = axisType + 'Index';
    if (
      myChart.option[axisType].length > 0 &&
      myChart.option[axisType][option[axisIndex]].type === 'category'
    ) {
      const barGapObj = this.barGapData[axisType][option[axisIndex]];
      barGapObj.barWidths = barGapObj.barWidths || [];
      barGapObj.barGaps = barGapObj.barGaps || [];
      // 柱形宽度占类目宽度的比例
      barGapObj.barWidths.push(myChart.util.PercentToFloat(option.barWidth));
      // 柱形间隔占类目宽度的比例
      barGapObj.barGaps.push(myChart.util.PercentToFloat(option.barWidth) * barGapObj.barGap);
    }
  }

  _countBarStarts(barPosition) {
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

  init() {
    this._initBar();
  }
  _initBar() {
    const myChart = this.myChart

    myChart.grid
      .selectAll('g.bars')
      .data(new Array(1))
      .enter()
      .append('g')
        .classed('bars', true);

    myChart.option.series.tornadoBar.forEach((option, index) => {
      this._initSingleBar(option, option.yAxisIndex);
    });

  }
  _initSingleBar(option, index) {
    const myChart = this.myChart;
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

    // 对同类(name相同)数据进行处理
    const barsAttribute = option.data.map((d, i, data) => {
      const barAttribute = { value: d };

      // height
      barAttribute.height = myChart.yScale[index].bandwidth() * myChart.util.PercentToFloat(option.barWidth);
      // width
      const xScale = myChart.xScale[index];
      barAttribute.width = d < 0 ? (xScale(0) - xScale(d)) : (xScale(d) - xScale(0));

      if (typeof option.itemStyle.normal.color === 'function') {
        barAttribute.fill = option.itemStyle.normal.color(d, i, data);
      } else {
        barAttribute.fill = option.itemStyle.normal.color;
      }

      // stroke
      barAttribute.stroke = option.itemStyle.normal.borderColor;

      // stroke width
      barAttribute.strokeWidth = option.itemStyle.normal.borderWidth;

      // opacity
      barAttribute.opacity = option.itemStyle.normal.opacity;

      // x
      barAttribute.x = d < 0 ? xScale(d) : xScale(0);

      // y
      const yScale = myChart.yScale[index];
      const scaledY = yScale(myChart.option.yAxis[option.yAxisIndex].data[i]);
      const barPosition = this.barGapData.yAxis[option.yAxisIndex];
      if (!barPosition.hasOwnProperty('barStarts')) {
        this._countBarStarts(barPosition);
      }

      const offsetY = barPosition.barStarts[0] * yScale.step();

      barAttribute.y = scaledY + offsetY;

      return barAttribute;
    });
    // console.log('bandWidth', this.myChart.yScale[index].bandwidth());
    // console.log('barsAttribute', barsAttribute);

    let bars = barItem.selectAll('rect.bar').data(barsAttribute);

    bars.enter()
        .append('rect')
          .classed('bar', true)
          .attr('height', d => d.height)
          .attr('width', 0)
          .attr('y', d => d.y)
          .attr('x', myChart.xScale[option.xAxisIndex](0))
          .style('fill', d => d.fill)
          .style('stroke', d => d.stroke)
          .style('stroke-width', d => d.strokeWidth)
          .style('opacity', d => d.opacity);

    bars = barItem.selectAll('rect.bar');
    bars.transition()
        .duration(myChart.util.config.transitionDurationTime)
        .ease(d3.easeExpInOut)
        .attr('height', d => d.height)
        .attr('width', d => d.width)
        .attr('y', d => d.y)
        .attr('x', d => d.x)
        .style('fill', d => d.fill)
        .style('stroke', d => d.stroke)
        .style('stroke-width', d => d.strokeWidth)
        .style('opacity', d => d.opacity);

    bars.exit().remove();
  }
}

export default TornadoBar;
