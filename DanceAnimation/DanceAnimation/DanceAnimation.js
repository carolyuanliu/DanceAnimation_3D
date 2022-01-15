import * as THREE from'../libs/three.module.js';
import { GUI } from '../libs/dat.gui.module.js';
import { OrbitControls } from '../libs/OrbitControls.js';
import Stats from '../libs/stats.module.js';
import { GLTFLoader } from'../libs/GLTFLoader.js';

const container = document.getElementById("container");
let scene, camera, renderer, controls, cameraControl, fbxLoader, group, loadingManager, gltfLoader;
let charactor, clock, model, skeleton, animations, numAnimations, actions, action, activeAction, previousAction;
var mt, mixer;


// create loading manager
function createLoadingManager(){
    loadingManager = new THREE.LoadingManager();
    loadingManager.onLoad = function () {console.log('loaded')};
    loadingManager.onProgress = function () {} ;// or undefined
    loadingManager.onError = function () {console.log('ERROR')};
  }
createLoadingManager();

//create Scene
function createScene(){
    scene = new THREE.Scene();
  }
createScene();

// create group
function createGroup(){
    group = new THREE.Group();
  }
createGroup();

//create renderer
function createRenderer(){
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  //renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement );
}
createRenderer();

// create camera
function createCamera(){
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set( 20, 40, 100);
    camera.lookAt(scene.position);
    cameraControl = new OrbitControls( camera, renderer.domElement );
    scene.add(camera);
}
createCamera();

// create clock
clock = new THREE.Clock();

const stats = Stats();
stats.showPanel( 0 ); // 0 = fps, 1 = ms, 2 = mb, 3 = custom
container.appendChild(stats.dom);


var gui = new GUI(loadingManager);

//initialise simplex noise instance
var noise = new SimplexNoise();

//initialise audioContext
var context = new AudioContext();

//initialise analyser
var analyser = context.createAnalyser();
analyser.fftSize = 512;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

// the main readfile function
var vizInit = function (){
  var file = document.getElementById("thefile");
  var audio = document.getElementById("audio");
  var fileLabel = document.querySelector("label.file");
  document.onload = function(e){
    console.log(e);
    play();
  }
  file.onchange = function(){
    fileLabel.classList.add('normal');
    audio.classList.add('active');
    var files = this.files;

    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    var files = file.files;
    if (files.length == 0) return;
    var reader = new FileReader();
    reader.onload = function(fileEvent) {
      context.decodeAudioData(fileEvent.target.result, calcTempo);
    }
    reader.readAsArrayBuffer(files[0]);

    //calculate tempo function
    var calcTempo = function (buffer) {
      var audioData = [];
  // Take the average of the two channels
      if (buffer.numberOfChannels == 2) {
        var channel1Data = buffer.getChannelData(0);
        var channel2Data = buffer.getChannelData(1);
        var length = channel1Data.length;
        for (var i = 0; i < length; i++) {
          audioData[i] = (channel1Data[i] + channel2Data[i]) / 2;
        }
      } else {
        audioData = buffer.getChannelData(0);
      }
      mt = new MusicTempo(audioData);

      if (mt.tempo <= 135){
        action = mixer.clipAction( animations [1]);
      }
      else if (mt.tempo > 135 && mt.tempo <= 140) {
        action = mixer.clipAction( animations [2]);
      }
      else if (mt.tempo > 140 && mt.tempo <= 145) {
        action = mixer.clipAction( animations [3]);
      }
      else {
        action = mixer.clipAction( animations [0]);
      }
      action.setEffectiveTimeScale (mt.tempo/100) ;

      console.log(mt.tempo);
      console.log(mt.beats);
      document.getElementById("tempo").innerHTML = mt.tempo;
      //document.getElementById("beats").innerHTML = mt.beats;
      console.log(action.getEffectiveTimeScale());

    play();
  }
var mix = context.createGain();
mix.gain.value = 1;


function play() {

    var src = context.createMediaElementSource(audio);
    src.connect(analyser);
    analyser.connect(context.destination);

    }


    console.log(context.state);






    var planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20);
    var planeMaterial = new THREE.MeshLambertMaterial({
        color: 0x000f0f,
        side: THREE.DoubleSide,
        wireframe: true
    });

    var plane1Material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
    });

    var plane1 = new THREE.Mesh(planeGeometry, plane1Material);
    plane1.rotation.x = -0.5 * Math.PI;
    plane1.castShadow = true;
    plane1.receiveShadow = true;
    group.add(plane1);

    var plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
    plane2.rotation.x = -0.5 * Math.PI;
    plane2.castShadow = true;
    plane2.receiveShadow = true;
    group.add(plane2);


