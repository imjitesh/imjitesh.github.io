var histogram = new Array(101).fill(0);
var heading = [];
var _class = {};

fetch(lidarLabelUrl)
  .then(response => {
    return response.json()
  })
  .then(data => {
    data.forEach(function(frame) {
      frame.boxes.forEach(function(annon) {
        var dist = Math.floor(Math.sqrt(annon.center.x * annon.center.x + annon.center.y * annon.center.y + annon.center.z * annon.center.z));
        histogram[dist] = histogram[dist] + 1;
        heading.push(annon.heading_radians);
      })
    })




    var cumulative_histogram = JSON.parse(JSON.stringify(histogram));
    for(var i=0; i<cumulative_histogram.length;i++){
      if(i > 0){cumulative_histogram[i] = cumulative_histogram[i] + cumulative_histogram[i-1];}
    }

    var distance = c3.generate({
      bindto: '#distance',
      data: {
        columns: [
          ['distance'].concat(histogram)
        ],
        type: 'bar',
        colors: {
              distance: '#133345'
          }
      },
      bar: {
        width: {
          ratio: 0.03 // this makes bar width 50% of length between ticks
        }
        // or
        //,width: 3 // this makes bar width 100px
      },
      axis: {
        x: {
          max: 100,
          min: 0,
          tick:{
            count: 5,
            format: function (x) { return parseInt(x); }
          }
        },
        y: {
          label: {
                text: '# of objects',
                position: 'outer-middle'
                // inner-right : default
                // inner-center
                // inner-left
                // outer-right
                // outer-center
                // outer-left
            },
          tick:{
            count: 7,
            format: function (x) { return parseInt(x); }
          }
        }
      },
    tooltip: {
        show: false
    }
    });
    var distance = c3.generate({
      bindto: '#cumulative-distance',
      data: {
        columns: [
          ['cumulativedistance'].concat(cumulative_histogram),
          ['distance'].concat(histogram)
        ],
        type: 'bar',
        colors: {
              cumulativedistance: '#688800',
              distance: '#133345'
          }
      },
      bar: {
        width: {
          ratio: 0.03 // this makes bar width 50% of length between ticks
        }
        // or
        //,width: 3 // this makes bar width 100px
      },
      axis: {
        x: {
          max: 100,
          min: 0,
          tick:{
            count: 5,
            format: function (x) { return parseInt(x); }
          }
        },
        y: {
          label: {
                text: '# of objects',
                position: 'outer-middle'
                // inner-right : default
                // inner-center
                // inner-left
                // outer-right
                // outer-center
                // outer-left
            },
          tick:{
            count: 7,
            format: function (x) { return parseInt(x); }
          }
        }
      },
    tooltip: {
        show: false
    }
    });
  })
  .catch(err => {
    // Do something for an error here
    console.log("something went wrong")
  })
