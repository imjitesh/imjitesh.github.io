// set the dimensions and margins of the graph

var margin = {top: 40, right: 0, bottom: 30, left: 105},
width = document.getElementById("my_dataviz1").offsetWidth - margin.left - margin.right,
height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz1")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://production-karona.s3.us-east-2.amazonaws.com/active/compiled.csv", function(data) {

// Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
var myGroups = d3.map(data, function(d){return d.group;}).keys()
var myVars = d3.map(data, function(d){return d.variable;}).keys()

// Build X scales and axis:
var x = d3.scaleBand()
.range([ 0, width ])
.domain(myGroups)
.padding(0.05);
svg.append("g").attr("class", "ticks")
.attr("transform", "translate(0," + 0 + ")")
.call(d3.axisTop(x).tickSize(0))
.select(".domain").remove()

// Build Y scales and axis:
var y = d3.scaleBand()
.range([ height, 0 ])
.domain(myVars)
.padding(0.05);
svg.append("g").attr("class", "ticks")
.call(d3.axisLeft(y).tickSize(0))
.select(".domain").remove()

// Build color scale
var myColor = d3.scaleThreshold()
.domain([1, 2, 4, 8, 16, 32, 64, 128, 256])
.range(d3.schemeBlues[9]);

//create a tooltip
var tooltip = d3.select("#my_dataviz1")
.append("div")
.style("opacity", 0)
.attr("class", "tooltip")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "1px")
.style("border-radius", "0px")
.style("padding", "5px")

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(d) {
tooltip
  .style("display", "block");
d3.select(this)
  .style("stroke", "black")
  .style("opacity", 1);
}
var mousemove = function(d) {
tooltip
  .html(d.value + " total confirmed cases")
  .style("left", (d3.mouse(this)[0]+70) + "px")
  .style("top", (d3.mouse(this)[1]) + "px")
}
var mouseleave = function(d) {
tooltip
  .style("display", "none");
d3.select(this)
  .style("stroke", "none")
  .style("opacity", 0.8)
}

// add the squares
svg.selectAll()
.data(data, function(d) {return d.group+':'+d.variable;})
.enter()
.append("rect")
  .attr("x", function(d) { return x(d.group) })
  .attr("y", function(d) { return y(d.variable) })
  .attr("rx", 1)
  .attr("ry", 1)
  .attr("width", x.bandwidth() )
  .attr("height", y.bandwidth() )
  .style("fill", function(d) { return myColor(d.value)} )
  .style("stroke-width", 2)
  .style("stroke", "none")
  .style("opacity", 0.8)
.on("mouseover", mouseover)
.on("mousemove", mousemove)
.on("mouseleave", mouseleave)
})
