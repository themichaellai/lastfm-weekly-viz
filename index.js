var stack = d3.layout.stack().offset("wiggle")
  .values(function(d) { return d.counts; })
  .x(function(d) { return d.time[0]; })
  .y(function(d) { return d.count; });

var width = 960,
    height = 500;


var color = d3.scale.linear()
    .range(["#aad", "#556"]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json('final.json', function(e, json) {
  var x = d3.scale.linear()
      .domain([json[0]['counts'][0]['time'][0], json[0]['counts'][json[0]['counts'].length - 1]['time'][0]])
      .range([0, width]);
  window.xRange = x;
  console.log('domain', [json[0]['counts'][0]['time'][0], json[0]['counts'][json[0]['counts'].length - 1]['time'][0]])


  window.yRange = y;
  var json = json.map(function(artist, i) {
    return artist;
  }).filter(function(artist) {
    return ['Radiohead', 'Death Cab for Cutie', 'Kanye West', 'Spoon', 'Bloc Party', 'Flying Lotus',
      'Nine Inch Nails', 'Frank Ocean', 'Coldplay', 'Tyler, the Creator', 'Gorillaz', 'Kid Cudi', 'of Montreal']
        .indexOf(artist.name) >= 0;
  });
  var layers = stack(json);
  var y = d3.scale.linear()
      .domain([0, d3.max(layers, function(artist) { return d3.max(artist.counts, function(d) { return d.y + d.y0; }); })])
      .range([height, 0]);
  console.log(json.length);
  console.log(layers);
  var area = d3.svg.area()
    .x(function(d) { /*console.log('x', d, x(d.time[0]));*/ return x(d.time[0]); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { /*console.log('area y1', d.y0 + d.y, y(d.y0 + d.y));*/ return y(d.y0 + d.y); });

  svg.selectAll(".layer")
      .data(layers)
    .enter().append("path")
      .attr('class', 'layer')
      .attr("d", function(d) { return area(d.counts); })
      .style("fill", function() { return color(Math.random()); })
      .on('mouseover', function(d) {
        console.log(d.name);
      });
});


// Inspired by Lee Byron's test data generator.
//function bumpLayer(n) {
//
//  function bump(a) {
//    var x = 1 / (.1 + Math.random()),
//        y = 2 * Math.random() - .5,
//        z = 10 / (.1 + Math.random());
//    for (var i = 0; i < n; i++) {
//      var w = (i / n - y) * z;
//      a[i] += x * Math.exp(-w * w);
//    }
//  }
//
//  var a = [], i;
//  for (i = 0; i < n; ++i) a[i] = 0;
//  for (i = 0; i < 5; ++i) bump(a);
//  var res = a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
//  console.log('returning', res.map(function(asdf) { return JSON.stringify(asdf); }), res.length);
//  return res;
//}
