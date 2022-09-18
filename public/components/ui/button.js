function buttonUI(THREE) {
    class buttonUIClass{
        constructor(){
            this.focus = false;
            this.width = 0.1;
            this.height = 0.1;
            this.depth = 0.1;
            this.color = "white";
            this.geometry = new THREE.Mesh( 
                new THREE.BoxGeometry(this.width, this.height, this.depth), 
                new THREE.MeshLambertMaterial({ color: this.color }) );
        }

        onClick(name, substrate) {
            if (this.focus === false) {
                // console.log(this)
                if (name == "button") {
                    this.setRandomColor(this.geometry.material.color);
                    substrate.incrementLevel(substrate);
                }
                if (name == "mode") {
                    substrate.changeMode();
                    this.switchColor(this.geometry.material.color);
                    console.log(substrate.mode)
                }
                this.focus = true;                
            }
        }

        initButton(self, button, style, name) {
            button.geometry = new THREE.BoxGeometry(style.width, style.height, style.depth), 
            button.material = new THREE.MeshLambertMaterial({ color: style.color });

            button.name = name;
            button.position.x = style.positionX;
            button.position.y = style.positionY;
            button.position.z = style.positionZ;
            self.room.add( button );
            button.rotation.x = style.rotationX;
            button.rotation.y = style.rotationY;
            button.rotation.z = style.rotationZ;
        }

        setStyle(style) {
            class Style{
                constructor() {
                    this.color = style.color;
                    this.width = style.geometry.width;
                    this.height = style.geometry.height;
                    this.depth = style.geometry.depth;
                    
                    this.positionX = style.position.x;
                    this.positionY = style.position.y;
                    this.positionZ = style.position.z;
                    this.rotationX = style.rotation.x;
                    this.rotationY = style.rotation.y;
                    this.rotationZ = style.rotation.z;
                }
            }

            let newStyle = new Style();
            return newStyle;
        }

        setRandomColor(color) {
            color.r = Math.round(Math.random() * 100) / 100;
            color.g = Math.round(Math.random() * 100) / 100;
            color.b = Math.round(Math.random() * 100) / 100;
        }

        switchColor(color) {
            if (color.r == 0) {
                color.r = 1;
                color.g = 1;
                color.b = 1;
            } else {
                color.r = 0;
                color.g = 0;
                color.b = 0;
            }
            
        }
    }

    let newButtonUI = new buttonUIClass();
    return newButtonUI;
}

export default buttonUI;
