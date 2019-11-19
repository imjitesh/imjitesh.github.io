// The svg
var svg = d3.select("#my_dataviz"),
  width = +svg.attr("width"),
  height = +svg.attr("height");
// The svg
var svg2 = d3.select("#my_dataviz2"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

var svg3 = d3.select("#my_dataviz3"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

var svg4 = d3.select("#my_dataviz4"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Map and projection
var projection = d3.geoMercator()
  .center([112, 16]) // GPS of location to zoom on
  .scale(630) // This is like the zoom

d3.queue()
  .defer(d3.json, "india-geo.json") // World shape
  .defer(d3.csv, "data_gpsLocSurfer.csv") // Position of circles
  .await(ready);

function ready(error, dataGeo, data) {
  // Create a color scale
  var allContinent = d3.map(data, function(d) {
    return (d.type)
  }).keys()
  var color = function(energy_type) {
    if (energy_type === 'Nuclear') {
      return "#00FF00";
    }
    if (energy_type === 'Coal') {
      return "#CCCCCC";
    }
    if (energy_type === 'Hydro') {
      return "#00FFFF";
    }
    if (energy_type === 'Solar') {
      return "#FFFF33";
    }
    if (energy_type === 'Wind') {
      return "#0000FF";
    }
    if (energy_type === 'Gas') {
      return "#FFA500";
    }
    if (energy_type === 'Biomass') {
      return "#0F0F00";
    }
    if (energy_type === 'Oil') {
      return "#FF0000";
    }
    if (energy_type === 'Geothermal') {
      return "#000F0F";
    }
  }

  // var color = d3.scaleOrdinal()
  //   .domain(allContinent)
  //   .range(d3.schemePaired);

  // Add a scale for bubble size
  var valueExtent = d3.extent(data, function(d) {
    return +d.n;
  })
  var size = d3.scaleSqrt()
    .domain(valueExtent) // What's in the data
    .range([2, 10]) // Size in pixel

  // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(dataGeo.features)
    .enter()
    .append("path")
    .attr("fill", "#000000")
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    .style("stroke", "#070707")
    .attr("stroke-width", "0.04em")
    .style("opacity", 1)

  // Draw the map
  svg2.append("g")
    .selectAll("path")
    .data(dataGeo.features)
    .enter()
    .append("path")
    .attr("fill", "#000000")
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    .style("stroke", "#070707")
    .attr("stroke-width", "0.04em")
    .style("opacity", 1)

  svg3.append("g")
    .selectAll("path")
    .data(dataGeo.features)
    .enter()
    .append("path")
    .attr("fill", "#000000")
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    .style("stroke", "#070707")
    .attr("stroke-width", "0.04em")
    .style("opacity", 1)

  svg4.append("g")
    .selectAll("path")
    .data(dataGeo.features)
    .enter()
    .append("path")
    .attr("fill", "#000000")
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    .style("stroke", "#070707")
    .attr("stroke-width", "0.04em")
    .style("opacity", 1)


  // Add circles:
  svg
    .selectAll("myCircles")
    .data(data.sort(function(a, b) {
      return +b.n - +a.n
    }).filter(function(d, i) {
      return i > 0
    }))
    .data(data.filter(function(d) {
      if (d.type == "Coal") {
        return true;
      }
      if (d.type == "Oil") {
        return true;
      }
      if (d.type == "Gas") {
        return true;
      }
    }))
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      return projection([+d.homelon, +d.homelat])[0]
    })
    .attr("cy", function(d) {
      return projection([+d.homelon, +d.homelat])[1]
    })
    .attr("r", function(d) {
      return size(+d.n)
    })
    .style("fill", function(d) {
      return color(d.type)
    })
    //.attr("stroke", function(d){ if(d.n>2000){return "black"}else{return "none"}  })
    .attr("stroke", "none")
    .attr("stroke-width", 1)
    .attr("fill-opacity", 1)

  svg2
    .selectAll("myCircles")
    .data(data.sort(function(a, b) {
      return +b.n - +a.n
    }).filter(function(d, i) {
      return i > 0
    }))
    .data(data.filter(function(d) {
      if (d.type == "Solar") {
        return true;
      }
      if (d.type == "Wind") {
        return true;
      }
      if (d.type == "Hydro") {
        return true;
      }
      if (d.type == "Biomass") {
        return true;
      }
      if (d.type == "Geothermal") {
        return true;
      }

    }))
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      return projection([+d.homelon, +d.homelat])[0]
    })
    .attr("cy", function(d) {
      return projection([+d.homelon, +d.homelat])[1]
    })
    .attr("r", function(d) {
      return size(+d.n)
    })
    .style("fill", function(d) {
      return color(d.type)
    })
    //.attr("stroke", function(d){ if(d.n>2000){return "black"}else{return "none"}  })
    .attr("stroke", "none")
    .attr("stroke-width", 1)
    .attr("fill-opacity", 1)

  svg3
    .selectAll("myCircles")
    .data(data.sort(function(a, b) {
      return +b.n - +a.n
    }).filter(function(d, i) {
      return i > 0
    }))
    .data(data.filter(function(d) {
      return d.type == "Nuclear";
    }))
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      return projection([+d.homelon, +d.homelat])[0]
    })
    .attr("cy", function(d) {
      return projection([+d.homelon, +d.homelat])[1]
    })
    .attr("r", function(d) {
      return size(+d.n)
    })
    .style("fill", function(d) {
      return color(d.type)
    })
    //.attr("stroke", function(d){ if(d.n>2000){return "black"}else{return "none"}  })
    .attr("stroke", "none")
    .attr("stroke-width", 1)
    .attr("fill-opacity", 1)
}
