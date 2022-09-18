function generateSubstrate(substrate, THREE, tempCanvas, painter) {
    class substrateClass{
        constructor(){
            this.substrate = substrate;
            this.substrateTexture = new THREE.CanvasTexture(substrate);
            this.substrateMaterial = new THREE.MeshBasicMaterial({ map: this.substrateTexture });
            this.ctx = this.substrate.getContext('2d');
            this.substrateMaterial.transparent = true;
            this.substrateMaterial.opacity = 0;
            this.substrate.width = 1000;
            this.substrate.height = 1000;
            this.substrate.absoluteX = 0;
            this.substrate.absoluteY = 0;
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(0, 0, substrate.width, substrate.height);
            this.json = "json";
            this.levelPoints = [];
            this.percent = 0.5;
            this.filledPointsFloor = 0;
            this.currentLevel = 0;
            this.mode = false;
            this.animationStatus = true;

            this.tempCanvas = tempCanvas;
            this.tempCanvasTexture = new THREE.CanvasTexture(tempCanvas);
            this.tempCanvasMaterial = new THREE.MeshBasicMaterial({ map: this.tempCanvasTexture });
            this.tempCtx = this.tempCanvas.getContext('2d');
            this.tempCanvasMaterial.transparent = true;
            this.tempCanvasMaterial.opacity = 1;
            this.tempCanvas.width = 1000;
            this.tempCanvas.height = 1000;
            this.tempCanvas.absoluteX = 0;
            this.tempCanvas.absoluteY = 0;
            this.tempCtx.fillStyle = "rgba(255,255,255,0)";
            this.tempCtx.fillRect(0, 0, 1000, 1000);
            
        }

        initSubstrate(self, jsonPATH) {
            let substrate = new THREE.Mesh( 
                new THREE.PlaneGeometry(
                    this.substrate.width/1000, 
                    this.substrate.height/1000), 
                this.substrateMaterial 
            );
    
            substrate.name = "substrate";
            substrate.position.z = -1 + 0.0001;
            substrate.position.y = 1;
            substrate.position.x = 0;
            self.room.add( substrate );

            let tempCanvas = new THREE.Mesh( 
                new THREE.PlaneGeometry(
                    this.tempCanvas.width/1000, 
                    this.tempCanvas.height/1000), 
                this.tempCanvasMaterial 
            );
            tempCanvas.name = "tempcanvas";
            tempCanvas.position.z = -1 + 0.0002;
            tempCanvas.position.y = 1;
            tempCanvas.position.x = 0;
            self.room.add( tempCanvas );

            this.appendJSON(this, jsonPATH)
        }

        checkPoints() {
            var pointNum = 0;
            while(pointNum < this.filledPointsFloor) {
                if(this.levelPoints[pointNum]) {
                    let point = this.levelPoints[pointNum];
                    let data = this.tempCtx.getImageData(point[0], point[1], 1, 1).data;
                    if (data[3] == 0) {
                        pointNum++;
                    } else {
                        this.levelPoints.splice(pointNum,1)
                    }
                } else {
                    break;
                }
            }

            if (pointNum < this.filledPointsFloor) {
                this.incrementLevel();
                this.substrateMaterial.opacity = 0.4; 
                // long load
                this.appendJSON(substrate, "../model/substrate.json");
                this.createSubstratePatternFromJSON(painter);
            }
            //console.log(this.levelPoints.length)
        }

        animate() {
            if(this.substrateMaterial.opacity > 0) {
                let opacity = this.substrateMaterial.opacity;
                
                if(opacity > 0.6) {
                    this.checkPoints(5);
                    this.animationStatus = false;
                    this.substrateMaterial.opacity = 0.6;
                } else if(opacity < 0.1) {
                    this.checkPoints(5);
                    this.animationStatus = true;
                    this.substrateMaterial.opacity = 0.1;
                }

                if(this.animationStatus) {
                    this.substrateMaterial.opacity = opacity + opacity/60;
                } else if (!this.animationStatus) {
                    this.substrateMaterial.opacity = opacity - opacity/60;
                }
            }
        }

        changeMode() {
            // true for create; false for copy
            this.mode = !this.mode;
            let color = this.json.levels[this.currentLevel].color;
            console.log(color)
        }

        appendJSON(substrate, jsonPATH) {    
            fetch(jsonPATH)
            .then((res) => res.json())
            .then((data) => {
                substrate.json = data;
            });
        };

        addPaintToSubstrate(substrate, socket, pointCounter, width, color) {
            if (substrate.json.levels[substrate.json.levels.length - 1].color != color) {
                socket.emit('updatejson', substrate.json);
                substrate.addLevelToJSON(substrate.json, color);
            }
            substrate.addLineToLevel(substrate.json, pointCounter, width)
        }

        incrementLevel() {
            if (this.currentLevel <  this.json.levels.length - 1) {
                this.currentLevel = this.currentLevel + 1;  
            } else {
                this.currentLevel = 0;
            }
            this.clearTempCanvas();
        }
        
        addLevelToJSON(JSON, color) {
            let length = JSON.levels.length;
            JSON.levels[length] = {};
            JSON.levels[length]["color"] = color;
            JSON.levels[length]["points"] = [[0,0]];
            JSON.levels[length]["lines"] = [];
        };

        addLineToLevel(JSON, points, lineWidth) {
            if (points[0] && points[2]) {
                let point = [points[2], points[3]];
                let currentLevel = JSON.levels.length - 1;
                let lastPoint = JSON.levels[currentLevel]["points"].length - 1;
                
                if (point[0] != JSON.levels[currentLevel]["points"][lastPoint][0] && point[1] != JSON.levels[currentLevel]["points"][lastPoint][1]) {
                    JSON.levels[currentLevel]["points"].push(point);
                    JSON.levels[currentLevel]["points"].push([point[0],Math.round(point[1]+lineWidth/2)]);
                    JSON.levels[currentLevel]["points"].push([point[0],Math.round(point[1]-lineWidth/2)]);
                    JSON.levels[currentLevel]["points"].push([Math.round(point[0]-lineWidth/2),point[1]]);
                    JSON.levels[currentLevel]["points"].push([Math.round(point[0]+lineWidth/2),point[1]]);
                }
                
                JSON.levels[currentLevel]["lines"].push({});
                let lineNum = JSON.levels[currentLevel]["lines"].length - 1;
                JSON.levels[currentLevel]["lines"][lineNum]["linepoints"] = [[points[0], points[1]],[points[2], points[3]]];
                JSON.levels[currentLevel]["lines"][lineNum]["linewidth"] = lineWidth;
            } 
        }

        clearTempCanvas() {
            let transparent = "rgba(255,255,255,0)"
            this.tempCtx.fillStyle = transparent;
            this.tempCtx.clearRect(0, 0, 1000, 1000);
            this.tempCtx.fillRect(0,0,1000,1000);
            this.tempCanvasTexture.needsUpdate = true;
        }

        createSubstratePatternFromJSON(painter) {
            this.ctx.clearRect(0, 0, this.substrate.width, this.substrate.height);
            let levels = this.json.levels;
            if (this.mode) {
                levels.forEach(level => {
                    this.drawLevel(level)
                });
            } else {
                // brushcolor
                painter.color = this.setRGBcolor(levels[this.currentLevel].color);
                //console.log(painter)
                this.levelPoints = levels[this.currentLevel].points;
                this.drawLevel(levels[this.currentLevel]);
            }
            
        };

        setRGBcolor(color) {
            let r = color[0]; 
            let g = color[1];
            let b = color[2];

            return r + ", " + g + ", " + b ;
        }

        diluteColor(color) {
            let r = color[0] + ((255 - color[0]) / 4); 
            let g = color[1] + ((255 - color[1]) / 4);
            let b = color[2]+ ((255 - color[2]) / 4);

            return "rgba(" + r + ", " + g + ", " + b + ", 1)";
        }

        drawLevel(level) {
            let color = level.color;
            let delutedColor = this.diluteColor(color)
            let ctx = this.ctx;
            let lines = level.lines; 
            let points = level.points;

            let transparent = "rgba(255,255,255,0)"
            ctx.fillStyle = transparent;
            //HardCode!!!
            ctx.fillRect(0,0,1000,1000);
            let red = "rgba(255,0,0,1)"

            
            // for border
            lines.forEach(element => {
                ctx.beginPath();
                ctx.strokeStyle = red;
                ctx.fillStyle = red;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.lineWidth = element.linewidth * 1.1;
                ctx.moveTo(element.linepoints[0][0], element.linepoints[0][1]);
                ctx.lineTo(element.linepoints[1][0], element.linepoints[1][1]);
                ctx.stroke();
                ctx.closePath();
            });
            // for filling
            lines.forEach(element => {
                ctx.beginPath();
                ctx.strokeStyle = delutedColor;
                ctx.fillStyle = delutedColor;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.lineWidth = element.linewidth;
                ctx.moveTo(element.linepoints[0][0], element.linepoints[0][1]);
                ctx.lineTo(element.linepoints[1][0], element.linepoints[1][1]);
                ctx.stroke();
                ctx.closePath();
            });

            // points
            points.forEach(point  => {
                ctx.strokeStyle = red;
                ctx.fillStyle = red;
                ctx.fillRect(point[0],point[1],5,5)
            })
            this.filledPointsFloor = Math.round(points.length / 100 * this.percent);

            if (this.substrateTexture) {
                this.substrateTexture.needsUpdate = true;
            };
        }
    }

    let newSubstrate = new substrateClass(substrate, THREE, tempCanvas, painter);
    return newSubstrate;
}

export default generateSubstrate;

