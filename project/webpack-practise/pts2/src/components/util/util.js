/*
 * @Author: xinni
 * @Date: 2017-11-21 14:22:46
 * @Last Modified by: xinni
 * @Last Modified time: 2017-12-15 17:59:26
 */

import * as d3 from 'd3';
class Util {
  /**
   * Creates an instance of Util.
   * @param {object} myChart VCharts实例
   * @memberof Util
   */
  constructor() {
    return this.exports();
  }

  /**
   * 数据转换
   * series数组转成以type为key的Object
   * @param {object} option VCharts配置
   * @memberof Axis
   */
  convertSeries(myChart, option) {
    this.myChart = myChart;
    if (option.series) {
      // series数组化
      if (!Array.isArray(option.series)) {
        option.series = [option.series];
      }

      const tempSeries = {};
      // 缓存series
      // series数组转成以type为key的Object
      option.series.forEach(function(s) {
        tempSeries[s.type] = tempSeries[s.type] || [];
        tempSeries[s.type].push(s);
      });
      option.series = tempSeries;
    }
  }

  /**
   * 根据依赖配置检查所依赖配置是否存在
   * @param {object} option vCharts配置
   * @memberof Util
   */
  loadRequire(option) {
    const self = this;
    const myChart = self.myChart;
    const loadRequireConfig = this.config.loadRequire;
    Object.keys(loadRequireConfig).forEach(requiredType => {
      // 被依赖的组件数据存在时加载依赖组件
      if (option.series[requiredType]) {
        const requireComponents = loadRequireConfig[requiredType];
        requireComponents.forEach(requireComponent => {
          if (
            (option[requireComponent] === undefined ||
              (Array.isArray(option[requireComponent]) && option[requireComponent].length === 0)) &&
            myChart.option[requireComponent] === undefined
          ) {
            // 初始化时若所依赖配置缺失做补全操作
            option[requireComponent] = [{}];
          } else if (option[requireComponent] === undefined && myChart.option[requireComponent]) {
            // update时不传作为不变处理 继承上一次的值
            // 请注意update时传[]会视为删除操作 初始化时的[]会默认新增一个组件
            option[requireComponent] = myChart.option[requireComponent].map(d => ({}));
          } else if (!Array.isArray(option[requireComponent])) {
            option[requireComponent] = [option[requireComponent]];
          }
        });
      }
    });
  }

  /**
   * 配置文件
   * @returns 配置关系
   * @memberof Util
   */
  config() {
    return {
      // 组件间的依赖关系，用于被依赖组件配置缺省时的初始化
      loadRequire: {
        bar: ['xAxis', 'yAxis', 'legend'],
        line: ['xAxis', 'yAxis', 'legend'],
        point: ['xAxis', 'yAxis', 'legend'],
        pie: ['legend'],
        tornadoBar: ['xAxis', 'yAxis', 'legend']
      },
      // 参与axis的domain计算
      axisRequire: ['bar', 'line', 'point', 'tornadoBar'],
      // 动画持续时间
      transitionDurationTime: 1500,
      // 主色调
      // mainColor: '#fff'
      mainColor: '#000'
    };
  }

  /**
   * 根据组件类型获取实例名称
   * 'xAxis' -- 'XAxis'
   * @param {string} componentType 组件类型
   * @returns 实例名称
   * @memberof Util
   */
  getInstanceName(componentType) {
    componentType = componentType.toString().trim();
    const specialName = {
      xAxis: 'Axis',
      yAxis: 'Axis'
    };
    if (componentType.length > 0) {
      if (specialName[componentType]) {
        return specialName[componentType];
      }
      return componentType[0].toUpperCase() + componentType.substring(1, componentType.length);
    }
    return componentType;
  }

