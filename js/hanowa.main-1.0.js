import * as THREE from '/build/three.module.js';
			import Stats from '/examples/jsm/libs/stats.module.js';
			import { OrbitControls } from '/examples/jsm/controls/OrbitControls.js';
			import { PCDLoader } from '/examples/jsm/loaders/PCDLoader.js';
			var container, stats;
			var camera, camera2, controls, scene, renderer, parentScene;
			var boxes = [];
			var currentFrame = 0;
			let pcdFiles = [
			'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000000.bin',
			'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000001.bin',
			'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000002.bin',
			'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000003.bin',
			'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000004.bin',
			'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000005.bin',
			'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000006.bin',
			'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000007.bin'
			]

			init();
			animate();
			function init() {
				pcdLoader(pcdFiles);

				parentScene = new THREE.Scene();
				parentScene.background = new THREE.Color( 0x000000 );
				parentScene.position.x = 0;
				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0x000000 );
				parentScene.add(scene);
				camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.01, 8000 );
				
				camera.up.set( 0, 0, 1);
				camera.position.set(-0.1,0,100);

				camera2 = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.01, 8000 );
				
				camera2.up.set( 0, 0, 1);
				camera2.position.set(-0.1,0,100);

				scene.add(camera);
				var axesHelper = new THREE.AxesHelper(1);
				scene.add( axesHelper );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				container = document.createElement( 'div' );
				document.body.appendChild( container );
				container.appendChild( renderer.domElement );

				controls = new OrbitControls( camera, renderer.domElement );

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
				//controls.autoRotate = true;
				// world

				stats = new Stats();
				container.appendChild( stats.dom );

				window.addEventListener( 'resize', onWindowResize, false );

				window.addEventListener( 'keypress', keyboard );

				boxes.forEach(function(frame){
					frame['boxes'].forEach(function(box){
						var geometry = new THREE.BoxGeometry( box.dimensions.length, box.dimensions.width, box.dimensions.height );
						//var tempColor = box.color.split('(')[1].split(')')[0].split(',');
						var tempColor = [10,234,123];
						var cubeColor = parseInt(tempColor[2]) * 65536 + parseInt(tempColor[1]) * 256 + parseInt(tempColor[0]);
						var material = new THREE.MeshBasicMaterial( {color: cubeColor, transparent: true, opacity: 0.4} );
						var cube = new THREE.Mesh( geometry, material );
						if(frame.frame_id != currentFrame){cube.visible = false;}
						scene.add(cube);
						cube.name = "cube"+frame.frame_id;
						cube.position.x = box.center.x;
						cube.position.y = box.center.y;
						cube.position.z = box.center.z;
						cube.rotation.x = box.rotation.x;
						cube.rotation.y = box.rotation.y;
						cube.rotation.z = box.rotation.z;
					})
					
				})

				//add some lighting
                // var ambientLight = new THREE.AmbientLight(0xffffff);
                // scene.add(ambientLight);

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
				controls.handleResize();

			}

			function keyboard( ev ) {

				var points = scene.getObjectByName( '5' );
				switch ( ev.key || String.fromCharCode( ev.keyCode || ev.charCode ) ) {

					case ']':
						points.material.size *= 1.1;
						points.material.needsUpdate = true;
						break;

					case '[':
						points.material.size /= 1.1;
						points.material.needsUpdate = true;
						break;

					case '=':
						if (!(typeof scene === 'undefined') && currentFrame < pcdFiles.length-1) {

							scene.getObjectByName(currentFrame).visible = false;
							scene.children.forEach(function(cube){
								if(cube.name == 'cube'+currentFrame){cube.visible = false;}
							})
							currentFrame += 1;
							scene.getObjectByName(currentFrame).visible = true;
							scene.children.forEach(function(cube){
								if(cube.name == 'cube'+currentFrame){cube.visible = true;}
							})
							}
						break;

					case '-':
						if (!(typeof scene === 'undefined') && currentFrame >= 1) {
							scene.getObjectByName(currentFrame).visible = false;
							scene.children.forEach(function(cube){
								if(cube.name == 'cube'+currentFrame){cube.visible = false;}
							})
							currentFrame -= 1;
							scene.getObjectByName(currentFrame).visible = true;
							scene.children.forEach(function(cube){
								if(cube.name == 'cube'+currentFrame){cube.visible = true;}
							})
							}
						break;
				}
			}
			function animate() {
				requestAnimationFrame( animate );
				controls.update();
				renderer.render( scene, camera );
				stats.update();
			}

			function pcdLoader(pcdFiles){
				var loader = new PCDLoader();
				pcdFiles.forEach(async function(pcdFile,idx){
					loader.load( pcdFile, function ( points ) {
					points.material.color.setHex(16777215);
					points.material.size = 0.2;
					points.name = idx;
					if(idx > 0){points.visible = false;}
					scene.add(points);
				});
				})
			}