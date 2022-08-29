function controllersModule() {
    class controllersClass{
        constructor(){
            this.color = 'red';
        }

        buildControllers(XRControllerModelFactory, THREE, self, painter) {
            const controllers = [];
            const controllerModelFactory = new XRControllerModelFactory();
    
            const geometry = new THREE.BufferGeometry().setFromPoints( 
                [new THREE.Vector3( 0, 0, 0 ), 
                new THREE.Vector3(
                    painter.raycasterDirection[0],
                    painter.raycasterDirection[1],
                    painter.raycasterDirection[2]
                    ) 
                ] 
            );
            const line = new THREE.Line( geometry );
            line.name = 'line';
            line.scale.x = 0;
            
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
                })
            }
            
            return controllers;
        }

        buttonPressed(controller, intersects, painter, canvas, palette) {
            if (controller.name == 'right'){
                if (intersects.length>0){
                    if(intersects[0].object.name === "canvas") {
                        painter.pointCounter = painter.draw(
                            canvas.canvas, 
                            canvas.ctx, 
                            canvas.canvasTexture, 
                            intersects, 
                            painter.pointCounter, 
                            painter.color
                        );
                        controller.children[0].scale.x = intersects[0].distance;
                    } else {
                        painter.pointCounter = [];
                    }

                    if (intersects[0].object.name === "palette") {
                        let translateX = Math.round(intersects[0].uv.x * 300);
                        let translateY = Math.round(intersects[0].uv.y * 255);
                        let newColor = palette.colorScheme(translateX, translateY);
                        painter.color = palette.colorScheme(translateX, translateY);
                        let hex = "#" + palette.rgbToHex(newColor[0], newColor[1], newColor[2]);
                        palette.geometry.material = new THREE.MeshLambertMaterial({ color: hex });
                    }
                }
            } 

            if (controller.name == 'left'){
                painter.drawingColor = false;
            }
        }

        handleController(controller, self , painter, canvas, palette){
            // TODO: intersects everything; could be a module
       
            if (controller.userData.selectPressed){
                controller.children[0].scale.x = 1;
                self.workingMatrix.identity().extractRotation( controller.matrixWorld );
                
                self.raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
                self.raycaster.ray.direction.set(
                    painter.raycasterDirection[0],
                    painter.raycasterDirection[1],
                    painter.raycasterDirection[2]
                ).applyMatrix4( self.workingMatrix );

                const intersects = self.raycaster.intersectObjects( self.room.children );
                this.buttonPressed(controller, intersects, painter, canvas, palette);

            } else if (controller.name == 'right' && !controller.userData.selectPressed) {
                painter.pointCounter = [];
            }  

            if (controller.name == 'left' && !controller.userData.selectPressed) {
                painter.drawingColor = true;
            }
        }

        buttonListener(self){

            function onSelectStart() {
                this.children[0].scale.x = 1;
                this.userData.selectPressed = true;
            }
    
            function onSelectEnd() {
                this.children[0].scale.x = 0;
                this.userData.selectPressed = false;
            }
    
            self.controllers.forEach( (controller) => {
                controller.addEventListener( 'selectstart', onSelectStart);
                controller.addEventListener( 'selectend', onSelectEnd)
            })
        }

    }

    let controllers = new controllersClass();
    return controllers;
}

export default controllersModule;