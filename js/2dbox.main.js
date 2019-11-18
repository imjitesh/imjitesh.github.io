let data_source = [];
let currentFrame = 0;
let currentOpacity = 1.0;
$.getJSON("scene_data.json", function(data) {
  document.getElementById('scene_id').innerHTML = data['scene_id'];
  data_source = data['data_source'];
  image_urls = {
    "image_url": data_source[currentFrame].image_url
  }
  loadImages(image_urls, function(images) {
    draw(images.image_url, context);
  });
  document.getElementById("cur-frame-bar").setAttribute("aria-valuenow", (currentFrame + 1) / (data_source.length) * 100);
  document.getElementById("cur-frame-bar").style.width = (currentFrame + 1) / (data_source.length) * 100 + "%";
  document.getElementById("frame-info").innerHTML = (currentFrame + 1) + " / " + data_source.length;
});

function draw(img, ctx) {
  var canvas = ctx.canvas;
  var hRatio = canvas.width / img.width;
  var vRatio = canvas.height / img.height;
  var ratio = Math.min(hRatio, vRatio);
  if (img.width < canvas.width && img.height < canvas.height) {
    ratio = 1;
  }
  var centerShift_x = (canvas.width - img.width * ratio) / 2;
  var centerShift_y = (canvas.height - img.height * ratio) / 2;

  context.beginPath();
  ctx.drawImage(img, 0, 0, img.width, img.height, (canvas.width - img.width) / 2, (canvas.height - img.height) / 2, img.width, img.height);
  data_source[currentFrame]['boxes'].forEach(function(box) {
    let xmin = box.xmin + (canvas.width - img.width) / 2;
    let ymin = box.ymin + (canvas.height - img.height) / 2;
    let width = box.xmax - box.xmin;
    let height = box.ymax - box.ymin;
    ctx.lineWidth = "2";
    ctx.strokeStyle = "rgba(0,0,255,"+currentOpacity+")";
    ctx.rect(xmin, ymin, width, height);
  })
  ctx.stroke();
}

function loadImages(sources, callback) {
  var images = {};
  var loadedImages = 0;
  var numImages = 0;
  // get num of sources
  for (var src in sources) {
    numImages++;
  }
  for (var src in sources) {
    images[src] = new Image();
    images[src].onload = function() {
      if (++loadedImages >= numImages) {
        callback(images);
      }
    };
    images[src].src = sources[src];
  }
}

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.addEventListener("keypress", changeOpacity, false);
function changeOpacity(ev) {
  switch (ev.key || String.fromCharCode(ev.keyCode || ev.charCode)) {
    case '1':
      loadImages(image_urls, function(images) {
        currentOpacity = 0.0;
        context.globalAlpha = 1.0;
        draw(images.image_url, context);
      });
      break;
    case '2':
      loadImages(image_urls, function(images) {
        currentOpacity = 0.5;
        context.globalAlpha = 1.0;
        draw(images.image_url, context);
      });
      break;
    case '3':
      loadImages(image_urls, function(images) {
        currentOpacity = 1.0;
        context.globalAlpha = 1.0;
        draw(images.image_url, context);
      });
      break
    case '=':
      currentFrame += 1 ? currentFrame < data_source.length - 1 : data_source.length - 1;
      context.clearRect(0, 0, canvas.width, canvas.height);
      image_urls = {
        "image_url": data_source[currentFrame].image_url
      };
      loadImages(image_urls, function(images) {
        context.globalAlpha = 1;
        draw(images.image_url, context);
      });
      document.getElementById("cur-frame-bar").setAttribute("aria-valuenow", (currentFrame + 1) / (data_source.length) * 100);
      document.getElementById("cur-frame-bar").style.width = (currentFrame + 1) / (data_source.length) * 100 + "%";
      document.getElementById("frame-info").innerHTML = (currentFrame + 1) + " / " + data_source.length;
      break;
    case '-':
      currentFrame -= 1 ? currentFrame > 0 : 0;
      context.clearRect(0, 0, canvas.width, canvas.height);
      image_urls = {
        "image_url": data_source[currentFrame].image_url
      };
      loadImages(image_urls, function(images) {
        context.globalAlpha = 1.0;
        draw(images.image_url, context);
      });
      document.getElementById("cur-frame-bar").setAttribute("aria-valuenow", (currentFrame + 1) / (data_source.length) * 100);
      document.getElementById("cur-frame-bar").style.width = (currentFrame + 1) / (data_source.length) * 100 + "%";
      document.getElementById("frame-info").innerHTML = (currentFrame + 1) + " / " + data_source.length;
      break
  }
}
