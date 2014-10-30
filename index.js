var stack = d3.layout.stack().offset("wiggle")
  .values(function(d) { return d.counts; })
  .x(function(d) { return d.time[0]; })
  .y(function(d) { return d.count; });

var width = 1000,
    height = 800;


var color = d3.scale.category20();

var svg = d3.select("#viz-container").append("svg")
    .attr("width", width)
    .attr("height", height);

var findDate = function(counts, time) {
  var i;
  for (i = 0; i < counts.length; i++) {
    if (time < parseInt(counts[i].time[0])) {
      return i - 1;
    }
  }
};
d3.json('data.json', function(e, json) {
  var x = d3.scale.linear()
      .domain([json[0].counts[0].time[0], json[0].counts[json[0].counts.length - 1].time[0]])
      .range([0, width]);

  json = json.map(function(artist, i) {
    return artist;
  });

  var layers = stack(json);
  var y = d3.scale.linear()
      .domain([0, d3.max(layers, function(artist) { return d3.max(artist.counts, function(d) { return d.y + d.y0; }); })])
      .range([height, 0]);

  var area = d3.svg.area()
    .x(function(d) { return x(d.time[0]); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });

  var dateFormatter = d3.time.format('%x');
  var vizSvg = svg.append('g');
  var artistInfo = svg.append('g').append('text');
  var timeInfo = d3.select('#viz-info .time-info');
  var weeklyInfoTable = d3.select('#viz-info .weekly-info').append('table');

  // Handle layers and hover behavior
  vizSvg.selectAll(".layer")
      .data(layers)
    .enter().append("path")
      .attr('class', 'layer')
      .attr("d", function(d) { return area(d.counts); })
      .style("fill", function() { return color(Math.random()); })
      .on('mousemove', function(d, i) {
        var mousePos = d3.mouse(this);
        artistInfo.text(d.name)
          .attr('x', function() {
            if (width - mousePos[0] < 200) {
              return mousePos[0] - 70;
            } else {
              return mousePos[0] + 10;
            }
          })
          .attr('y', function() { return mousePos[1] - 10; });

        d3.select(this)
          .style('stroke-width', '2px')
          .style('stroke', '#000');
      })
      .on('mouseout', function() {
        artistInfo.text('');
        d3.select(this)
          .style('stroke-width', '0px');
      });

  // Handle weekly chart display
  d3.select('svg')
    .on('mousemove', function() {
        var i = findDate(json[0].counts, x.invert(d3.mouse(this)[0]));
        var weeklyStats = json.map(function(artist) {
          return {name: artist.name, count: artist.counts[i].count, start: artist.counts[i].time[0]};
        })
          .filter(function(a) { return a.count > 0; })
          .sort(function(a, b) {
            return b.count - a.count;
          });

        var rows = weeklyInfoTable
          .selectAll('tr')
          .data(weeklyStats, function(d) { if (d) return d.name + d.start; });
        rows.order();
        rows.enter()
          .append('tr')
          .selectAll('td').data(function(row) {
            return ['name', 'count'].map(function(c) {
              return {name: c, value: row[c]};
            });
          }).enter()
            .append('td')
            .text(function(d) { return d.value; })
            .attr('class', function(d) { return d.name; });
        rows.exit().remove();

        timeInfo.text(dateFormatter(new Date(json[0].counts[i].time[0] * 1000)));
    });
});
