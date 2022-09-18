function generatePalette() {
    class paletteClass{
        constructor(){
            this.r = 0;
            this.g = 0;
            this.b = 0;
            this.fixR = 0;
            this.fixG = 0;
            this.fixB = 0;
            this.fixWhite = "r";
            this.fixY = "r";
            this.geometry = new THREE.Mesh( 
                new THREE.PlaneGeometry(0.6, 0.2), 
                new THREE.MeshLambertMaterial({ color: 0xffffff }) );
            this.logs = "";
        }

        initPalette(self, palette) {
            palette.name = "palette";
            palette.position.z = -0.7;
            palette.position.y = 1;
            palette.position.x = 1;
            self.room.add( palette );
            palette.rotation.y = -Math.PI / 5;
        }

        rgbToHex(r, g, b) {
            return "" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }

        changeColor(intersects, palette, painter) {
            let translateX = Math.round(intersects[0].uv.x * 300);
            let translateY = Math.round(intersects[0].uv.y * 255);
            let newColor = palette.colorScheme(translateX, translateY);
            painter.color = palette.colorScheme(translateX, translateY);
            let hex = "#" + palette.rgbToHex(newColor[0], newColor[1], newColor[2]);
            palette.geometry.material = new THREE.MeshLambertMaterial({ color: hex });
        }

        colorScheme(x, y) { 
            if (x > 255) {
                let range = y * 6;
                if (range >= 1275) {
                    this.fixR = 255;
                    this.fixG = 0;
                    this.fixB = Math.abs(1530 - range);
                    this.white = "r";
                } else if (range >= 1020) {
                    this.fixR = Math.abs(1020 - range);
                    this.fixG = 0;
                    this.fixB = 255;
                } else if (range >= 765) {
                    this.fixR = 0;
                    this.fixG = Math.abs(1020 - range);
                    this.fixB = 255;
                } else if (range >= 510) {
                    this.fixR = 0;
                    this.fixG = 255;
                    this.fixB = Math.abs(510 - range);
                } else if (range >= 255) {
                    this.fixR = Math.abs(510 - range);
                    this.fixG = 255;
                    this.fixB = 0;
                } else {
                    this.fixR = 255;
                    this.fixG = Math.abs(range);
                    this.fixB = 0;
                }
                return [this.fixR, this.fixG, this.fixB];

            } else if (x >= 0 && x <= 255) {
                let cofY = y / 255;
                let cofX = x / 255;
                let rT = Math.round(this.fixR + ((255-this.fixR) * cofX));
                let gT = Math.round(this.fixG + ((255-this.fixG) * cofX));
                let bT = Math.round(this.fixB + ((255-this.fixB) * cofX));

                this.r = Math.round(rT*cofY)
                this.g = Math.round(gT*cofY)
                this.b = Math.round(bT*cofY)
            }
            return [this.r, this.g, this.b];
        }
    }

    let newPalette = new paletteClass();
    return newPalette;
}

export default generatePalette;