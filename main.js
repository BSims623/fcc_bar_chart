import './style.css'
import * as d3 from "d3";

d3.select('#app').append('h1').attr('id', 'title').text('United States GDP')

const req = new XMLHttpRequest();
req.open("GET", 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
req.send();
req.onload = function () {
  const json = JSON.parse(req.responseText);
  const dataset = json.data;

  const w = 1000;

  const h = 500;

  const padding = 60;

  const rectWidth = ((w - (padding * 2)) / dataset.length);

  const xScale = d3.scaleTime()
    .domain([d3.min(dataset, (d) => new Date(d[0])), d3.max(dataset, (d) => new Date(d[0]))])
    .range([padding, w - padding]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([h - padding, padding]);

  const svg = d3.select('#app')
    .append('svg')
    .attr('width', w)
    .attr('height', h)
    .style('background', '#bde902');

  svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('data-date', (d) => d[0])
    .attr('data-gdp', (d) => d[1])
    .attr('width', rectWidth)
    .attr("height", (d) => h - yScale(d[1]) - padding)
    .attr('fill', '#018558')
    .attr('x', (d, i) => (i * rectWidth) + 60)
    .attr("y", (d) => yScale(d[1]))

  const xAxis = d3.axisBottom(xScale);

  const yAxis = d3.axisLeft(yScale);

  svg.append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .attr('id', 'x-axis')
    .call(xAxis);

  svg.append("g")
    .attr("transform", "translate(" + padding + ", 0)")
    .attr('id', 'y-axis')
    .call(yAxis);

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr('x', -(h / 2))
    .attr('y', padding)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Gross Domestic Product");

  d3.select('body').append('div').attr('id', 'tooltip').attr('style', 'position: absolute; opacity: 0;').append('p').attr('id', 'theDate');
  d3.select('#tooltip').append('p').attr('id', 'theGdp');
  d3.select('svg').selectAll('rect').data(dataset)
    .join('rect')

    .on('mouseover', function (d) {
      let billions = "$" + this[Object.keys(this)[0]][1] + " Billion"
      let year = this[Object.keys(this)[0]][0].slice(0, 4);
      let quarter;
      if (this[Object.keys(this)[0]][0].slice(6, 7) == 1) {
        quarter = 'Q1'
      } else if (this[Object.keys(this)[0]][0].slice(6, 7) == 4) {
        quarter = 'Q2'
      } else if (this[Object.keys(this)[0]][0].slice(6, 7) == 7) {
        quarter = 'Q3'
      } else if (this[Object.keys(this)[0]][0].slice(6, 7) == 0) {
        quarter = 'Q4'
      }
      d3.select('#tooltip').attr("data-date", this[Object.keys(this)[0]][0]).style('opacity', 1)
      d3.select('#theDate').text(`${year} ${quarter}`)
      d3.select('#theGdp').text(`${billions}`)
    })
    .on('mouseout', function (e) {
      d3.select('#tooltip').style('opacity', 0)
    })
    .on('mousemove', function (e) {
      d3.select('#tooltip').style('left', (e.clientX + 15) + 'px').style('top', (e.clientY - 60) + 'px')
    })

  d3.select('#app')
    .append('p')
    .attr('id', 'moreInfo')
    .text('More Information')
    .append('a')
    .attr('id', 'link')
    .attr('href', 'http://www.bea.gov/national/pdf/nipaguid.pdf')
    .text(' http://www.bea.gov/national/pdf/nipaguid.pdf')
};