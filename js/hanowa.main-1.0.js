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
var lidarLabelUrl = 'https://s3-ap-south-1.amazonaws.com/scalar-prod/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar_labels/segment-1208303279778032257_1360_000_1380_000_lidar_labels.json';

let pcdFiles = [
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000000.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000001.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000002.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000003.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000004.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000005.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000006.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000007.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000008.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000009.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000010.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000011.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000012.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000013.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000014.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000015.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000016.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000017.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000018.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000019.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000020.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000021.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000022.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000023.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000024.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000025.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000026.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000027.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000028.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000029.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000030.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000031.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000032.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000033.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000034.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000035.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000036.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000037.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000038.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000039.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000040.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000041.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000042.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000043.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000044.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000045.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000046.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000047.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000048.bin',
  'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000049.bin'
]

init();
animate();

function init() {
  pcdLoader(pcdFiles);

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

  /*controls = new OrbitControls(camera, renderer.domElement);

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
  //container.appendChild( stats.dom );*/

  window.addEventListener('keypress', keyboard);

  window.addEventListener('resize', onWindowResize, false);

  loadJSON(function(response) {
    // Parse JSON string into object
    boxes = JSON.parse(response);
    boxes.forEach(function(frame) {
      frame['boxes'].forEach(function(box) {
        var geometry = new THREE.BoxGeometry(box.dimensions.length, box.dimensions.width, box.dimensions.height);
        //var tempColor = box.color.split('(')[1].split(')')[0].split(',');
        var tempColor = [10, 234, 123];
        var cubeColor = parseInt(tempColor[2]) * 65536 + parseInt(tempColor[1]) * 256 + parseInt(tempColor[0]);
        var material = new THREE.MeshBasicMaterial({
          color: cubeColor,
          transparent: true,
          opacity: 0.2
        });
        var cube = new THREE.Mesh(geometry, material);
        if (frame.frame_id != currentFrame) {
          cube.visible = false;
        }
        scene.add(cube);
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
  controls.handleResize();

}

function keyboard(ev) {

  var points = scene.getObjectByName(currentFrame);
  switch (ev.key || String.fromCharCode(ev.keyCode || ev.charCode)) {

    case ']':
      for (var i = 0; i < pcdFiles.length; i++) {
        points = scene.getObjectByName(i);
        points.material.size *= 1.1;
        points.material.needsUpdate = true;
      }

      break;

    case '[':
      for (var i = 0; i < pcdFiles.length; i++) {
        points = scene.getObjectByName(i);
        points.material.size /= 1.1;
        points.material.needsUpdate = true;
      }
      break;

    case 16:
      controls.movementSpeed = 10;
      break;

    case '=':
      if (!(typeof scene === 'undefined') && currentFrame < pcdFiles.length - 1) {

        scene.getObjectByName(currentFrame).visible = false;
        scene.children.forEach(function(cube) {
          if (cube.name == 'box' + currentFrame) {
            cube.visible = false;
          }
        })
        currentFrame += 1;
        document.getElementById("cur-frame-bar").setAttribute("aria-valuenow", (currentFrame+1)/(pcdFiles.length)*100);
        document.getElementById("cur-frame-bar").style.width = (currentFrame+1)/(pcdFiles.length)*100 + "%";
        document.getElementById("frame-info").innerHTML = (currentFrame+1) + " / " + pcdFiles.length;
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
        document.getElementById("cur-frame-bar").setAttribute("aria-valuenow", (currentFrame+1)/(pcdFiles.length)*100);
        document.getElementById("cur-frame-bar").style.width = (currentFrame+1)/(pcdFiles.length)*100 + "%";
        document.getElementById("frame-info").innerHTML = (currentFrame+1) + " / " + pcdFiles.length;
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

function pcdLoader(pcdFiles) {
  var loader = new PCDLoader();
  document.getElementById("frame-info").innerHTML = (currentFrame+1) + " / " + pcdFiles.length;
  document.getElementById("cur-frame-bar").setAttribute("aria-valuenow", (currentFrame+1)/(pcdFiles.length)*100);
  document.getElementById("cur-frame-bar").style.width = (currentFrame+1)/(pcdFiles.length)*100 + "%";
  var loadCounter = 0;
  pcdFiles.forEach(function(pcdFile, idx) {
    loader.load(pcdFile, function(points) {
      points.material.color.setHex(16777215);
      points.material.size = 0.2;
      points.name = idx;
      if (idx > 0) {
        points.visible = false;
      }
      loadCounter += 1;
      console.log((loadCounter)/(pcdFiles.length)*100 + "%");
      document.getElementById("load-frame-bar").setAttribute("aria-valuenow", (loadCounter)/(pcdFiles.length)*100);
      document.getElementById("load-frame-bar").style.width = (loadCounter)/(pcdFiles.length)*100 + "%";
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
