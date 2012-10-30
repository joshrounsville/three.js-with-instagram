// Get Instagram Info
var user = {
 'access_token':'11843940.f59def8.3b00c1d86a124e3b8120e1623a38ad37',
 'user': {
    'username':'thebrigade',
    'bio':'',
    'website':'http:\/\/www.thisisthebrigade.com',
    'profile_picture':'http:\/\/images.instagram.com\/profiles\/profile_11843940_75sq_1340516738.jpg',
    'full_name':'The Brigade',
    'id':'203949578'
  }
};

var account = user;
var count = -1;
var sphere = [];


// get Instagram photos
$.getJSON('https://api.instagram.com/v1/users/' + account.user.id+ '/media/recent?access_token=' + account.access_token + '&count=' + count + '&callback=?',
  function(data) {

    $.each(data.data, function(i, image) {
   
        sphere.push([image.images.standard_resolution.url]);
      
    });

    console.log(sphere);

    doIt();

});

var doIt = function() {

      var camera, scene, renderer;
      var geometry, material, mesh;

      var controls;

      var objects = [];
      var targets = { sphere: [], grid: [] };

      init();
      animate();

      function init() {

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );
        camera.position.z = 1800;

        scene = new THREE.Scene();

        for ( var i = 0; i < sphere.length; i ++ ) {

          var item = sphere[ i ];

          var element = document.createElement( 'div' );
          element.className = 'element';
          element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

          var details = document.createElement( 'div' );
          details.className = 'details';
          details.innerHTML = '<img src="'+item+'" />';
          element.appendChild( details );

          var object = new THREE.CSS3DObject( element );
          object.position.x = Math.random() * 4000 - 2000;
          object.position.y = Math.random() * 4000 - 2000;
          object.position.z = Math.random() * 4000 - 2000;
          scene.add( object );

          objects.push( object );

        }

        // sphere

        var vector = new THREE.Vector3();

        for ( var i = 0, l = objects.length; i < l; i ++ ) {

          var object = objects[ i ];

          var phi = Math.acos( -1 + ( 2 * i ) / l );
          var theta = Math.sqrt( l * Math.PI ) * phi;

          var object = new THREE.Object3D();

          object.position.x = 1000 * Math.cos( theta ) * Math.sin( phi );
          object.position.y = 1000 * Math.sin( theta ) * Math.sin( phi );
          object.position.z = 1000 * Math.cos( phi );

          vector.copy( object.position ).multiplyScalar( 2 );

          object.lookAt( vector );

          targets.sphere.push( object );

        }

        // grid

        for ( var i = 0; i < objects.length; i ++ ) {

          var object = objects[ i ];

          var object = new THREE.Object3D();

          object.position.x = ( ( i % 5 ) * 400 ) - 800;
          object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
          object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;

          targets.grid.push( object );

        }

        //

        renderer = new THREE.CSS3DRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = 0;
        document.getElementById( 'container' ).appendChild( renderer.domElement );

        //

        controls = new THREE.TrackballControls( camera, renderer.domElement );
        controls.rotateSpeed = 0.5;
        controls.addEventListener( 'change', render );

        var button = document.getElementById( 'sphere' );
        button.addEventListener( 'click', function ( event ) {

          transform( targets.sphere, 2000 );

        }, false );

        var button = document.getElementById( 'grid' );
        button.addEventListener( 'click', function ( event ) {

          transform( targets.grid, 2000 );

        }, false );

        transform( targets.sphere, 5000 );

        //

        window.addEventListener( 'resize', onWindowResize, false );

      }

      function transform( targets, duration ) {

        TWEEN.removeAll();

        for ( var i = 0; i < objects.length; i ++ ) {

          var object = objects[ i ];
          var target = targets[ i ];

          new TWEEN.Tween( object.position )
            .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();

          new TWEEN.Tween( object.rotation )
            .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();

        }

        new TWEEN.Tween( this )
          .to( {}, duration * 2 )
          .onUpdate( render )
          .start();

      }

      function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

      }

      function animate() {

        requestAnimationFrame( animate );

        TWEEN.update();
        controls.update();

      }

      function render() {

        renderer.render( scene, camera );

      }
}