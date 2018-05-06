class Player{
    constructor(controllers){
        this.control = controllers;
        this.keyboard = new Keyboard();  
        this.defaultController = new InputMapping(this.keyboard);
        this.ListObjs = new THREE.Object3D();
        this.renderer = new THREE.WebGLRenderer( {precision: "mediump" } );
        this.visibleSize =  { width: window.innerWidth, height: window.innerHeight};
        this.clock = new THREE.Clock();		
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.visibleSize.width / this.visibleSize.height, 0.1, 600);
    }

    sceneStart()
    {
        this.loadOBJWithMTL("assets/", "planet1.obj", "planet1.mtl", (planet1) => {
			this.SetObjectPos(planet1,0,-95,0);		
			this.SetObjectRot(planet1,90,0,0);	
			this.SetObjectEsc(planet1,18,18,18);
			this.scene.add(planet1);
		});

		this.loadOBJWithMTL("assets/", "enemy.obj", "enemy.mtl", (enemy) => {
			this.SetObjectPos(enemy,0,0,-1);		
			this.SetObjectRot(enemy,0,0,0);	
			this.SetObjectEsc(enemy,0,0,0);
			this.scene.add(enemy);
		});

        this.loadOBJWithMTL("assets/", "player.obj", "player.mtl", (player) => {
            this.SetObjectPos(player,0,0,0);		
            this.SetObjectRot(player,0,0,0);	
            this.SetObjectEsc(player,0,0,0);
            this.scene.add(player);
        });
    }

    _Loop(){
        deltaTime = this.clock.getDelta();	

        let yaw = 0;
        let forward = 0;
        if (keys["W"]) {
            forward = -20;
        } else if (keys["S"]) {
            forward = 20;
        }

        if (isWorldReady[0] && isWorldReady[1]) {
            
            this.camera.rotation.y += yaw * deltaTime;
            this.camera.translateZ(forward * deltaTime);
        }
    
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(_Loop);
    }

    onKeyDown(event) {
		keys[String.fromCharCode(event.keyCode)] = true;
	}
	onKeyUp(event) {
		keys[String.fromCharCode(event.keyCode)] = false;
	}

    _setupScene() {		
        this.camera.position.z = 2;
        this.camera.position.y = 50;
        this.camera.rotation.x = THREE.Math.degToRad(-90);

        this.renderer.setClearColor(new THREE.Color(0, 0, 0));
        this.renderer.setPixelRatio(this.visibleSize.width / this.visibleSize.height);
        this.renderer.setSize(this.visibleSize.width, this.visibleSize.height);

        let ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 1.0);
        this.scene.add(ambientLight);

        let directionalLight = new THREE.DirectionalLight(new THREE.Color(1, 1, 0), 0.4);
        directionalLight.position.set(0, 0, 1);
        this.scene.add(directionalLight);

        let grid = new THREE.GridHelper(50, 10, 0xffffff, 0xffffff);
        grid.position.y = -1;
        this.scene.add(grid);
    }
    
    SetObjectPos(object,PosX,PosY,PosZ)
    {
        object.position.x = PosX;
        object.position.y = PosY;
        object.position.z = PosZ;
    }
	SetObjectRot(object,RotX,RotY,RotZ)
    {
		object.rotation.x = THREE.Math.degToRad(RotX);
		object.rotation.y = THREE.Math.degToRad(RotY);
		object.rotation.z = THREE.Math.degToRad(RotZ);
	}
	SetObjectEsc(object,EscX,EscY,EscZ)
    {
		object.scale.x = EscX;
		object.scale.y = EscY;
		object.scale.z = EscZ;
    }
    loadOBJWithMTL(path, objFile, mtlFile, onLoadCallback) {
		let mtlLoader = new THREE.MTLLoader();
		mtlLoader.setPath(path);
		mtlLoader.load(mtlFile, (materials) => {
			
			let objLoader = new THREE.OBJLoader();
			objLoader.setMaterials(materials);
			objLoader.setPath(path);
			objLoader.load(objFile, (object) => {
				onLoadCallback(object);
			});

        });
    }
}