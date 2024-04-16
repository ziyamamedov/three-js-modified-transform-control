import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/Addons.js';
import {TransformControls} from 'three/addons/controls/TransformControls.js'
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

class TransformControlRig {
  private camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private raycaster: THREE.Raycaster
  private gui: GUI
  private guiTransformFolder: GUI
  private selectedObject: THREE.Object3D | undefined
  orbitControls: OrbitControls
  transformControls: TransformControls

  constructor(camera: THREE.PerspectiveCamera | THREE.OrthographicCamera, renderer: THREE.WebGLRenderer, scene: THREE.Scene) {
    this.camera = camera;
    this.renderer = renderer;
    this.scene = scene;
    this.raycaster = new THREE.Raycaster()
    this.selectedObject = undefined
    camera.lookAt(0, 0, 0)
    
    // Initialize OrbitControls
    this.orbitControls = new OrbitControls(camera, this.renderer.domElement);
    this.orbitControls.update();
    this.orbitControls.enabled = true;
    this.orbitControls.addEventListener( 'change', this.render );
    
    // Transform Controls
    this.transformControls = new TransformControls( this.camera, this.renderer.domElement );
    this.transformControls.addEventListener( 'change', this.render );
    this.transformControls.addEventListener( 'dragging-changed', ( event ) => {
      this.orbitControls.enabled = ! event.value;
    })

    // GUI
    this.gui = new GUI();
    const initGui = {
      'position(w)': () => {this.transformControls.setMode('translate')},
      'scale(r)': () => {this.transformControls.setMode('scale')},
      'rotate(e)': () => {this.transformControls.setMode('rotate')},
    }
    Object.keys(initGui).forEach((key) => {
      this.gui.add(initGui, key as keyof typeof initGui)
    })
    this.guiTransformFolder = this.gui.addFolder('Transform')
    this.guiTransformFolder.hide() // don't show at the beginning, when no objects selected

    // Event Listeners
    window.addEventListener('keydown', this.keyDownHandler)
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
  
    // Add control if clicked on object
    if(objects.length && (this.selectedObject?.uuid !== objects[0].object.uuid)) {
      console.log('h');
      
      this.selectedObject = objects[0].object
      
      resetGuiForObj(this.guiTransformFolder, this.selectedObject)

      this.transformControls.attach(this.selectedObject)
      this.transformControls.enabled

      this.render()
    }

    // Remove control if clicked away
    if(!objects.length) {
      
      this.transformControls.detach()
      this.selectedObject = undefined
      this.guiTransformFolder.hide()
      this.render()
    }
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

const resetGuiForObj = (gui: GUI, obj: THREE.Object3D) => {
  const newGuiData = {
    x: obj.position.x,
    y: obj.position.y,
    z: obj.position.z,
    rotationX: obj.rotation.x,
    rotationY: obj.rotation.y,
    rotationZ: obj.rotation.z,
    scaleX: obj.scale.x,
    scaleY: obj.scale.y,
    scaleZ: obj.scale.z,
  }
  
  if(gui.controllers.length) {
    gui.controllers.forEach((controller) => {
      controller.setValue(newGuiData[controller.property as keyof typeof newGuiData])
    })
  } else {
    Object.keys(newGuiData).forEach((key) => {
      gui.add(newGuiData, key as keyof typeof newGuiData)
    })
  }

  gui.show()
}

export default TransformControlRig