function createLights(){

    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.intensity = 1.0;
    spotLight.position.set(-10, 40, 80);
    spotLight.lookAt(model);
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 0.1;
		spotLight.shadow.camera.far = 300;
    scene.add(spotLight);

    var pointLight = new THREE.PointLight( 0xff0000, 1, 100 );

    pointLight.position.set(0, 40, -5);
    pointLight.lookAt(model);
    pointLight.castShadow = true;
    pointLight.shadow.camera.near = 0.1;
		pointLight.shadow.camera.far = 300;
    scene.add(spotLight);

    const dirLight = new THREE.DirectionalLight( 0xffffff );
		dirLight.position.set( 3, 50, 10 );
    dirLight.lookAt(model);
		dirLight.castShadow = true;
		dirLight.shadow.camera.top = 2;
		dirLight.shadow.camera.bottom = - 2;
		// dirLight.shadow.camera.left = - 2;
		// dirLight.shadow.camera.right = 2;
		dirLight.shadow.camera.near = 0.1;
		dirLight.shadow.camera.far = 300;
		scene.add( dirLight );
}
createLights();

    scene.add(group);


    document.getElementById('out').appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    render();

    function render() {
      analyser.getByteFrequencyData(dataArray);

      var lowerHalfArray = dataArray.slice(0, (dataArray.length/2) - 1);
      var upperHalfArray = dataArray.slice((dataArray.length/2) - 1, dataArray.length - 1);

      var overallAvg = avg(dataArray);
      var lowerMax = max(lowerHalfArray);
      var lowerAvg = avg(lowerHalfArray);
      var upperMax = max(upperHalfArray);
      var upperAvg = avg(upperHalfArray);

      var lowerMaxFr = lowerMax / lowerHalfArray.length;
      var lowerAvgFr = lowerAvg / lowerHalfArray.length;
      var upperMaxFr = upperMax / upperHalfArray.length;
      var upperAvgFr = upperAvg / upperHalfArray.length;

      cameraControl.update();
      group.rotation.y += 0.005;
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

  };

}

window.onload = vizInit();

document.body.addEventListener('touchend', function(ev) { context.resume(); });

document.getElementById('audio').addEventListener('play', playEvent());


function playEvent(){
  createAnimation();
  animate();
  console.log('playing');

}
//create animation
function createAnimation(){
  gltfLoader = new GLTFLoader(loadingManager);
  gltfLoader.castShadow = true;
  gltfLoader.load('../assets/animation/001.gltf', function( gltf ){
    model = gltf.scene;
    model.castShadow = true;
    model.scale.set(20,20,20);
    scene.add(model);
    model.traverse( function ( child ){
        if ( child.isMesh ) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    skeleton = new THREE.SkeletonHelper ( model );
    skeleton.visible = false;
    scene.add( skeleton );

    animations = gltf.animations;
    mixer = new THREE.AnimationMixer(model);

    //play animation
    audio.addEventListener('play', function(ev){
      action.paused = false;
      action.play();
    });
    //pause animations
    audio.addEventListener('pause', function(ev){ action.paused = true; })
  });
  console.log('charactor loaded');
}



function animate(){
  window.requestAnimationFrame(animate);
  const dt = clock.getDelta();
  if( mixer ) {
    mixer.update( dt );
  }
  renderer.render(scene, camera);
}

document.getElementById("thefile").addEventListener('onchange', function(eve){
  model.reset();
  action.reset();
})


//some helper functions here
function fractionate(val, minVal, maxVal) {
    return (val - minVal)/(maxVal - minVal);
}

function modulate(val, minVal, maxVal, outMin, outMax) {
    var fr = fractionate(val, minVal, maxVal);
    var delta = outMax - outMin;
    return outMin + (fr * delta);
}

function avg(arr){
    var total = arr.reduce(function(sum, b) { return sum + b; });
    return (total / arr.length);
}

function max(arr){
    return arr.reduce(function(a, b){ return Math.max(a, b); })
}

function showModel( visibility ) {

				model.visible = visibility;

			}


			function showSkeleton( visibility ) {

				skeleton.visible = visibility;
}
