function bornPainter() {
    class painterClass{
        constructor(){
            this.drawingColor = true;
            this.brightness = "brightness(0)";
            this.color = "255, 255, 255";
            this.pointCounter = [];
            this.raycasterDirection = [-1,0,0];
            this.drawingColor = true;
        }

        draw(canvas, ctx, texture, intersects, pointCounter, color) {
            let rgb;
            if(color) {
                rgb = color;
            } else {
                rgb = "255, 45, 0";
            }
            let points = [
                Math.round(intersects[0].uv.x * canvas.width), 
                Math.round(canvas.height - intersects[0].uv.y * canvas.height)
            ];
            //console.log(points)
            
            pointCounter.push(points[0],points[1]);

                ctx.beginPath();

                //ctx.filter = "brightness(0.8) sepia(1) blur(4px)"
                ctx.strokeStyle = "rgba("+rgb+", "+1+")";
                ctx.fillStyle = "rgba("+rgb+", "+1+")";
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.lineWidth = intersects[0].distance*100;
                ctx.moveTo(pointCounter[0],pointCounter[1]);
                ctx.lineTo(pointCounter[2], pointCounter[3]);
                ctx.stroke();
                ctx.closePath()
        
                ctx.beginPath();
                ctx.strokeStyle = "rgba("+rgb+"), "+0.04+")";
                ctx.fillStyle = "rgba("+rgb+"), "+0.04+")";
                ctx.lineWidth = intersects[0].distance*120;
                ctx.moveTo(pointCounter[0],pointCounter[1]);
                ctx.lineTo(pointCounter[2],pointCounter[3]);
                ctx.stroke();
                ctx.closePath()
        
                pointCounter = [pointCounter[2], pointCounter[3]];
        
            if (texture) {
                texture.needsUpdate = true;
            }
        
            return pointCounter;
        }
    }

    let painter = new painterClass();
    return painter;
}

export default bornPainter;
