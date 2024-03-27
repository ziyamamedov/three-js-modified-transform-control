import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/Addons.js';
import {TransformControls} from 'three/addons/controls/TransformControls.js'


class TransformControlRig {
  private camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private raycaster: THREE.Raycaster
  orbitControls: OrbitControls
  transformControls: TransformControls


  constructor(camera: THREE.PerspectiveCamera | THREE.OrthographicCamera, renderer: THREE.WebGLRenderer, scene: THREE.Scene) {
    this.camera = camera;
    this.renderer = renderer;
    this.scene = scene;
    this.raycaster = new THREE.Raycaster()
    // Initialize OrbitControls
    this.orbitControls = new OrbitControls(camera, this.renderer.domElement);
    this.orbitControls.update();
    this.orbitControls.enabled = true;
    this.orbitControls.addEventListener( 'change', this.render );
    
    this.transformControls = new TransformControls( this.camera, this.renderer.domElement );
    this.transformControls.addEventListener( 'change', this.render );
    this.transformControls.addEventListener( 'dragging-changed', ( event ) => {
      this.orbitControls.enabled = ! event.value;
    })
    camera.lookAt(0, 0, 0)
    // window.addEventListener('keydown', this.keyDownHandler)
    // window.addEventListener('keyup', this.keyUpHandler)
    window.addEventListener('click', this.clickHandler)

    this.scene.add(this.transformControls)
  }

  private clickHandler = (event: MouseEvent) => {
    const x = event.clientX / this.renderer.domElement.clientWidth * 2 - 1
    const y = -(event.clientY / this.renderer.domElement.clientHeight * 2 - 1)
    this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera)
    const meshes = this.scene.children.filter((obj) => obj.userData.isSelectable)
    const objects = this.raycaster.intersectObjects(meshes, true)

    
    if(objects.length) {
      this.transformControls.attach(objects[0].object)
      this.transformControls.enabled
      
      this.render()
    }

    console.log(`x: ${x}, y: ${y}`)
  }
  private keyDownHandler = (event: KeyboardEvent) => {
    switch ( event.keyCode ) {

      case 81: // Q
        this.transformControls.setSpace( this.transformControls.space === 'local' ? 'world' : 'local' );
        break;

      case 16: // Shift
        this.transformControls.setTranslationSnap( 100 );
        this.transformControls.setRotationSnap( THREE.MathUtils.degToRad( 15 ) );
        this.transformControls.setScaleSnap( 0.25 );
        break;

      case 87: // W
        this.transformControls.setMode( 'translate' );
        break;

      case 69: // E
        this.transformControls.setMode( 'rotate' );
        break;

      case 82: // R
        this.transformControls.setMode( 'scale' );
        break;

      /* case 67: // C
        const position = currentCamera.position.clone();

        currentCamera = currentCamera.isPerspectiveCamera ? cameraOrtho : cameraPersp;
        currentCamera.position.copy( position );

        orbit.object = currentCamera;
        this.transformControls.camera = currentCamera;

        currentCamera.lookAt( orbit.target.x, orbit.target.y, orbit.target.z );
        onWindowResize();
        break; */

      /* case 86: // V
        const randomFoV = Math.random() + 0.1;
        const randomZoom = Math.random() + 0.1;

        cameraPersp.fov = randomFoV * 160;
        cameraOrtho.bottom = - randomFoV * 500;
        cameraOrtho.top = randomFoV * 500;

        cameraPersp.zoom = randomZoom * 5;
        cameraOrtho.zoom = randomZoom * 5;
        onWindowResize();
        break;
      */
      case 187:
      case 107: // +, =, num+
        this.transformControls.setSize( this.transformControls.size + 0.1 );
        break;

      case 189:
      case 109: // -, _, num-
        this.transformControls.setSize( Math.max( this.transformControls.size - 0.1, 0.1 ) );
        break;

      case 88: // X
        this.transformControls.showX = ! this.transformControls.showX;
        break;

      case 89: // Y
        this.transformControls.showY = ! this.transformControls.showY;
        break;

      case 90: // Z
        this.transformControls.showZ = ! this.transformControls.showZ;
        break;

      case 32: // Spacebar
        this.transformControls.enabled = ! this.transformControls.enabled;
        break;

      case 27: // Esc
        this.transformControls.reset();
        break;

    }

  }
  private keyUpHandler = (event: KeyboardEvent) => {
    switch ( event.keyCode ) {
      case 16: // Shift
        this.transformControls.setTranslationSnap( null );
        this.transformControls.setRotationSnap( null );
        this.transformControls.setScaleSnap( null );
        break;
    }
  }
  private render = () => {
    this.renderer.render(this.scene, this.camera)
  }
}

export default TransformControlRig