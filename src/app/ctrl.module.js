angular.module('betrue.ar').controller('MainController',['$scope','$mdDialog',function($scope,$mdDialog){
    var self = this;

    self.modernizr = Modernizr;
    $scope.progression = 0;
    if(self.modernizr.webgl &&
        self.modernizr.webglextensions &&
        self.modernizr.getusermedia &&
        self.modernizr.peerconnection){

        var loader = new THREE.ColladaLoader();

        loader.load('assets/3d/Robo8.dae', function ( collada ) {

            var animations = collada.animations;
            var avatar = collada.scene;
            var mixer;

            mixer = new THREE.AnimationMixer( avatar );
            var action = mixer.clipAction( animations[ 0 ] ).play();
            avatar.scale.x = avatar.scale.y = avatar.scale.z = 0.2;




            //////////////////////////////////////////////////////////////////////////////////
            //		Init
            //////////////////////////////////////////////////////////////////////////////////

            // init renderer
            var renderer	= new THREE.WebGLRenderer({
                // antialias	: true,
                alpha: true
            });
            clock = new THREE.Clock();

            renderer.setClearColor(new THREE.Color('lightgrey'), 0)
            // renderer.setPixelRatio( 1/2 );
            renderer.setSize( window.innerWidth, window.innerHeight );
            renderer.domElement.style.position = 'absolute'
            renderer.domElement.style.top = '0px'
            renderer.domElement.style.left = '0px'

            //https://ftp.openbsd.org/pub/OpenBSD/songs/song52.mp3
            var audio = new Audio('assets/mp3/song52.mp3');
            //  audio.play();

            setTimeout(function(){
                audio.pause();
            },3000);


            // array of functions for the rendering loop
            var onRenderFcts= [];

            // init scene and camera
            var scene	= new THREE.Scene();

            //////////////////////////////////////////////////////////////////////////////////
            //		Initialize a basic camera
            //////////////////////////////////////////////////////////////////////////////////

            // Create a camera
            var camera = new THREE.Camera();
            scene.add(camera);

            ////////////////////////////////////////////////////////////////////////////////
            //          handle arToolkitSource
            ////////////////////////////////////////////////////////////////////////////////

            var arToolkitSource = new THREEx.ArToolkitSource({
                // to read from the webcam
                sourceType : 'webcam',

                // to read from an image
                // sourceType : 'image',
                // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',

                // to read from a video
                // sourceType : 'video',
                // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',
            });

            arToolkitSource.init(function onReady(){
                onResize()
            });
            // handle resize
            window.addEventListener('resize', function(){
                onResize()
            });
            function onResize(){
                arToolkitSource.onResize()
                arToolkitSource.copySizeTo(renderer.domElement)
                if( arToolkitContext.arController !== null ){
                    arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
                }
            }
            ////////////////////////////////////////////////////////////////////////////////
            //          initialize arToolkitContext
            ////////////////////////////////////////////////////////////////////////////////


            // create atToolkitContext
            var arToolkitContext = new THREEx.ArToolkitContext({
                cameraParametersUrl: THREEx.ArToolkitContext.baseURL + '../data/data/camera_para.dat',
                detectionMode: 'mono',
                maxDetectionRate: 30,
                canvasWidth: 80*3,
                canvasHeight: 60*3,
            });
            // initialize it
            arToolkitContext.init(function onCompleted(){
                // copy projection matrix to camera
                camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
            });

            // update artoolkit on every frame
            onRenderFcts.push(function(){
                if( arToolkitSource.ready === false )	return

                arToolkitContext.update( arToolkitSource.domElement )
            }) ;


            ////////////////////////////////////////////////////////////////////////////////
            //          Create a ArMarkerControls
            ////////////////////////////////////////////////////////////////////////////////

            var markerRoot = new THREE.Group
            scene.add(markerRoot)
            var artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
                type : 'pattern',
                patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.hiro'
                // patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji'
            })




            // build a smoothedControls
            var smoothedRoot = new THREE.Group()
            scene.add(smoothedRoot)
            var smoothedControls = new THREEx.ArSmoothedControls(smoothedRoot, {
                lerpPosition: 0.4,
                lerpQuaternion: 0.3,
                lerpScale: 1,
            });
            onRenderFcts.push(function(delta){
                smoothedControls.update(markerRoot)
            });
            //////////////////////////////////////////////////////////////////////////////////
            //		add an object in the scene
            //////////////////////////////////////////////////////////////////////////////////

            var arWorldRoot = smoothedRoot



            var ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
            arWorldRoot.add( ambientLight );
            var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
            //directionalLight.position.set(-3, -4, -3);
            directionalLight.target = avatar;

            arWorldRoot.add( directionalLight );


            arWorldRoot.add( avatar );


            //////////////////////////////////////////////////////////////////////////////////
            //		render the whole thing on the page
            //////////////////////////////////////////////////////////////////////////////////

            // render the scene
            onRenderFcts.push(function(){
                renderer.render( scene, camera );
                var delta = clock.getDelta();
                if(!markerRoot.visible){
                    audio.pause();
                }
                if(markerRoot.visible){
                    audio.play();
                }
                if ( mixer !== undefined ) {

                    mixer.update( delta );

                }
            });

            // run the rendering loop
            var lastTimeMsec= null
            requestAnimationFrame(function animate(nowMsec){
                // keep looping
                requestAnimationFrame( animate );
                // measure time
                lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
                var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
                lastTimeMsec	= nowMsec
                // call each update function
                onRenderFcts.forEach(function(onRenderFct){
                    onRenderFct(deltaMsec/1000, nowMsec/1000)
                })
            })
            document.body.appendChild( renderer.domElement );
        } ,function(progress){
            $scope.$applyAsync(function(){
                $scope.progression = Math.floor((progress.loaded*100)/progress.total);

            })
        });



    } else {
        $mdDialog.show(
             $mdDialog.alert()
               .parent(angular.element(document.querySelector('#popupContainer')))
               .clickOutsideToClose(true)
               .title('Oups ..')
               .textContent('Votre navigateur n\'est pas compatible avec cette animation, une application mobile sera bientot disponible')
               .ok('Ok :(')
           );
    }

}]);