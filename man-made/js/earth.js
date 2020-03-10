(function() {

  var webglEl = document.getElementById('webgl');

  if (!Detector.webgl) {
    Detector.addGetWebGLMessage(webglEl);
    return;
  }

  var width = window.innerWidth,
    height = window.innerHeight;

  // Earth params
  var radius = 0.4258750456,
    segments = 64,
    rotation = 0;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, width / height, 0.001, 1000000);
  //camera.position.z = 1.5;

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  webglEl.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0x333333));

  var light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  var sphere = createSphere(radius, segments);
  sphere.rotation.y = rotation;
  scene.add(sphere)

  var geometry = new THREE.SphereGeometry(0.05, segments, segments);
  var material = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('images/moon_4k.jpg')
  })
  var moon = new THREE.Mesh(geometry, material);
  moon.translate(1.5, 0, 0);
  moon.position.set(1, 0, 0);
  scene.add(moon);

  camera.position.z = 2.5;

  var clouds = createClouds(radius, segments);
  clouds.rotation.y = rotation;
  scene.add(clouds)

  var stars = createStars(10000, 64);
  scene.add(stars);

  var controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);

  var animate = function() {
    controls.update();
    sphere.rotation.y += 0.001;
    moon.rotation.y += 0.001;
    clouds.rotation.y += 0.001;
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
	function onDocumentMouseWheel( event ) {
    var fovMAX = 160;
    var fovMIN = 1;
    // camera.fov -= event.wheelDeltaY * 0.05;
    // camera.fov = Math.max( Math.min( camera.fov, fovMAX ), fovMIN );
    // camera.projectionMatrix = new THREE.Matrix4().makePerspective(camera.fov, window.innerWidth / window.innerHeight, camera.near, camera.far);
		console.log(camera.position);
}

  function createSphere(radius, segments) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius, segments, segments),
      new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('images/2_no_clouds_4k.jpg'),
        bumpMap: THREE.ImageUtils.loadTexture('images/elev_bump_4k.jpg'),
        bumpScale: 0.005,
        specularMap: THREE.ImageUtils.loadTexture('images/water_4k.png'),
        specular: new THREE.Color('grey')
      })
    );
  }

  function createClouds(radius, segments) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius + 0.003, segments, segments),
      new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('images/fair_clouds_4k.png'),
        transparent: true
      })
    );
  }

  function createStars(radius, segments) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius, segments, segments),
      new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('images/galaxy_starfield.jpg'),
        side: THREE.BackSide
      })
    );
  }

}());
