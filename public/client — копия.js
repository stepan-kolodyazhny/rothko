import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/GLTFLoader.js';
import { VRButton } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/webxr/XRControllerModelFactory.js';
import {BoxLineGeometry} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/geometries/BoxLineGeometry.js';
import {default as Stats} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/libs/stats.module.js';
import {default as initGeometry} from './components/initGeometry.js'
import {default as draw} from './components/draw.js';
import {default as generateAppClass} from './components/canvas.js';




let canvas = document.getElementById('canvas'); 
let ctx = canvas.getContext('2d');
canvas.width = 1500;
canvas.height = 1500;
ctx.fillStyle = 'red';
ctx.fillRect(0, 0, canvas.width, canvas.height);
let canvasTex;
let materialC;
let pointCounter = [];
let pressed = false;
let raycasterDirection = [-1,0,0];
let color = true;

let test = generateAppClass(document.getElementById('canvas'), THREE);
console.log(test)

class App{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
        this.clock = new THREE.Clock();
        
		this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
		this.camera.position.set( 0, 1.6, 3 );
        
		this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x505050 );

		this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

        const light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
		this.scene.add( light );
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio);
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
		container.appendChild( this.renderer.domElement );
        
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.target.set(0, 1.6, 0);
        this.controls.update();
        
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom)
        
        this.raycaster = new THREE.Raycaster();
        this.workingMatrix = new THREE.Matrix4();
        this.workingVector = new THREE.Vector3();

        this.initScene();
        this.setupXR();
        
        window.addEventListener('resize', this.resize.bind(this) );

        this.renderer.setAnimationLoop( this.render.bind(this) );
	}	
    
    random( min, max ){
        return Math.random() * (max-min) + min;
    }
    
    initScene(){
        
        this.room = new THREE.LineSegments(
					new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ),
					new THREE.LineBasicMaterial( { color: 0x808080 } )
				);
        this.room.geometry.translate( 0, 3, 0 );
        this.scene.add( this.room );

        const geometry = test.initCanvas(this, THREE);

// CANVAS INIT         
        canvasTex = new THREE.CanvasTexture(canvas);
        materialC = new THREE.MeshBasicMaterial({ map: canvasTex });
        geometry.material = materialC;
// CANVAS INIT        
    }
    
    setupXR(){
        this.renderer.xr.enabled = true;
        document.body.appendChild( VRButton.createButton( this.renderer));
    
        this.controllers = this.buildControllers();

        const self = this;

        function onSelectStart() {
            this.children[0].scale.x = 1;
            this.userData.selectPressed = true;
        }

        function onSelectEnd() {
            this.children[0].scale.x = 0;
            this.userData.selectPressed = false;
        }

        this.controllers.forEach( (controller) => {
            controller.addEventListener( 'selectstart', onSelectStart);
            controller.addEventListener( 'selectend', onSelectEnd)
        })
    }

    buildControllers() {
        const controllerModelFactory = new XRControllerModelFactory();

        const geometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3(raycasterDirection[0],raycasterDirection[1],raycasterDirection[2]) ] );

        const line = new THREE.Line( geometry );
        line.name = 'line';
		line.scale.x = 0;
        
        const controllers = [];
        
        for(let i=0; i<=1; i++){
            const controller = this.renderer.xr.getController( i );
            controller.add( line.clone() );
            
            controller.userData.selectPressed = false;
            this.scene.add( controller );
            
            controllers.push( controller );
            
            const grip = this.renderer.xr.getControllerGrip( i );
            grip.add( controllerModelFactory.createControllerModel( grip ) );
            this.scene.add( grip );
            // set controllers names as left / right
            controller.addEventListener( 'connected', (ev) => {
                controller.name = ev.data.handedness
            })
        }
        
        return controllers;
    }

    handleController( controller ){
        if (controller.userData.selectPressed && controller.name == 'right'){

            controller.children[0].scale.x = 1;
            
            this.workingMatrix.identity().extractRotation( controller.matrixWorld );
            //raycaster direction
            this.raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
            this.raycaster.ray.direction.set(raycasterDirection[0],raycasterDirection[1],raycasterDirection[2]).applyMatrix4( this.workingMatrix );

            const intersects = this.raycaster.intersectObjects( this.room.children );

            if (intersects.length>0){
                pointCounter = draw(ctx, canvasTex, intersects, pointCounter, color);
                controller.children[0].scale.x = intersects[0].distance;
            }else{
                pointCounter = [];
            }
        } else if (controller.name == 'right' && !controller.userData.selectPressed) {
            pointCounter = [];
        }   
        if (controller.name == 'left' && controller.userData.selectPressed) {
            color = false;
        } else if (controller.name == 'left' && !controller.userData.selectPressed) {
            color = true;
        }
    }
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	render( ) {   
        this.stats.update();
    
        if (this.controllers) {
            const self = this;
            this.controllers.forEach( (controller) => {
                self.handleController( controller )
            });
        }

        this.renderer.render( this.scene, this.camera );       
    }
}

export { App };
