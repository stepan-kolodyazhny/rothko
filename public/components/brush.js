function generateBrush(THREE) {
    class brushClass{
        constructor(){
            
            this.sceneTopPointGeometry = new THREE.SphereGeometry( 0.01, 32, 16 );
            this.sceneTopPointMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
            this.sceneTopPoint = new THREE.Mesh( this.sceneTopPointGeometry, this.sceneTopPointMaterial );
            this.sceneTopPoint.name = "sceneTopPoint"

            this.sceneBottomPointGeometry = new THREE.SphereGeometry( 0.01, 32, 16 );
            this.sceneBottomPointMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
            this.sceneBottomPoint = new THREE.Mesh( this.sceneBottomPointGeometry, this.sceneBottomPointMaterial );
            this.sceneBottomPoint.name = "sceneBottomPoint"

            this.handTopPointGeometry = new THREE.SphereGeometry( 0.01, 32, 16 );
            this.handTopPointMaterial = new THREE.MeshBasicMaterial( {color: 0x00ffff} );
            this.handTopPoint = new THREE.Mesh( this.handTopPointGeometry, this.handTopPointMaterial );
            this.handTopPoint.name = "handTopPoint"

            this.handBottomPointGeometry = new THREE.SphereGeometry( 0.01, 32, 16 );
            this.handBottomPointMaterial = new THREE.MeshBasicMaterial( {color: 0x00ffff} );
            this.handBottomPoint = new THREE.Mesh( this.handBottomPointGeometry, this.handBottomPointMaterial );
            this.handBottomPoint.name = "handBottomPoint"

            this.name = "brush";
            this.vector = new THREE.BufferGeometry().setFromPoints( 
                [new THREE.Vector3( 0, 0, 0 ), 
                    new THREE.Vector3( 0, 0, 1 ) 
                ] 
            );
            
            this.handTopPoint.position.y = 0.2;
            this.sceneTopPoint.position.y = 0.2;

            this.controlled = true;
        }

        initSceneBrushPoints(scene) {
            scene.add( this.sceneTopPoint );
            scene.add( this.sceneBottomPoint );
        }

        initControllerBrushPoints(controller) {
            controller.add( this.handTopPoint );
            controller.add( this.handBottomPoint );
        }
        
        movePoints(scene, controller) {
            if (this.controlled == false) {
                this.handTopPoint.visible = false;
                this.handBottomPoint.visible = false;
                this.sceneTopPoint.visible = true;
                this.sceneBottomPoint.visible = true;
               
                let topPointS = new THREE.Vector3()
                this.handTopPoint.localToWorld(topPointS)
                scene.worldToLocal(topPointS);     
                
                this.sceneTopPoint.position.x = topPointS.x
                this.sceneTopPoint.position.y = topPointS.y
                this.sceneTopPoint.position.z = topPointS.z

                let bottomPointS = new THREE.Vector3()
                this.handBottomPoint.localToWorld(bottomPointS)
                scene.worldToLocal(bottomPointS);     
                
                this.sceneBottomPoint.position.x = bottomPointS.x
                this.sceneBottomPoint.position.y = bottomPointS.y
                this.sceneBottomPoint.position.z = bottomPointS.z
                
            } else {
                this.handTopPoint.visible = true;
                this.handBottomPoint.visible = true;
                this.sceneTopPoint.visible = false;
                this.sceneBottomPoint.visible = false;

                var topPoint = new THREE.Vector3()
                this.sceneTopPoint.localToWorld(topPoint)
                controller.worldToLocal(topPoint);
                
                this.handTopPoint.position.x = topPoint.x;
                this.handTopPoint.position.y = topPoint.y;
                this.handTopPoint.position.z = topPoint.z;
            
                let bottomPoint = new THREE.Vector3()
                this.sceneBottomPoint.localToWorld(bottomPoint)
                controller.worldToLocal(bottomPoint);
                
                this.handBottomPoint.position.x = bottomPoint.x;
                this.handBottomPoint.position.y = bottomPoint.y;
                this.handBottomPoint.position.z = bottomPoint.z;
            }   
        }
    }
    
    let newBrush = new brushClass();
    return newBrush;
}

export default generateBrush;