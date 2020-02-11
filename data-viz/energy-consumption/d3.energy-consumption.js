// set the dimensions and margins of the graph
var actualWidth = document.getElementById("my_dataviz").clientWidth;
var actualHeight = document.getElementById("my_dataviz").clientHeight;
var margin = {
    top: 10,
    right: 0,
    bottom: 50,
    left: 0
  },

  width = actualWidth - margin.left - margin.right,
  height = actualHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("energy-consumption.csv", function(data) {
  // List of groups = header of the csv files
  var keys = data.columns.slice(1)
  // Add X axis

  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) {
      return d.year;
    }))
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(22));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 1000000])
    .range([height, 0]);
  svg.append("g")
  //.call(d3.axisLeft(y));

  // color palette
  var color = d3.scaleOrdinal()
    .domain(keys)
    .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33'])

  //stack the data?
  var stackedData = d3.stack()
    .keys(keys)
    (data)
  //console.log("This is the stack result: ", stackedData)

  // Show the areas
  svg
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
    .style("fill", function(d) {
      console.log(d.key);
      return color(d.key);
    })
    .attr("d", d3.area()
      .x(function(d, i) {
        return x(d.data.year);
      })
      .y0(function(d) {
        return y(d[0]);
      })
      .y1(function(d) {
        return y(d[1]);
      })
    )
})

var svg2 = d3.select("#my_dataviz2");

var path = d3.geoPath();
var projection = d3.geoMercator()
  .center([89, 26.5])
  .scale(1300)

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
.domain([0, 250, 500, 1000, 2000, 4000, 8000, 16000])
.range(d3.schemeReds[9]);

// Load external data and boot
d3.queue()
  .defer(d3.json, "india-states-geo.json")
  .defer(d3.csv, "energy_chloropleth.csv", function(d) {
    data.set(d.name, +d.value);
  })
  .await(ready);

function ready(error, topo) {

  // Draw the map
  svg2.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
    // draw each country
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    .style("stroke", "#FFFFFF")
    .attr("stroke-width", "0.04em")
    .style("opacity", 1)
    // set the color of each country
    .attr("fill", function(d) {
      d.total = data.get(d.properties.NAME_1) || 0;
      return colorScale(d.total);
    });
}
