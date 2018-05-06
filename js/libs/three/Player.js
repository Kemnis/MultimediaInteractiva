class Player{
    constructor(controllers){
        this.control = controllers;
        this.keyboard = new Keyboard();  
        this.defaultController = new InputMapping(this.keyboard);
        this.ModelsToRender = 0;
        this.ContainerObj = new Array();
		loadOBJWithMTL("assets/", "planet1.obj", "planet1.mtl", (planet1) => {
			//SetObjectPos(planet1,0,-95,0);		
			//SetObjectRot(planet1,90,0,0);	
			//SetObjectEsc(planet1,18,18,18);
			this.ContainerObj[this.ModelsToRender] = planet1;
            this.ModelsToRender++;
			//scene.add(planet1);
		});

		loadOBJWithMTL("assets/", "enemy.obj", "enemy.mtl", (enemy) => {
			//SetObjectPos(enemy,0,0,-30);		
			//SetObjectRot(enemy,0,0,0);	
			//SetObjectEsc(enemy,0,0,0);
            this.ContainerObj[this.ModelsToRender] = enemy;
            this.ModelsToRender++;
			//scene.add(enemy);
		});

        loadOBJWithMTL("assets/", "player.obj", "player.mtl", (player) => {
            //SetObjectPos(player,0,0,0);		
            //SetObjectRot(player,0,0,0);	
            //SetObjectEsc(player,0,0,0);
            this.ContainerObj[this.ModelsToRender] = player;
            this.ModelsToRender++;
            //scene.add(player);

        });
        
        
    }
    
    _render() {
        requestAnimationFrame(render);
        deltaTime = clock.getDelta();	

        var yaw = 0;
        var forward = 0;
        if (keys["W"]) {
            forward = -20;
        } else if (keys["S"]) {
            forward = 20;
        }

        if (isWorldReady[0] && isWorldReady[1]) {
            
            camera.rotation.y += yaw * deltaTime;
            camera.translateZ(forward * deltaTime);
        }
    
        scene.add(Jugador.ContainerObj[1]);
        renderer.render(scene, camera);
    }

    _setupScene() {		
        var visibleSize = { width: window.innerWidth, height: window.innerHeight};
        clock = new THREE.Clock();		
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, visibleSize.width / visibleSize.height, 0.1, 600);
        camera.position.z = 2;
        camera.position.y = 50;
        camera.rotation.x = THREE.Math.degToRad(-90);

        renderer = new THREE.WebGLRenderer( {precision: "mediump" } );
        renderer.setClearColor(new THREE.Color(0, 0, 0));
        renderer.setPixelRatio(visibleSize.width / visibleSize.height);
        renderer.setSize(visibleSize.width, visibleSize.height);

        var ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 1.0);
        scene.add(ambientLight);

        var directionalLight = new THREE.DirectionalLight(new THREE.Color(1, 1, 0), 0.4);
        directionalLight.position.set(0, 0, 1);
        scene.add(directionalLight);

        var grid = new THREE.GridHelper(50, 10, 0xffffff, 0xffffff);
        grid.position.y = -1;
        scene.add(grid);
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