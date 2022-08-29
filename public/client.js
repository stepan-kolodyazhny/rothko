import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/GLTFLoader.js';
import { VRButton } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/webxr/XRControllerModelFactory.js';
import {BoxLineGeometry} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/geometries/BoxLineGeometry.js';
import {default as Stats} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/libs/stats.module.js';

import {default as controllersModule} from './components/controllers.js';
import {default as generateCanvas} from './components/canvas.js';
import {default as generatePalette} from './components/palette.js';
import {default as bornPainter} from './components/painter.js';

let controllerModule = controllersModule();
let canvas = generateCanvas(document.getElementById('canvas'), THREE);
let painter = bornPainter();
let palette = generatePalette(THREE);

class App{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );

        this.stats = new Stats();
        document.body.appendChild(this.stats.dom)

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
        
        this.raycaster = new THREE.Raycaster();
        this.workingMatrix = new THREE.Matrix4();
        this.workingVector = new THREE.Vector3();

        this.initScene();
        this.setupXR();
        
        window.addEventListener('resize', this.resize.bind(this) );

        this.renderer.setAnimationLoop( this.render.bind(this) );
	}	
    
    initScene(){
        
        this.room = new THREE.LineSegments(
					new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ),
					new THREE.LineBasicMaterial( { color: 0x808080 } )
				);
        this.room.geometry.translate( 0, 3, 0 );
        this.scene.add( this.room );

        canvas.initCanvas(this, THREE);
        palette.initPalette(this, palette.geometry);        
    }

    setupXR(){
        this.renderer.xr.enabled = true;
        document.body.appendChild( VRButton.createButton( this.renderer));
    
        this.controllers = controllerModule.buildControllers(
            XRControllerModelFactory, 
            THREE, 
            this, 
            painter
        );

        controllerModule.buttonListener(this)
    }
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	render() {   
        this.stats.update();

        if (this.controllers) {
            const self = this;
            this.controllers.forEach( (controller) => {
                controllerModule.handleController( 
                    controller, 
                    this, 
                    painter, 
                    canvas, 
                    palette 
                );
            });
        }
        this.renderer.render( this.scene, this.camera );       
    }
    
}

export { App };
