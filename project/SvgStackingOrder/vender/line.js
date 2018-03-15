window.onload = function() {
  drawChart();
};

const data = [
  [28604, 77, 17096869, 'Australia', 1990],
  [31163, 77.4, 27662440, 'Canada', 1990],
  [1516, 68, 1154605773, 'China', 1990],
  [13670, 74.7, 10582082, 'Cuba', 1990],
  [28599, 75, 4986705, 'Finland', 1990],
  [29476, 77.1, 56943299, 'France', 1990],
  [31476, 75.4, 78958237, 'Germany', 1990],
  [28666, 78.1, 254830, 'Iceland', 1990],
  [1777, 57.7, 870601776, 'India', 1990],
  [29550, 79.1, 122249285, 'Japan', 1990],
  [2076, 67.9, 20194354, 'North Korea', 1990],
  [12087, 72, 42972254, 'South Korea', 1990],
  [24021, 75.4, 3397534, 'New Zealand', 1990],
  [43296, 76.8, 4240375, 'Norway', 1990],
  [10088, 70.8, 38195258, 'Poland', 1990],
  [19349, 69.6, 147568552, 'Russia', 1990],
  [10670, 67.3, 53994605, 'Turkey', 1990],
  [26424, 75.7, 57110117, 'United Kingdom', 1990],
  [37062, 75.4, 252847810, 'United States', 1990],
  [44056, 81.8, 23968973, 'Australia', 2015],
  [43294, 81.7, 35939927, 'Canada', 2015],
  [13334, 76.9, 1376048943, 'China', 2015],
  [21291, 78.5, 11389562, 'Cuba', 2015],
  [38923, 80.8, 5503457, 'Finland', 2015],
  [37599, 81.9, 64395345, 'France', 2015],
  [44053, 81.1, 80688545, 'Germany', 2015],
  [42182, 82.8, 329425, 'Iceland', 2015],
  [5903, 66.8, 1311050527, 'India', 2015],
  [36162, 83.5, 126573481, 'Japan', 2015],
  [1390, 71.4, 25155317, 'North Korea', 2015],
  [34644, 80.7, 50293439, 'South Korea', 2015],
  [34186, 80.6, 4528526, 'New Zealand', 2015],
  [64304, 81.6, 5210967, 'Norway', 2015],
  [24787, 77.3, 38611794, 'Poland', 2015],
  [23038, 73.13, 143456918, 'Russia', 2015],
  [19360, 76.5, 78665830, 'Turkey', 2015],
  [38225, 81.4, 64715810, 'United Kingdom', 2015],
  [53354, 79.1, 321773631, 'United States', 2015]
];

const drawChart = function() {
  const config = initConfig();
  initScale(config);
  drawGrid(config);
  drawAxis('x', config);
  drawAxis('y', config);
  drawCircle(config);
  initToolTip(config);
};

const initConfig = function() {
  const $el = d3.select('#svg');
  const padding = {
    top: 80,
    bottom: 80,
    right: 80,
    left: 80
  };
  const config = {
    xData: [],
    yData: [],
    rData: [],
    wrap: $el,
    padding: padding,
    width: parseFloat($el.style('width')) - padding.left - padding.right,
    height: parseFloat($el.style('height')) - padding.top - padding.bottom
  };

  data.forEach(d => {
    config.xData.push(d[0]);
    config.yData.push(d[1]);
    config.rData.push(d[2]);
  });

  return config;
};

const initScale = function(config) {
  config.xScale = d3
    .scaleLinear()
    .domain([0, d3.max(config.xData)])
    .range([0, config.width])
    .nice();
  config.yScale = d3
    .scaleLinear()
    .domain([0, d3.max(config.yData)])
    .range([config.height, 0])
    .nice();
  config.rScale = d3
    .scaleLinear()
    .domain([d3.min(config.rData), d3.max(config.rData)])
    .range([5, 45]);

  config.tipScale = d3
    .scaleQuantize()
    .domain([0, config.width])
    .range(config.xScale.domain());
};

const drawGrid = function(config) {
  config.grid = config.wrap
    .append('g')
    .classed('grid', true)
    .attr('transform', 'translate(' + config.padding.left + ',' + config.padding.top + ')');
};

const drawAxis = function(type, config) {
  const { xScale, yScale, width, height, grid } = config;
  let axis;
  let translate = [0, 0];
  if (type === 'x') {
    axis = d3.axisBottom(xScale).tickSizeInner(-height);
    translate = [0, height];
  } else if (type === 'y') {
    axis = d3.axisLeft(yScale).tickSizeInner(-width);
  }

  grid
    .append('g')
    .classed(`axis ${type}Axis`, true)
    .attr('transform', 'translate(' + translate[0] + ',' + translate[1] + ')')
    .call(axis);
};

const drawCircle = function(config) {
  const { grid, xScale, yScale, rScale } = config;
  const circles = grid.append('g').classed('circles', true);
  circles
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d[0]))
    .attr('cy', d => yScale(d[1]))
    .attr('r', 0)
    .attr('fill', d => (d[4] === 1990 ? '#ed616c' : '#5ed4e4'))
    .style('opacity', 0.8)
    .transition()
    .duration(1200)
    .ease(d3.easeExpInOut)
    .attr('r', d => rScale(d[2]));
};

const initToolTip = function(config) {
  const { grid, width, height } = config;
  const toolTip = grid.append('g').classed('tool-tip', true);

  let xLineData = [{ x: 0, y: 0 }, { x: 0, y: height }];
  let yLineData = [{ x: 0, y: 0 }, { x: width, y: 0 }];
  const LineBuilder = d3
    .line()
    .x(d => d.x)
    .y(d => d.y);
  const xTipLine = toolTip
    .append('path')
    .classed('tip-line', true)
    .style('display', 'none')
    .datum(xLineData)
    .style('fill', 'none')
    .style('stroke-width', 1)
    .style('stroke', '#aaaaaa')
    .attr('d', LineBuilder);

  const yTipLine = toolTip
    .append('path')
    .classed('tip-line', true)
    .style('display', 'none')
    .datum(yLineData)
    .style('fill', 'none')
    .style('stroke-width', 1)
    .style('stroke', '#aaaaaa')
    .style('stroke-dasharray', '3,3')
    .attr('d', LineBuilder);

  const tipTrigger = toolTip
    .append('rect')
    .classed('tip-trigger', true)
    .attr('width', width)
    .attr('height', height)
    .style('fill', 'transparent');

  tipTrigger.node().addEventListener('mousemove', e => {
    const target = e.target;
    const targetBounding = target.getBoundingClientRect();
    let x = e.pageX - targetBounding.left;
    const y = e.pageY - targetBounding.top;
    console.log(config.tipScale(x));
    x = roundX(x, config);
    xLineData = [{ x: x, y: 0 }, { x: x, y: height }];
    yLineData = [{ x: 0, y: y }, { x: width, y: y }];
    xTipLine
      .style('display', '')
      .datum(xLineData)
      .attr('d', LineBuilder);
    yTipLine
      .style('display', '')
      .datum(yLineData)
      .attr('d', LineBuilder);
  });

  tipTrigger.node().addEventListener('mouseleave', e => {
    xTipLine.style('display', 'none');
    yTipLine.style('display', 'none');
  });
};

const roundX = function(x, config) {
  const { xScale, tipScale, xData, width } = config;

  const xValue = tipScale(x);
  let minGap = width;
  let nearbyData;
  xData.forEach(d => {
    if (d - x < minGap) {
      minGap = d - x;
      nearbyData = d;
    }
  });

  return xScale(nearbyData);
};
