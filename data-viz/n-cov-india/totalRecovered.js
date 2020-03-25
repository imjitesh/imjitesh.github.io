// set the dimensions and margins of the graph
var margin = {top: 40, right: 25, bottom: 30, left: 80},
width = 1200 - margin.left - margin.right,
height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg2 = d3.select("#my_dataviz2")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://production-karona.s3.us-east-2.amazonaws.com/recovered/compiled.csv", function(data) {

// Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
var myGroups2 = d3.map(data, function(d){return d.group;}).keys()
var myVars2 = d3.map(data, function(d){return d.variable;}).keys()

// Build X scales and axis:
var x2 = d3.scaleBand()
.range([ 0, width ])
.domain(myGroups2)
.padding(0.05);
svg.append("g")
.style("font-size", 12)
.attr("transform", "translate(0," + 0 + ")")
.call(d3.axisTop(x2).tickSize(0))
.select(".domain").remove()

// Build Y scales and axis:
var y2 = d3.scaleBand()
.range([ height, 0 ])
.domain(myVars2)
.padding(0.05);
svg2.append("g")
.style("font-size", 10)
.call(d3.axisLeft(y2).tickSize(0))
.select(".domain").remove()

// Build color scale
var myColor2 = d3.scaleThreshold()
  .domain([1, 2, 4, 8, 16, 32, 64, 128, 256])
  .range(d3.schemeBlues[9]);

//create a tooltip
var tooltip2 = d3.select("#my_dataviz")
.append("div")
.style("opacity", 0)
.attr("class", "tooltip")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "1px")
.style("border-radius", "0px")
.style("padding", "5px")

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover2 = function(d) {
tooltip2
  .style("opacity", 1);
d3.select(this)
  .style("stroke", "black")
  .style("opacity", 1);
}
var mousemove2 = function(d) {
tooltip2
  .html(d.value + " total confirmed cases")
  .style("left", (d3.mouse(this)[0]+70) + "px")
  .style("top", (d3.mouse(this)[1]) + "px")
}
var mouseleave2 = function(d) {
tooltip2
  .style("opacity", 0)
d3.select(this)
  .style("stroke", "none")
  .style("opacity", 0.8)
}

// add the squares
svg2.selectAll()
.data(data, function(d) {return d.group+':'+d.variable;})
.enter()
.append("rect")
  .attr("x", function(d) { return x2(d.group) })
  .attr("y", function(d) { return y2(d.variable) })
  .attr("rx", 1)
  .attr("ry", 1)
  .attr("width", x2.bandwidth() )
  .attr("height", y2.bandwidth() )
  .style("fill", function(d) { return myColor2(d.value)} )
  .style("stroke-width", 2)
  .style("stroke", "none")
  .style("opacity", 0.8)
.on("mouseover", mouseover2)
.on("mousemove", mousemove2)
.on("mouseleave", mouseleave2)
})
