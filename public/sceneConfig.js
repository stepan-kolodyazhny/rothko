export const sceneConfig = {
    "camera": {
        "perspective": {
            "fov": 50,
            "aspect": "",
            "near": 0.1,
            "far": 100
        } ,
        "position": {
            "x": 0,
            "y": 1.6,
            "z": 3
        }
    },
    "raycasterDirection" : {
        "x": 0,
        "y": 0,
        "z": -1
    },
    "sceneBackgroundColor": 0x505050,
    "light": {
        "hemisphereLight": {
            "skyColor": 0x606060,
            "groundColor": 0x404040,
            "intensity": 1
        },
        "directionalLight": {
            "color": 0xffffff,
            "position": {
                "x": 1,
                "y": 1,
                "z": 1
            }
        }
    }, 
    "controlsTarget": {
        "x": 0,
        "y": 1.6,
        "z": 0
    },
    "room": {
        "BoxLineGeometry": {
        }
    }, 
    "components": {
        "canvas": {
            "height": 1000,
            "widht": 1000,
            "position": {
                "x": 0,
                "y": 1,
                "z": -1
            }
        }
    },
    "buttonStyle": {
        "color": "yellow",
        "geometry": {
            "width": 0.3,
            "height": 0.3,
            "depth": 0.1
        },
        "position": {
            "x": -0.9,
            "y": 1.2,
            "z": -0.7
        },
        "rotation": {
            "x": 0,
            "y": Math.PI / 5,
            "z":0
        }
    },
    "modeButtonStyle": {
        "color": "white",
        "geometry": {
            "width": 0.3,
            "height": 0.3,
            "depth": 0.1
        },
        "position": {
            "x": -0.9,
            "y": 1.5,
            "z": -0.7
        },
        "rotation": {
            "x": 0,
            "y": Math.PI / 5,
            "z":0
        }
    }
}
