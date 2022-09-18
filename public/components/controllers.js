function controllersModule() {

    class controllersClass{
        constructor(){
            this.leftSqueezePressed = false;
            this.rightSqueezePressed = false;
            this.leftSelectPressed = false;
            this.rightSelectPressed = false;
        }

        buildControllers(XRControllerModelFactory, THREE, self) {
            const controllers = [];
            const controllerModelFactory = new XRControllerModelFactory();
            
            let line = this.buildLine(THREE, self.sceneConfig.raycasterDirection);
            
            for(let i=0; i<=1; i++){
                const controller = self.renderer.xr.getController( i );
                controller.add( line.clone() );
                
                controller.userData.selectPressed = false;
                self.scene.add( controller );
                controllers.push( controller );
                
                const grip = self.renderer.xr.getControllerGrip( i );
                grip.add( controllerModelFactory.createControllerModel( grip ) );
                self.scene.add( grip );
                
                controller.addEventListener( 'connected', (ev) => {
                    controller.name = ev.data.handedness; 
                    if(controller.name == "left") {
                        self.brush.initControllerBrushPoints(controller)
                    }
                })
            }
            return controllers;
        }

        handleController(controller, self){
            // Left
            
            if (controller.name == 'left') {
                // Left Squeeze
                
                if (controller.userData.squeezePressed) {
                    this.leftSqueezeButtonPressed(controller, self.scene, self.brush);
                }
                if (!controller.userData.squeezePressed) {
                    this.leftSqueezePressed = false;
                }

                // Left Select
                if (controller.userData.selectPressed) {
                    this.leftSelectButtonPressed(self)
                }
                if (!controller.userData.selectPressed) {
                    //substrate.substrateMaterial.opacity = 0;
                    this.leftSelectPressed = false;
                }
            }

            // Right
            if (controller.name == 'right') {
                // Right Squeeze
                
                if (controller.userData.squeezePressed) {
                    this.rightSqueezeButtonPressed(self.socket)
                }
                if (!controller.userData.squeezePressed) {
                    this.rightSqueezePressed = false;
                }

                // Right Select
                if (controller.userData.selectPressed){
                    //controller.children[0].scale.z = 1;
                    self.workingMatrix.identity().extractRotation( controller.matrixWorld );
                    
                    self.raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
                    self.raycaster.ray.direction.set(
                        self.sceneConfig.raycasterDirection.x,
                        self.sceneConfig.raycasterDirection.y,
                        self.sceneConfig.raycasterDirection.z
                    ).applyMatrix4(self.workingMatrix);
    
                    const intersects = self.raycaster.intersectObjects( self.room.children );
                    this.rightSelectButtonPressed(self, controller, intersects);
                } 
                if (!controller.userData.selectPressed) {
                    self.button.focus = false;
                    self.modeButton.focus = false;
                    self.painter.pointCounter = [];
                }   
            }
        }
        
        buildLine(THREE, raycasterDirection) {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints( 
                [new THREE.Vector3( 0, 0, 0 ), 
                    new THREE.Vector3(
                        raycasterDirection.x,
                        raycasterDirection.y,
                        raycasterDirection.z
                    ) 
                ] 
            );
            const line = new THREE.Line( lineGeometry );
            line.name = 'line';
            line.scale.z = 0;
            return line;
        }

        buttonListener(self){
            
            function onSqueezeStart() {
                this.userData.squeezePressed = true;
            }
            function onSqueezeEnd() {
                this.userData.squeezePressed = false;
            }
            function onSelectStart() {
                this.children[0].scale.z = 1;
                this.userData.selectPressed = true;
            }
            function onSelectEnd() {
                this.children[0].scale.z = 0;
                this.userData.selectPressed = false;
            }
            
            self.controllers.forEach( (controller) => {
                controller.addEventListener( 'squeezestart', onSqueezeStart);
                controller.addEventListener( 'squeezeend', onSqueezeEnd);
                controller.addEventListener( 'selectstart', onSelectStart);
                controller.addEventListener( 'selectend', onSelectEnd);
            })
        }

        // Buttons

        leftSqueezeButtonPressed(controller, scene, brush) {
                if (this.leftSqueezePressed === false) {
                    this.leftSqueezePressed = true;
                    brush.controlled = !brush.controlled
                    
                    console.log("controlled: " + brush.controlled);
                    brush.movePoints(scene, controller);
                }
        }

        rightSqueezeButtonPressed(socket) {
            if (this.rightSqueezePressed === false) {
                this.rightSqueezePressed = true;
                socket.emit('jsontodefault');
            }
        }
        // TODO
        // really needs optimisation
        leftSelectButtonPressed(self) {
            if (this.leftSelectPressed === false) {
                this.leftSelectPressed = true;
                self.substrate.substrateMaterial.opacity = 0.4; 
                // long load
                self.substrate.appendJSON(self.substrate, "../model/substrate.json");
                self.substrate.createSubstratePatternFromJSON(self.painter);
            }
        }

        rightSelectButtonPressed(self, controller, intersects) {
            // send data to model painter & palette
            if (intersects.length>1){
                if(intersects[2].object.name === "canvas") {
                    self.painter.pointCounter = self.painter.draw(
                        self.canvas, 
                        intersects, 
                        self.painter,
                        self.substrate,
                        self.socket
                    );
                    controller.children[0].scale.x = intersects[1].distance;
                } else {
                    self.painter.pointCounter = [];
                }

            }  
            if (intersects.length>0) {
                if (intersects[0].object.name === "palette") {
                    self.palette.changeColor(
                        intersects, 
                        self.palette, 
                        self.painter
                    );
                }
            } 
            if (intersects.length>0) {
                if (intersects[0].object.name === "button") {
                    self.button.onClick("button", self.substrate);
                } 
            } 
            if (intersects.length>0) {
                if (intersects[0].object.name === "mode") {
                    self.modeButton.onClick("mode", self.substrate);
                } 
            } 
        }    
    }

    let controllers = new controllersClass();
    return controllers;
}

export default controllersModule;