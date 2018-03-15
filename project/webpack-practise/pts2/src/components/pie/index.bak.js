/*
 * @Author: xinni
 * @Date: 2017-09-08 11:11:56
 * @Last Modified by: xinni
 * @Last Modified time: 2017-12-12 16:06:50
 */

require('./pie.scss');
var d3 = require('d3');
var defaultColor = require('../../../common/utils.js').default.defaultColor;

var Pie = function(myChart, series) {
  this.myChart = myChart;
  this.series = series;
  this.init();
};
Pie.prototype = {
  constructor: Pie,
  init: function() {
    var self = this;
    self._initPies();
  },
  _initPies: function() {
    var self = this;
    var myChart = self.myChart;
    var series = self.series;
    // self.color = d3.schemeCategory20;
    self.color = defaultColor.color;
    myChart.grid
      .append('g')
      .classed('Pies', true)
      .append('defs');
    series.forEach(function(PieOpt, PieIndex) {
      self._formatSinglePieOpt(PieOpt, PieIndex);
      self._initSinglePie(PieOpt, PieIndex);
    });
  },
  _formatSinglePieOpt: function(PieOpt, PieIndex) {
    var self = this;
    var myChart = self.myChart;
    if (PieOpt.radius === undefined) {
      PieOpt.radius = ['0%', '100%'];
    } else if (!Array.isArray(PieOpt.radius)) {
      PieOpt.radius = ['0%', PieOpt.radius];
    } else if (PieOpt.radius.length === 0) {
      PieOpt.radius = ['0%', '100%'];
    } else if (PieOpt.radius.length === 1) {
      PieOpt.radius = ['0%', PieOpt.radius[0]];
    }
    PieOpt.radius[0] = myChart.Grid.parsePercentToInt(PieOpt.radius[0]);
    PieOpt.radius[1] = myChart.Grid.parsePercentToInt(PieOpt.radius[1]);

    if (PieOpt.center === undefined) {
      PieOpt.center = ['50%', '50%'];
    } else if (!Array.isArray(PieOpt.center)) {
      PieOpt.center = [PieOpt.center, PieOpt.center];
    } else if (PieOpt.center.length === 0) {
      PieOpt.center = ['50%', '50%'];
    } else if (PieOpt.center.length === 1) {
      PieOpt.center = [PieOpt.center[0], PieOpt.center[0]];
    }
    PieOpt.center[0] = myChart.Grid.parsePercentToInt(PieOpt.center[0]);
    PieOpt.center[1] = myChart.Grid.parsePercentToInt(PieOpt.center[1]);

    if (PieOpt.padAngle === undefined) {
      PieOpt.padAngle = 0;
    }
    PieOpt.padAngle = myChart.Grid.parsePercentToInt(PieOpt.padAngle);

    if (PieOpt.data && Array.isArray(PieOpt.data)) {
      PieOpt.data.forEach(function(pieData, pieDataIndex) {
        if (pieData.value === undefined) {
          pieData.value = 0;
        }

        if (
          pieData.itemStyle === undefined ||
          pieData.itemStyle.normal === undefined
        ) {
          pieData.itemStyle = {
            normal: {}
          };
        }
        var itemStyleNormal = pieData.itemStyle.normal;
        if (
          itemStyleNormal.color !== undefined &&
          itemStyleNormal.color instanceof Object
        ) {
          itemStyleNormal.color = myChart.Grid.initLinearGradient(
            itemStyleNormal.color
          );
        } else {
          itemStyleNormal.color =
            itemStyleNormal.color || self.color[pieDataIndex];
        }

        if (itemStyleNormal.opacity === undefined) {
          itemStyleNormal.opacity = 1;
        }

        if (
          pieData.labelLine === undefined ||
          pieData.labelLine.normal === undefined
        ) {
          pieData.labelLine = {
            normal: {}
          };
        }
        var labelLineNormal = pieData.labelLine.normal;
        if (labelLineNormal.show !== false) {
          labelLineNormal.show = true;
        }
        if (labelLineNormal.length === undefined) {
          labelLineNormal.length = 40;
        }
        if (labelLineNormal.length2 === undefined) {
          labelLineNormal.length2 = 20;
        }
        if (labelLineNormal.lineStyle === undefined) {
          labelLineNormal.lineStyle = {};
        }
        if (
          labelLineNormal.lineStyle.color !== undefined &&
          labelLineNormal.lineStyle.color instanceof Object
        ) {
          labelLineNormal.lineStyle.color = myChart.Grid.initPiearGradient(
            labelLineNormal.lineStyle.color
          );
        } else {
          labelLineNormal.lineStyle.color =
            labelLineNormal.lineStyle.color || itemStyleNormal.color;
        }
        if (labelLineNormal.lineStyle.width === undefined) {
          labelLineNormal.lineStyle.width = 1;
        }
        if (labelLineNormal.lineStyle.opacity === undefined) {
          labelLineNormal.lineStyle.opacity = 1;
        }

        if (pieData.label === undefined || pieData.label.normal === undefined) {
          pieData.label = {
            normal: {}
          };
        }
        var labelNormal = pieData.label.normal;
        if (labelNormal.show !== false) {
          labelNormal.show = true;
        }
        if (
          labelNormal.color !== undefined &&
          labelNormal.color instanceof Object
        ) {
          labelNormal.color = myChart.Grid.initPiearGradient(labelNormal.color);
        } else {
          labelNormal.color =
            labelNormal.color || labelLineNormal.lineStyle.color;
        }
        labelNormal.fontFamily = labelNormal.fontFamily || '';
        labelNormal.fontStyle = labelNormal.fontStyle || 'normal';
        labelNormal.fontWeight = labelNormal.fontStyle || 'normal';
        labelNormal.fontSize = labelNormal.fontSize || 12;
      });
    }
  },
  _initSinglePie: function(PieOpt, PieIndex) {
    var self = this;
    var myChart = self.myChart;
    var radius = Math.min(myChart.width, myChart.height) / 2;
    var defs = myChart.grid.select('g.Pies').select('defs');
    var pie = myChart.grid
      .select('g.Pies')
      .append('g')
      .classed('pie pie-' + PieIndex, true)
      .attr(
        'transform',
        'translate(' +
          myChart.width * PieOpt.center[0] +
          ',' +
          myChart.height * PieOpt.center[1] +
          ')'
      );

    var pieBuilder = d3
      .pie()
      .sort(null)
      .value(function(d) {
        return d.value;
      });

    if (PieOpt.padAngle !== undefined) {
      pieBuilder.padAngle(PieOpt.padAngle);
    }

    var pathBuilder = d3
      .arc()
      .innerRadius(radius * PieOpt.radius[0])
      .outerRadius(radius * PieOpt.radius[1]);

    var dataList = PieOpt.data.map(function(d) {
      return parseInt(d.value, 10);
    });

    var roseLinear = d3
      .scaleLinear()
      .domain([0, d3.max(dataList)])
      .range([radius * PieOpt.radius[0], radius * PieOpt.radius[1]]);

    var def = defs.selectAll('def.def-' + PieIndex);

    if (def.nodes().length === 0) {
      def = defs.append('def').classed('def def-' + PieIndex, true);
    }

    var baseSelector = myChart.wrapSelector.replace('#', '').replace('.', '');

    var defPathParams = pieBuilder(PieOpt.data);
    defPathParams.forEach(function(d, i, propData) {
      // 有padAngle时的偏移量
      propData[i].startAngle =
        d.startAngle +
        propData[propData.length - 1].endAngle *
          d.padAngle /
          propData.length /
          2;
      // 360°
      propData[i].endAngle =
        d.startAngle + propData[propData.length - 1].endAngle;
    });
    
    def
      .selectAll('path')
      .data(defPathParams)
      .enter()
      .append('path')
      .attr('id', function(d, i) {
        return baseSelector + '-def-path-' + PieIndex + '-' + i;
      })
      .attr('d', function(d) {
        if (!!PieOpt.roseType === true) {
          pathBuilder.outerRadius(roseLinear(parseInt(d.value, 10)));
        }
        return pathBuilder(d);
      });

    var arc = pie
      .selectAll('g.arc')
      .data(pieBuilder(PieOpt.data))
      .enter()
      .append('g')
      .attr('class', function(d, i) {
        return 'arc arc-' + i;
      });

    arc
      .append('path')
      .attr('d', function(d) {
        if (!!PieOpt.roseType === true) {
          pathBuilder.outerRadius(roseLinear(parseInt(d.value, 10)));
        }
        return pathBuilder(d);
      })
      .attr('data-msg', function(d) {
        console.log(d);
        return d;
      })
      .attr('fill', function(d) {
        return d.data.itemStyle.normal.color;
      })
      .attr('opacity', function(d) {
        return d.data.itemStyle.normal.opacity;
      });

    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    arc
      .append('polyline')
      .attr('display', function(d) {
        return d.data.labelLine.normal.show === false ? 'none' : 'inline';
      })
      .attr('points', function(d) {
        var arcOuterRadius = radius * PieOpt.radius[1];
        if (!!PieOpt.roseType === true) {
          arcOuterRadius = roseLinear(parseInt(d.value, 10));
        }

        var point0Builder = d3
          .arc()
          .outerRadius(arcOuterRadius)
          .innerRadius(arcOuterRadius);
        var point0 = point0Builder.centroid(d);
        var point1Builder = d3
          .arc()
          .outerRadius(
            radius * PieOpt.radius[1] + d.data.labelLine.normal.length
          )
          .innerRadius(
            radius * PieOpt.radius[1] + d.data.labelLine.normal.length
          );

        var point1 = point1Builder.centroid(d);
        var base = midAngle(d) < Math.PI ? 1 : -1;
        var point2 = [
          point1[0] + d.data.labelLine.normal.length2 * base,
          point1[1]
        ];
        return [point0, point1, point2];
      })
      .attr('fill', 'none')
      .attr('stroke', function(d) {
        return d.data.labelLine.normal.lineStyle.color;
      })
      .attr('stroke-width', function(d) {
        return d.data.labelLine.normal.lineStyle.width;
      })
      .attr('opacity', function(d) {
        return d.data.labelLine.normal.lineStyle.opacity;
      });

    arc
      .append('text')
      .attr('display', function(d) {
        return d.data.label.normal.show === false ? 'none' : 'inline';
      })
      .attr('transform', function(d) {
        if (self._judgeIfNeedTextPath(d)) {
          return '';
        }
        var labelBuilder = d3
          .arc()
          .outerRadius(
            radius * PieOpt.radius[1] + d.data.labelLine.normal.length
          )
          .innerRadius(
            radius * PieOpt.radius[1] + d.data.labelLine.normal.length
          );
        var basePoint = labelBuilder.centroid(d);

        var base = midAngle(d) < Math.PI ? 1 : -1;
        var offsetPoint = [
          basePoint[0] + (d.data.labelLine.normal.length2 + 4) * base,
          basePoint[1]
        ];
        return 'translate(' + offsetPoint + ')';
      })
      .attr('text-anchor', function(d) {
        if (self._judgeIfNeedTextPath(d)) {
          return '';
        }
        return midAngle(d) < Math.PI ? 'start' : 'end';
      })
      .attr('dy', function(d) {
        if (self._judgeIfNeedTextPath(d)) {
          return '-0.35em';
        }
        return '0.35em';
      })
      .attr('fill', function(d) {
        return d.data.label.normal.color;
      })
      .attr('font-size', function(d) {
        return d.data.label.normal.fontSize;
      })
      .attr('font-family', function(d) {
        return d.data.label.normal.fontFamily;
      })
      .attr('font-style', function(d) {
        return d.data.label.normal.fontStyle;
      })
      .attr('font-weight', function(d) {
        return d.data.label.normal.fontWeight;
      })
      .html(function(d, i) {
        if (self._judgeIfNeedTextPath(d)) {
          var textPath = '<textPath ';
          textPath +=
            'xlink:href="#' +
            baseSelector +
            '-def-path-' +
            PieIndex +
            '-' +
            i +
            '">';
          textPath += d.data.name;
          textPath += '</textPath>';
          return textPath;
        }
        return d.data.name;
      });

    if (PieOpt.showName === true) {
      arc
        .append('text')
        .attr('display', function(d, i, data) {
          return i === data.length - 1 ? 'inline' : 'none';
        })
        .classed('pie-name', true)
        .attr('dy', '1.5em')
        .attr('fill', function(d) {
          return d.data.label.normal.color;
        })
        .attr('font-size', function(d) {
          return d.data.label.normal.fontSize;
        })
        .attr('font-family', function(d) {
          return d.data.label.normal.fontFamily;
        })
        .attr('font-style', function(d) {
          return d.data.label.normal.fontStyle;
        })
        .attr('font-weight', function(d) {
          return d.data.label.normal.fontWeight;
        })
        .html(function(d, i) {
          var textPath = '<textPath ';
          textPath +=
            'xlink:href="#' +
            baseSelector +
            '-def-path-' +
            PieIndex +
            '-' +
            i +
            '">';
          textPath += PieOpt.name;
          textPath += '</textPath>';
          return textPath;
        });
    }
  },
  _judgeIfNeedTextPath: function(d) {
    if (
      d.data.labelLine.normal.show === false ||
      (d.data.labelLine.normal.length === 0 &&
        d.data.labelLine.normal.length2 === 0)
    ) {
      return true;
    }
    return false;
  }
};

export default Pie;
