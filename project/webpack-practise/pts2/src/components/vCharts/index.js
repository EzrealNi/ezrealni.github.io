/*
 * @Author: xinni
 * @Date: 2017-08-23 17:43:45
 * @Last Modified by: xinni
 * @Last Modified time: 2018-03-06 16:57:19
 */

import './vCharts.scss';
import * as d3 from 'd3';
import 'babel-polyfill';
// util类
import Util from '../util/util.js';
// 图表的外层容器
import Grid from '../grid/index.js';
// 图例
import Legend from '../legend/index.js';
// 直角坐标系
import Axis from '../axis/index.js';

const vcharts = {
  // 初始化VCharts
  init: function(wrap) {
    return new VCharts(wrap);
  }
};

class VCharts {
  constructor(wrap) {
    // 缓存加载图表的元素的选择器
    this.wrapSelector = wrap;
    // 缓存加载图表的元素的d3选择器
    this.wrap = d3.select(wrap);
    this.wrap.style('position', 'relative');
  }

  async setOption(optionOrigin) {
    const myChart = this;
    myChart.option = myChart.option || {};

    // 挂载util类
    myChart.util = myChart.util || new Util();
    const option = myChart.util.deepCopy(optionOrigin, {});
    myChart.util.convertSeries(myChart, option);
    myChart.util.loadRequire(option);

    myChart.Grid = myChart.Grid || new Grid(myChart);
    myChart.Legend = myChart.Legend || new Legend(myChart);
    myChart.Axis = myChart.Axis || new Axis(myChart);

    myChart.chartInstance = myChart.chartInstance || {};

    var vChartsFactory = new VChartsFactory();
    // 动态加载子组件
    const promises = [];
    Object.keys(option.series).forEach(componentType => {
      if (!myChart.chartInstance[componentType]) {
        promises.push(vChartsFactory.getComponent(componentType));
      }
    });
    await Promise.all(promises).then(components => {
      components.forEach(({ componentType, Component }) => {
        myChart.chartInstance[componentType] = new Component(myChart);
      });
    });

    myChart.Grid.validate(option.grid);
    myChart.Grid.init();
    myChart.Legend.validate(option.legend);
    myChart.Axis.validate(option);
    Object.keys(myChart.chartInstance).forEach(componentType => {
      myChart.chartInstance[componentType].validate(option.series[componentType]);
    });

    myChart.Legend.setLegendData();
    myChart.Axis.setAxisDomain();

    myChart.Legend.init();
    myChart.Axis.init();
    // console.log(myChart.chartInstance);
    Object.keys(myChart.chartInstance).forEach(componentType => {
      myChart.chartInstance[componentType].init();
    });
  }
}

class VChartsFactory {
  /**
   * 获取子组件构造函数
   * @param vcharts: VCharts实例
   * @param componentType: 子组件类型
   */
  async getComponent(componentType) {
    const prototype = this.constructor.prototype;
    // 已缓存则取缓存
    if (!prototype.hasOwnProperty(componentType)) {
      // 加载
      const componentModule = await require('../' + componentType + '/index.js');
      console.log('import ' + componentType);
      prototype[componentType] = componentModule.default;
    }
    return { componentType: componentType, Component: prototype[componentType] };
  }
}

export default vcharts;
export { vcharts };
