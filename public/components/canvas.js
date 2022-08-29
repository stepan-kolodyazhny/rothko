function generateCanvas(canvas, THREE) {
    class canvasClass{
        constructor(){
            this.canvas = canvas;
            this.canvasTexture = new THREE.CanvasTexture(canvas);
            this.canvasMaterial = new THREE.MeshBasicMaterial({ map: this.canvasTexture });
            this.ctx = this.canvas.getContext('2d');
            this.canvas.width = 1300;
            this.canvas.height = 2300;
            this.canvas.absoluteX = 0;
            this.canvas.absoluteY = 0;
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        initCanvas(self, THREE) {
            let canvas = new THREE.Mesh( 
                new THREE.PlaneGeometry(
                    this.canvas.width/1000, 
                    this.canvas.height/1000), 
                this.canvasMaterial 
            );
            //console.log(canvas)
            canvas.name = "canvas";
            canvas.position.z = -1;
            canvas.position.y = 1;
            canvas.position.x = 0;
            self.room.add( canvas );
        }
    }

    let newCanvas = new canvasClass(canvas, THREE);
    return newCanvas;
}

export default generateCanvas;