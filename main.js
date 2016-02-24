window.onload = function() {	

    		var container, stats;

			var camera, scene, renderer;

			var cube, plane, edges, boxes, things;

			var mouseVector, raycaster, intersection; // all raycaster-related variables

			var div = 12;
			var xDelta;
			var zDelta = -160;
			var thingsChildren;

			var targetRotation = 0;
			var targetRotationOnMouseDown = 0;

			var mouseX = 0;
			var mouseXOnMouseDown = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;

			var group, text, textMaterial;

			var theText = "Sep 15"; // the string to draw

			var hash = document.location.hash.substr( 1 );

				if ( hash.length !== 0 ) {

					theText = hash;

				}

			var text3d = new THREE.TextGeometry( theText, {

					size: 15,
					height: 2,
					curveSegments: 5,
					font: "helvetiker"

				});

			var colors = d3.scale.linear()
			.domain([10, 290])
			.range(['#336699', '#E74C3C']);

			init();
			animate();

			function init() {

				container = document.getElementById( 'container' );

				containerWidth = container.clientWidth;
				containerHeight = container.clientHeight;

				raycaster = new THREE.Raycaster();
				mouseVector = new THREE.Vector2();

				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
				//camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
				camera.position.y = 150;
				camera.position.z = 500;

				scene = new THREE.Scene();
				things = new THREE.Object3D();
				scene.add(things);

				// outer cube that frames everything

				var geometry = new THREE.BoxGeometry( 300, 300, 300 );
				var material = new THREE.MeshBasicMaterial( { opacity: 0.0 } );
				cube = new THREE.Mesh( geometry, material );
				edges = new THREE.EdgesHelper( cube, 0xffffff );

				edges.position.y = 150;
				edges.updateMatrix();
				//cube.rotation.z = .09;
				//object.add( cube );
				things.add( edges );

				// Creating inner cubes + bottom planes

				// text1 = new THREE.Mesh(new THREE.TextGeometry("Learning", textOptions));
				// text1.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
				// things.add( text1 )

				for (var i = 0; i < data.length; i++ ) { 

				//var geometry = new THREE.BoxGeometry( data[i].sales, data[i].sales, data[i].sales );
				var geometry = new THREE.BoxGeometry( 12, 12, 12 );
				var planeGeo = new THREE.PlaneBufferGeometry( 15, 15 );
				planeGeo.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

				var material = new THREE.MeshBasicMaterial( {color: colors(data[i].sales), overdraw: 0.5, wireframe: false} );
				var planeMat = new THREE.MeshBasicMaterial( { color: 0xffffff, overdraw: 0.5, wireframe: false } );

				boxes = new THREE.Mesh( geometry, material );
				boxes.name = "boxesName"; // bind a unique name so Raycaster can differentiate within 3dObject 

				plane = new THREE.Mesh( planeGeo, planeMat );

				if (i % div == 0) {xDelta = -137} else {xDelta += 25};
				boxes.position.x = xDelta;
				plane.position.x = xDelta;

				boxes.position.y = data[i].sales;
				plane.position.y = 0;

				if (i % div == 0) {zDelta += 29} else {zDelta};
				boxes.position.z = zDelta;
				plane.position.z = zDelta;

				boxes.userData = data[i]; // bind data to boxes
				plane.userData = data[i];

				things.add( boxes );
				things.add( plane );


				} // End inner cubes + bottom planes loop


				// ADD TEXT

				//text3d.computeBoundingBox();
				//var centerOffset = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );

				textMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, overdraw: 0.5, opacity: 1 } );
				text = new THREE.Mesh( text3d, textMaterial );
				text.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2.1 ) );

				text.position.x = 155;
				text.position.y = 0;
				text.position.z = 0;

				text.rotation.x = 0;
				text.rotation.y = 0;
				text.rotation.z = 0;

				group = new THREE.Group();
				group.add( text );

				things.add( group );


				// Opaque Bottom Plane

				// var planeGeo = new THREE.PlaneBufferGeometry( 300, 300 );
				// planeGeo.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
				// var planeMat = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: false, opacity: 0.3 } );
				// plane = new THREE.Mesh( planeGeo, planeMat );
				// plane.position.y = -0.1;
				// things.add( plane );

				renderer = new THREE.CanvasRenderer();
				renderer.setClearColor( 0x000000 );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				container.appendChild( stats.domElement );

				document.addEventListener( 'mousedown', onDocumentMouseDown, false );
				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );


				window.addEventListener( 'resize', onWindowResize, false );
				window.addEventListener( 'mousemove', onMouseMove, false ); // mousemove event that triggers raycaster search
				//window.requestAnimationFrame(render); // apparently for raycaster, maybe not necessary!!

			}

			function onMouseMove( event ) {
		
			mouseVector.x = 2 * (event.clientX / window.innerWidth) - 1;
			mouseVector.y = 1 - 2 * ( event.clientY / window.innerHeight );

			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function onDocumentMouseDown( event ) {

				event.preventDefault();

				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'mouseup', onDocumentMouseUp, false );
				document.addEventListener( 'mouseout', onDocumentMouseOut, false );

				mouseXOnMouseDown = event.clientX - windowHalfX;
				targetRotationOnMouseDown = targetRotation;

			}

			function onDocumentMouseMove( event ) {

				mouseX = event.clientX - windowHalfX;

				targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;

			}

			function onDocumentMouseUp( event ) {

				document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
				document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
				document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

			}

			function onDocumentMouseOut( event ) {

				document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
				document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
				document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

			}

			function onDocumentTouchStart( event ) {

				if ( event.touches.length === 1 ) {

					event.preventDefault();

					mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
					targetRotationOnMouseDown = targetRotation;

				}

			}

			function onDocumentTouchMove( event ) {

				if ( event.touches.length === 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;

				}

			}

			function animate() {

				requestAnimationFrame( animate );

				render();
				stats.update();

			} // end animate()

			function render() {

				raycaster.setFromCamera( mouseVector.clone(), camera ),
				intersects = raycaster.intersectObjects( things.children );

				// if there is one (or more) intersections		
				if (intersects.length > 0) 
				{
					if ( intersects[ 0 ].object != intersection ) // if the closest object intersected is not the currently stored intersection object
					{
						if (intersection) // restore previous intersection object (if it exists) to its original color
							intersection.material.color.setHex( intersection.currentHex );

							// interate through 3dObject children in order to remove "planeTops"
							for (var i = things.children.length - 1; i >= 0 ; i -- ) {
						    thingsChildren = things.children[ i ];
						    if ( thingsChildren.name == "planeTop") {
						        things.remove(thingsChildren);
						    }
						}

							// store reference to closest object as current intersection object
							intersection = intersects[ 0 ].object;
							// store color of closest object (for later restoration)
							intersection.currentHex = intersection.material.color.getHex();

							if (intersection.name == "boxesName") { // only change color of it's a box (not a plane, etc)
							// set a new color for closest object
							intersection.material.color.setHex( 0xffad01 );
							
							}

							if (intersection.name == "boxesName") {

							// get boxes x, z coordinates in order to pass to plane objects below
							var counterX = intersects[0].object.position.x;
							var counterZ = intersects[0].object.position.z;

							var planeGeo = new THREE.PlaneBufferGeometry( 15, 15 );
							planeGeo.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
							var planeMat = new THREE.MeshBasicMaterial( { color: 0xffad01, wireframe: false } );
							planeTop = new THREE.Mesh( planeGeo, planeMat );
							planeTop.name = "planeTop";
							planeTop.position.x = counterX;
							planeTop.position.z = counterZ;
							planeTop.position.y = 0.01;
							things.add( planeTop );

						} // check intersection name

							//text.textMaterial.opacity.set = 1;

							// console.log(counterX)
							// pass bounded data to tooltip
							// oem.innerHTML = intersection.userData.name;
			 				// sales.innerHTML = intersection.userData.sales;
					}
				}
				else // there are no intersections
				{
					if (intersection) // restore previous intersection object (if it exists) to its original color
						intersection.material.color.setHex( intersection.currentHex );
						// remove previous intersection object reference by setting current intersection object to nothing
						intersection = null;

						// interate through 3dObject children in order to remove "planeTops"
						for (var i = things.children.length - 1; i >= 0 ; i -- ) {
						    thingsChildren = things.children[ i ];
						    if ( thingsChildren.name == "planeTop") {
						        things.remove(thingsChildren);
						    }
						}

						// clear data from tooltip
						//oem.innerHTML = " ";
						//sales.innerHTML = " ";
				}

				//sphere.rotation.y = plane.rotation.y = cube.rotation.y += ( targetRotation - cube.rotation.y ) * 0.05;
				things.rotation.y += ( targetRotation - things.rotation.y ) * 0.05;
				//plane.rotation.y += ( targetRotation - plane.rotation.y ) * 0.05;

				renderer.render( scene, camera );

			} // end render()

}
