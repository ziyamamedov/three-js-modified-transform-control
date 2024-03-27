import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import {TransformControls} from 'three/addons/controls/TransformControls.js'
import TransformControlRig from './TransformControlRig';

let cameraPersp: THREE.PerspectiveCamera, cameraOrtho: THREE.OrthographicCamera, currentCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
let scene: THREE.Scene, renderer: THREE.WebGLRenderer, control: TransformControls, orbit: OrbitControls;

init();
render();

function init() {

  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  const aspect = window.innerWidth / window.innerHeight;

  // Camera
  cameraPersp = new THREE.PerspectiveCamera( 50, aspect, 0.01, 30000 );
  cameraOrtho = new THREE.OrthographicCamera( - 600 * aspect, 600 * aspect, 600, - 600, 0.01, 30000 );
  currentCamera = cameraPersp;
  currentCamera.position.set( 5, 2.5, 5 );

  // Scene
  scene = new THREE.Scene();
  
  // Helpers
  const gridHelper = new THREE.GridHelper(5, 10, 0x888888, 0x444444) 
  scene.add(gridHelper);


  // Lights
  const ambientLight = new THREE.AmbientLight( 0xffffff );
  scene.add( ambientLight );
  const light = new THREE.DirectionalLight( 0xffffff, 4 );
  light.position.set( 1, 1, 1 );
  scene.add( light );


  const texture = new THREE.TextureLoader().load( 'textures/crate.gif', render );
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshMatcapMaterial( { color: 'grey' } );

  

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = {isSelectable: true}
  const mesh2 = new THREE.Mesh(geometry, material);
  mesh2.userData = {isSelectable: true}
  mesh2.position.set(0, 0, -2)
  scene.add( mesh );
  scene.add( mesh2 );


  // Controls
  const rig = new TransformControlRig(cameraPersp, renderer, scene)
}
window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {

  const aspect = window.innerWidth / window.innerHeight;

  cameraPersp.aspect = aspect;
  cameraPersp.updateProjectionMatrix();

  cameraOrtho.left = cameraOrtho.bottom * aspect;
  cameraOrtho.right = cameraOrtho.top * aspect;
  cameraOrtho.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  render();
}

function render() {
  renderer.render( scene, currentCamera );
}