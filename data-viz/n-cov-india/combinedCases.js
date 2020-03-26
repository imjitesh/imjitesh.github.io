
var margin = {top: 40, right: 0, bottom: 30, left: 105},
width = document.getElementById("my_dataviz0").offsetWidth - margin.left - margin.right,
height = 450 - margin.top - margin.bottom;

var svg = d3.select("#my_dataviz0").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)

g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set x scale
var x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1);

// set y scale
var y = d3.scaleLinear()
    .rangeRound([height, 0]);

// set the colors
var z = d3.scaleOrdinal()
    .range(["rgb(33, 113, 181)", "rgb(116, 196, 118)", "rgb(173, 55, 31)"]);

// load the csv and create the chart
d3.csv("https://production-karona.s3.us-east-2.amazonaws.com/combined/compiled.csv", function(d, i, columns) {
  document.getElementById("confirmed-ticker").textContent = d.Confirmed;
  document.getElementById("recover-ticker").textContent = d.Recovered;
  document.getElementById("death-ticker").textContent = d.Deaths;
  console.log();
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);

  //data.sort(function(a, b) { return b.total - a.total; });
  x.domain(data.map(function(d) { return d.State; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  z.domain(keys);

  g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.State); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) {return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())
      .attr("opacity",0.8)
    .on("mouseover", function() { tooltip.style("display", "block"); })
    .on("mouseout", function() { tooltip.style("display", "none"); d3.select(this).attr("opacity",0.8);})
    .on("mousemove", function(d) {
      d3.select(this).attr("opacity",1);
      var xPosition = d3.mouse(this)[0] + 70;
      var yPosition = d3.mouse(this)[1] + 50;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      if(d[1] == d.data.total)tooltip.select("text").text(d[1]-d[0]+" deaths");
      if(d[0] == d.data.Confirmed)tooltip.select("text").text(d[1]-d[0]+" recovered");
      if(d[0] == 0)tooltip.select("text").text(d[1]-d[0]+" active");

    });

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("text-anchor", "start");

  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 8)
      .attr("text-anchor", "front")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate("+(-width)*0.9+"," + (i-1) * 20 + ")"; });

  legend.append("rect")
      .attr("x", width)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width+22)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
});

  // Prep the tooltip bits, initial display is hidden
  var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");

  tooltip.append("rect")
    .attr("width", 80)
    .attr("height", 20)
    .attr("line-height",20)
    .attr("fill", "white")
    .style("opacity", 1);

  tooltip.append("text")
    .attr("x", 40)
    .attr("dy", "1.3em")
    .style("text-anchor", "middle")
