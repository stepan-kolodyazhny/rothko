import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/webxr/XRControllerModelFactory.js';
import {BoxLineGeometry} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/geometries/BoxLineGeometry.js';
import {default as Stats} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/libs/stats.module.js';

import { sceneConfig } from "./sceneConfig.js";
import {default as controllersModule} from './components/controllers.js';
import {default as generateCanvas} from './components/canvas.js';
import {default as generateSubstrate} from './components/substrate.js';
import {default as generatePalette} from './components/palette.js';
import {default as bornPainter} from './components/painter.js';
import {default as buttonUI} from './components/ui/button.js';
import {default as generateBrush} from './components/brush.js';

class App{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );

        this.socket = io();
        this.sceneConfig = sceneConfig;
        this.controllerModule = controllersModule();
        this.canvas = generateCanvas(document.getElementById('canvas'), THREE);
        this.painter = bornPainter();
        this.palette = generatePalette(THREE);
        this.substrate;
        this.button = buttonUI(THREE);
        this.modeButton = buttonUI(THREE);
        this.brush = generateBrush(THREE);

		this.initScene();
		this.initLight();
		this.initRenderer(container);
        this.initControls();
        this.initRoom();
        this.setupXR();
        this.initComponents();
        window.addEventListener('resize', this.resize.bind(this) );
        this.renderer.setAnimationLoop( this.render.bind(this) );

        this.stats = new Stats();
        document.body.appendChild(this.stats.dom)
	}	

    initScene() {
        this.camera = new THREE.PerspectiveCamera( 
            this.sceneConfig.camera.perspective.fov,
            window.innerWidth / window.innerHeight, 
            this.sceneConfig.camera.perspective.near,
            this.sceneConfig.camera.perspective.far
        );

		this.camera.position.set( 
            this.sceneConfig.camera.position.x,
            this.sceneConfig.camera.position.y,
            this.sceneConfig.camera.position.z
        );

		this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( this.sceneConfig.sceneBackgroundColor );
    }

    initLight() {
        this.scene.add( new THREE.HemisphereLight( 
            this.sceneConfig.light.hemisphereLight.skyColor, 
            this.sceneConfig.light.hemisphereLight.groundColor, 
            this.sceneConfig.light.hemisphereLight.intensity
        ));

        const directionalLight = new THREE.DirectionalLight( this.sceneConfig.light.directionalLight.color );
        directionalLight.position.set( 
            this.sceneConfig.light.directionalLight.position.x, 
            this.sceneConfig.light.directionalLight.position.y, 
            this.sceneConfig.light.directionalLight.position.z 
        ).normalize();
		this.scene.add( directionalLight );
    }

    initRenderer(container) {
        this.renderer = new THREE.WebGLRenderer({ antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio);
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
		container.appendChild( this.renderer.domElement );
    }

    initControls() {
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.target.set(
            this.sceneConfig.controlsTarget.x, 
            this.sceneConfig.controlsTarget.y, 
            this.sceneConfig.controlsTarget.z
        );
        this.controls.update();
        
        this.raycaster = new THREE.Raycaster();
        this.workingMatrix = new THREE.Matrix4();
        this.workingVector = new THREE.Vector3();
    }
    
    initRoom() {
        this.room = new THREE.LineSegments(
            new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ),
            new THREE.LineBasicMaterial( { color: 0x808080 } )
        );
        this.room.geometry.translate( 0, 3, 0 );
        this.scene.add( this.room );
    }

    initComponents() {
        this.brush.initSceneBrushPoints(this.scene)
        this.canvas.initCanvas(this, THREE);
        this.palette.initPalette(this, this.palette.geometry);  
        this.substrate = generateSubstrate(document.getElementById('substrate'), THREE, document.getElementById('tempcanvas'), this.painter);
        this.substrate.initSubstrate(this, "../model/substrate.json");     
        
        this.button.initButton(this, this.button.geometry, this.button.setStyle(this.sceneConfig.buttonStyle), "button");
        this.modeButton.initButton(this, this.modeButton.geometry, this.modeButton.setStyle(this.sceneConfig.modeButtonStyle), "mode");
    }

    setupXR(){
        this.renderer.xr.enabled = true;
        document.body.appendChild( VRButton.createButton( this.renderer));
    
        this.controllers = this.controllerModule.buildControllers(
            XRControllerModelFactory, 
            THREE, 
            this
        );
        
        this.controllerModule.buttonListener(this)
    }
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	render() {   
        this.stats.update();

        this.substrate.animate();

        if (this.controllers) {
            this.controllers.forEach( (controller) => {
                this.controllerModule.handleController( controller, this );
            });
        };

        this.renderer.render( this.scene, this.camera );       
    }
}

export { App };
