function bornPainter() {
    class painterClass{
        constructor(){
            this.drawingColor = true;
            this.brightness = "brightness(0)";
            this.color = "255, 255, 255";
            this.pointCounter = [];
            //this.drawingColor = true;
        }

        draw(canv, intersects, painter, substrate, socket) {
            let canvas = canv.canvas;
            let ctx = canv.ctx;
            let texture = canv.canvasTexture;

            let tempCanvas = substrate.tempCanvas;
            let tempCtx = substrate.tempCtx;
            let tempTexture = substrate.tempCanvasTexture;

            let pointCounter = painter.pointCounter;
            let color = painter.color;
            let rgb;

            if(color) {
                rgb = color;
            } else {
                rgb = "255, 255, 255";
            }
            let points = [
                Math.round(intersects[0].uv.x * canvas.width), 
                Math.round(canvas.height - intersects[0].uv.y * canvas.height)
            ];
            let width = intersects[0].distance*100;
            
            pointCounter.push(points[0],points[1]);

                ctx.beginPath();
                ctx.strokeStyle = "rgba("+rgb+", "+1+")";
                ctx.fillStyle = "rgba("+rgb+", "+1+")";
                ctx.lineCap = "round";
                ctx.lineWidth = width;
                ctx.moveTo(pointCounter[0],pointCounter[1]);
                ctx.lineTo(pointCounter[2], pointCounter[3]);
                ctx.stroke();
                ctx.closePath();

                tempCtx.beginPath();
                tempCtx.strokeStyle = "rgba("+rgb+", "+1+")";
                tempCtx.fillStyle = "rgba("+rgb+", "+1+")";
                tempCtx.lineCap = "round";
                tempCtx.lineWidth = width;
                tempCtx.moveTo(pointCounter[0],pointCounter[1]);
                tempCtx.lineTo(pointCounter[2], pointCounter[3]);
                tempCtx.stroke();
                tempCtx.closePath();

            if (substrate.mode) {
                substrate.addPaintToSubstrate(substrate, socket, pointCounter, width, color);
            }
            

            pointCounter = [pointCounter[2], pointCounter[3]];
                
                // check if point is filled
                // if (pointCounter[0] && pointCounter[1]) {
                //     console.log(ctx.getImageData(Math.round(pointCounter[0]), Math.round(pointCounter[1]), 1, 1).data)
                // }
        
            if (texture) {
                texture.needsUpdate = true;
                tempTexture.needsUpdate = true;
            };
            return pointCounter;
        }
    }

    let painter = new painterClass();
    return painter;
}

export default bornPainter;
