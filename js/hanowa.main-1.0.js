import * as THREE from '/build/three.module.js';

import Stats from '/examples/jsm/libs/stats.module.js';

import {
  OrbitControls
} from '/examples/jsm/controls/OrbitControls.js';

import {
  FlyControls
} from '/examples/jsm/controls/FlyControls.js';

import {
  PCDLoader
} from '/examples/jsm/loaders/PCDLoader.js';

var container, stats;
var camera, controls, scene, renderer, parentScene;
var boxes = [];
var currentFrame = 0;

init();
animate();

function init() {
  pcdLoader(sensorData);

  parentScene = new THREE.Scene();
  parentScene.background = new THREE.Color(0x000000);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  parentScene.add(scene);
  camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.01, 8000);

  //camera.up.set(0, 0, 1);
  camera.position.set(-54, 0, 19);
  camera.rotation.set(0, -Math.PI / 2.5, -Math.PI / 2);

  scene.add(camera);
  var axesHelper = new THREE.AxesHelper(1);
  scene.add(axesHelper);

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  container = document.getElementById("intro");

  container.appendChild(renderer.domElement);

  /*controls = new FlyControls(camera, renderer.domElement);
  controls.movementSpeed = 0.3;
  controls.rollSpeed = Math.PI / 720;
  controls.autoForward = false;
  controls.dragToLook = false;*/

  controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.08;
  controls.keyPanSpeed = 40;
  controls.screenSpacePanning = false;
  controls.minDistance = 0;
  controls.maxDistance = 5000;
  controls.maxPolarAngle = Math.PI;
  controls.keys = {
      LEFT: 65, //left arrow
      UP: 87, // up arrow
      RIGHT: 68, // right arrow
      BOTTOM: 83 // down arrow
  }
  // movement - please calibrate these values

  //controls.autoRotate = true;
  // world

  //stats = new Stats();
  //container.appendChild( stats.dom );

  window.addEventListener('keypress', keyboard);

  window.addEventListener('resize', onWindowResize, false);

  loadJSON(function(response) {
    // Parse JSON string into object
    boxes = JSON.parse(response);
    boxes.forEach(function(frame) {
      frame['boxes'].forEach(function(box) {
        let cube = new THREE.LineSegments( new THREE.EdgesGeometry( new THREE.BoxBufferGeometry( box.dimensions.length, box.dimensions.width, box.dimensions.height) ), new THREE.LineBasicMaterial( { color: 0xffff00 } ) );
        if (frame.frame_id != currentFrame) {
          cube.visible = false;
        }
        scene.add(cube);
        //scene.add(line);
        cube.name = "box" + frame.frame_id;
        cube.position.x = box.center.x;
        cube.position.y = box.center.y;
        cube.position.z = box.center.z;
        cube.rotation.x = box.rotation.x;
        cube.rotation.y = box.rotation.y;
        cube.rotation.z = box.rotation.z;
      })

    })
  });



  //add some lighting
  // var ambientLight = new THREE.AmbientLight(0xffffff);
  // scene.add(ambientLight);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  //controls.handleResize();

}

function keyboard(ev) {

  var points = scene.getObjectByName(currentFrame);
  switch (ev.key || String.fromCharCode(ev.keyCode || ev.charCode)) {

    case ']':
      for (var i = 0; i < sensorData.length; i++) {
        points = scene.getObjectByName(i);
        points.material.size *= 1.1;
        points.material.needsUpdate = true;
      }

      break;

    case '[':
      for (var i = 0; i < sensorData.length; i++) {
        points = scene.getObjectByName(i);
        points.material.size /= 1.1;
        points.material.needsUpdate = true;
      }
      break;

    case 16:
      controls.movementSpeed = 10;
      break;

    case '=':
      if (!(typeof scene === 'undefined') && currentFrame < sensorData.length - 1) {
        scene.getObjectByName(currentFrame).visible = false;
        scene.children.forEach(function(cube) {
          if (cube.name == 'box' + currentFrame) {
            cube.visible = false;
          }
        })
        currentFrame += 1;
        document.getElementById("cur-frame-bar").setAttribute("aria-valuenow", (currentFrame+1)/(sensorData.length)*100);
        document.getElementById("cur-frame-bar").style.width = (currentFrame+1)/(sensorData.length)*100 + "%";
        document.getElementById("frame-info").innerHTML = (currentFrame+1) + " / " + sensorData.length;
        scene.getObjectByName(currentFrame).visible = true;
        scene.children.forEach(function(cube) {
          if (cube.name == 'box' + currentFrame) {
            cube.visible = true;
          }
        })
      }
      break;

    case '-':
      if (!(typeof scene === 'undefined') && currentFrame >= 1) {
        scene.getObjectByName(currentFrame).visible = false;
        scene.children.forEach(function(cube) {
          if (cube.name == 'box' + currentFrame) {
            cube.visible = false;
          }
        })
        currentFrame -= 1;
        document.getElementById("cur-frame-bar").setAttribute("aria-valuenow", (currentFrame+1)/(sensorData.length)*100);
        document.getElementById("cur-frame-bar").style.width = (currentFrame+1)/(sensorData.length)*100 + "%";
        document.getElementById("frame-info").innerHTML = (currentFrame+1) + " / " + sensorData.length;
        scene.getObjectByName(currentFrame).visible = true;
        scene.children.forEach(function(cube) {
          if (cube.name == 'box' + currentFrame) {
            cube.visible = true;
          }
        })
      }
      break;
  }
}

function animate() {
  requestAnimationFrame(animate);
  //controls.update(1);
  renderer.render(scene, camera);
  //stats.update();
}

function pcdLoader(sensorData) {
  var loader = new PCDLoader();
  document.getElementById("frame-info").innerHTML = (currentFrame+1) + " / " + sensorData.length;
  document.getElementById("cur-frame-bar").setAttribute("aria-valuenow", (currentFrame+1)/(sensorData.length)*100);
  document.getElementById("cur-frame-bar").style.width = (currentFrame+1)/(sensorData.length)*100 + "%";
  var loadCounter = 0;
  sensorData.forEach(function(frame, idx) {
    loader.load(frame, function(points) {
      points.material.color.setHex(16777215);
      points.material.size = 0.2;
      points.name = idx;
      if (idx > 0) {
        points.visible = false;
      }
      loadCounter += 1;
      console.log((loadCounter)/(sensorData.length)*100 + "%");
      document.getElementById("load-frame-bar").setAttribute("aria-valuenow", (loadCounter)/(sensorData.length)*100);
      document.getElementById("load-frame-bar").style.width = (loadCounter)/(sensorData.length)*100 + "%";
      scene.add(points);
    });
  })
}

function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', lidarLabelUrl, true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}