  /**
   * 生成渐变色
   * @param {object} color 渐变色配置
   * @returns 渐变色对应的选择器
   * @memberof Util
   */
  initLinearGradient(color) {
    const self = this;
    const myChart = self.myChart;
    const defaultColor = {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: self.defaultColor(0),
          opacity: 1 // 0% 处的颜色
        },
        {
          offset: 1,
          color: self.defaultColor(1),
          opacity: 1 // 100% 处的颜色
        }
      ]
    };

    if (Array.isArray(color.colorStops) && color.colorStops.length > 1) {
      color.colorStops[0] = self.ObjectDeepAssign(defaultColor.colorStops[0], color.colorStops[0]);
      color.colorStops[1] = self.ObjectDeepAssign(defaultColor.colorStops[1], color.colorStops[1]);
    }

    const currentColor = self.ObjectDeepAssign(defaultColor, color);
    currentColor.x = self.PercentToFloat(currentColor.x);
    currentColor.y = self.PercentToFloat(currentColor.y);
    currentColor.x2 = self.PercentToFloat(currentColor.x2);
    currentColor.y2 = self.PercentToFloat(currentColor.y2);
    currentColor.colorStops[0].offset = self.PercentToFloat(currentColor.colorStops[0].offset);
    currentColor.colorStops[1].offset = self.PercentToFloat(currentColor.colorStops[1].offset);

    let defs = myChart.grid.selectAll('defs.linearGradients');
    if (!defs.nodes().length) {
      defs = myChart.grid.append('defs').attr('class', 'linearGradients');
    }
    const colorIndex = defs.selectAll('linearGradient').nodes().length;
    const colorId =
      myChart.wrapSelector.replace('.', '').replace('#', '') + '-linearGradient-' + colorIndex;
    const linearGradient = defs
      .append('linearGradient')
      .attr('id', colorId)
      .attr('x1', currentColor.x)
      .attr('y1', currentColor.y)
      .attr('x2', currentColor.x2)
      .attr('y2', currentColor.y2);
    linearGradient
      .append('stop')
      .attr('offset', currentColor.colorStops[0].offset)
      .style('stop-color', currentColor.colorStops[0].color)
      .style('stop-opacity', currentColor.colorStops[0].opacity);
    linearGradient
      .append('stop')
      .attr('offset', currentColor.colorStops[1].offset)
      .style('stop-color', currentColor.colorStops[1].color)
      .style('stop-opacity', currentColor.colorStops[1].opacity);
    return [
      // svg渐变色
      'url(#' + colorId + ')',
      // css渐变色
      'linear-gradient(90deg, ' +
        currentColor.colorStops[0].color +
        ', ' +
        currentColor.colorStops[1].color +
        ')'
    ];
  }

  /**
   * 数值/百分比转数值
   * eg:
   * '50%' -- '0.5'
   * '0.5' -- '0.5'
   * @param {string|number} value 百分比或者数值
   * @returns 入参对应的数值
   * @memberof Util
   */
  PercentToFloat(value) {
    if (value.toString().indexOf('%') > -1) {
      return parseFloat(value, 10) / 100;
    }
    return parseFloat(value, 10);
  }

  /**
   * 数值/百分比转百分比
   * eg:
   * '0.5' -- '50%'
   * '50%' -- '50%'
   * @param {anstring|number} value 数值或百分比
   * @returns 入参对应的百分比
   * @memberof Util
   */
  FloatToPercent(value) {
    if (value !== undefined && value.toString().indexOf('%') === -1) {
      return parseFloat(value, 10) * 100 + '%';
    }
    return value;
  }

  /**
   * Ascii码转Unicode码
   * '你好世界！' -- '-20320-22909-19990-30028-65281'
   * @param {string} content Ascii码
   * @returns Unicode码
   * @memberof Util
   */
  AsciiToUnicode(content) {
    let result = '';
    for (let i = 0; i < content.length; i++) {
      result += '-' + content.charCodeAt(i);
    }
    return result;
  }

  /**
   * Unicode码转Ascii码
   * '-20320-22909-19990-30028-65281' -- '你好世界！'
   * @param {string} content Unicode码
   * @returns Ascii码
   * @memberof Util
   */
  UnicodeToAscii(content) {
    let result = '';
    const code = content.replace('-', '').split('-');
    code.forEach(c => {
      result += String.fromCharCode(c);
    });
    return result;
  }

  /**
   * 用于将所有属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
   * 支持多级属性的复制
   * @param {object} target 目标对象
   * @param {object} sources 源对象
   * @memberof Util
   */
  ObjectsDeepAssign(target, ...sources) {
    for (let i = sources.length - 1; i > -1; i++) {
      const source = sources[i];
      let preSource = null;
      if (i > 0) preSource = sources[i - 1];
      else preSource = target;
      this.ObjectDeepAssign(preSource, source);
    }
    return target;
  }
  /**
   * 用于将所有属性的值从一个源对象复制到目标对象。它将返回目标对象。
   * 支持多级属性的复制
   * @param {object} target 目标对象
   * @param {object} source 源对象
   * @memberof Util
   */
  ObjectDeepAssign(target, source) {
    const self = this;
    Object.keys(source).forEach(s => {
      if (target[s] !== undefined && self.isObject(target[s]) && self.isObject(source[s])) {
        self.ObjectDeepAssign(target[s], source[s]);
      } else {
        target[s] = source[s];
      }
    });

    return target;
  }

  /**
   * 数据类型判断
   * eg.
   * myChart.util.isArray([]) === true
   * myChart.util.isObject({}) === true
   * @returns 含有9种类型判断方法的对象
   * @memberof Util
   */
  typeOf() {
    const types = [
      'Array',
      'Boolean',
      'Date',
      'Number',
      'Object',
      'RegExp',
      'String',
      'Window',
      'HTMLDocument'
    ];

    const temp = {};
    types.forEach(type => {
      temp['is' + type] = target => {
        return Object.prototype.toString.call(target) === '[object ' + type + ']';
      };
    });
    return temp;
  }

  /**
   * 组件的默认配色方案
   * @param {number} index 该类目对应的索引
   * @returns 该索引对应的默认色值
   * @memberof Util
   */
  defaultColor(index) {
    // const color = ['#00befc', '#4ceaa0', '#dced01', '#0067ff', '#2523e6', '#7a01f6', '#feac0b'];
    const color = [
      '#c23531',
      '#2f4554',
      '#61a0a8',
      '#d48265',
      '#91c7ae',
      '#749f83',
      '#ca8622',
      '#bda29a',
      '#6e7074',
      '#546570',
      '#c4ccd3'
    ];
    return color[parseInt(index, 10) % color.length];
  }

  /**
   * 随机生成颜色
   * @returns d3.schemeCategory20b下20种颜色的随机一种
   * @memberof Util
   */
  randomColor() {
    const color20b = d3.schemeCategory20b;
    const randomIndex = Math.floor(Math.random() * 20);
    return color20b(randomIndex);
  }

  deepCopy(p, c) {
    var i;
    c = c || {};
    for (i in p) {
      if (p.hasOwnProperty(i)) {
        if (typeof p[i] === 'object') {
          c[i] = Array.isArray(p[i]) ? [] : {};
          this.deepCopy(p[i], c[i]);
        } else {
          c[i] = p[i];
        }
      }
    }
    return c;
  }

  /**
   * 暴露出去的util方法
   * @returns util方法的object
   * @memberof Util
   */
  exports() {
    const util = {
      config: this.config(),
      convertSeries: this.convertSeries,
      loadRequire: this.loadRequire,
      getInstanceName: this.getInstanceName,
      initLinearGradient: this.initLinearGradient,
      PercentToFloat: this.PercentToFloat,
      FloatToPercent: this.FloatToPercent,
      AsciiToUnicode: this.AsciiToUnicode,
      UnicodeToAscii: this.UnicodeToAscii,
      ObjectsDeepAssign: this.ObjectsDeepAssign,
      ObjectDeepAssign: this.ObjectDeepAssign,
      defaultColor: this.defaultColor,
      randomColor: this.randomColor,
      deepCopy: this.deepCopy
    };
    Object.assign(util, this.typeOf());
    return util;
  }
}
export default Util;
