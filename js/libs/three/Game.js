class Game{
    constructor(controllers){
        this.OTPlayer = controllers;
        this.players = [];
        this.enemys = [];
        this.asteroids = [];
        this.playerControllers = [];
        this.planet = new THREE.Mesh;
        this.keyboard = new Keyboard();
        this.defaultController = new InputMapping(this.keyboard);
        this.ListObjs = new THREE.Object3D();
        this.renderer = new THREE.WebGLRenderer( {precision: "mediump" } );
        this.visibleSize =  { width: window.innerWidth, height: window.innerHeight};
        this.camera = new THREE.PerspectiveCamera(75, this.visibleSize.width / this.visibleSize.height, 0.1, 600);
        this.clock = new THREE.Clock();	
        this.scene = new THREE.Scene();
        this.MaxAsteroids = THREE.Math.randInt(1,15);
        this.paused = false;
    }

    sceneStart(){
        if (THREE.Math.randInt(0,2) == 0)
        {
            this.loadOBJWithMTL("assets/", "background.obj", "background1.mtl", (back) => {
                this.SetObjectPos(back,0,-95,0);
                this.SetObjectRot(back,0,180,0);
                this.SetObjectEsc(back,380,380,380);
                this.scene.add(back);
            });
        }
        else
        {
            this.loadOBJWithMTL("assets/", "background.obj", "background2.mtl", (back) => {
                this.SetObjectPos(back,0,-95,0);
                this.SetObjectRot(back,0,180,0);
                this.SetObjectEsc(back,380,380,380);
                this.scene.add(back);
            });
        }
        this.loadOBJWithMTL("assets/", "planet1.obj", "planet1.mtl", (planet1) => {
			this.SetObjectPos(planet1,0,-95,0);
			this.SetObjectRot(planet1,90,0,0);
            this.SetObjectEsc(planet1,18,18,18);
            this.planet = planet1;
			this.scene.add(this.planet);
		});

		this.loadOBJWithMTL("assets/", "enemy.obj", "enemy.mtl", (object) => {
			let enemy = new Enemy(object);
            this.enemys.push(enemy);
            this.scene.add(object);
        });
        
        this.loadOBJWithMTL("assets/", "enemy.obj", "enemy2.mtl", (object) => {
			let enemy = new Enemy(object);
            this.enemys.push(enemy);
            this.scene.add(object);
		});

        this.loadOBJWithMTL("assets/", "player.obj", "player.mtl", (object) => {
            this.players.push(new Player(0, object));
            this.scene.add(object);
        });

        this.loadOBJWithMTL("assets/", "player.obj", "player2.mtl", (object) => {
            let player = new Player(1, object);
            player.position.set(0, 0, 10);
            this.players.push(player);
            this.scene.add(object);
        });

        for (let total = 0 ; total < this.MaxAsteroids; total++) {
            let texture = THREE.Math.randInt(0,4);
            if (texture == 0)
            {
                this.loadOBJWithMTL("assets/", "planet1.obj", "asteroid1.mtl", (object) => {
                    this.asteroids.push(new Asteroid(object));
                    this.scene.add(object);
                });
            }
            else if (texture == 1){
                this.loadOBJWithMTL("assets/", "planet1.obj", "asteroid2.mtl", (object) => {
                    this.asteroids.push(new Asteroid(object));
                    this.scene.add(object);
                });
            }
            else if (texture == 2){
                this.loadOBJWithMTL("assets/", "planet1.obj", "asteroid3.mtl", (object) => {
                    this.asteroids.push(new Asteroid(object));
                    this.scene.add(object);
                });
            }
            else if (texture == 3){
                this.loadOBJWithMTL("assets/", "planet1.obj", "asteroid4.mtl", (object) => {
                    this.asteroids.push(new Asteroid(object));
                    this.scene.add(object);
                });
            }
        }

        this.playerControllers.push( new InputMapping(this.keyboard, {
            'Left': 'A',
            'Right': 'D',
            'Up': 'W',
            'Down': 'S',
            'Shoot': '2'
        }));

        this.playerControllers.push(new InputMapping(this.keyboard, {
            'Left': 'left',
            'Right': 'right',
            'Up': 'up',
            'Down': 'down',
            'Shoot': '0'
        }));
    }

    input(dt){
        for (let player of this.players) {
            let controller = this.playerControllers[player.playerId] || this.defaultController;
            player.input(controller);
        }
        if(this.keyboard.pressed('esc')){
            if(!this.paused)
                this.pause();
            else
                this.unpause();
            this.keyboard.pressed('esc', false);
        }

        let yaw = 0;
        let forward = 0;
        if (this.keyboard.pressed('I')){
            forward = -50;
            this.camera.translateZ(forward * dt);
        }
        else if (this.keyboard.pressed('K')) {
            forward = 50;
            this.camera.translateZ(forward * dt);
        }
        if (this.keyboard.pressed("J")) {
			yaw = -50;
            this.camera.translateX(yaw * dt);
		} else if (this.keyboard.pressed("L")) {
			yaw = 50;
            this.camera.translateX(yaw * dt);
		}

        //self.camera.rotation.y += yaw * dt;
        
    }

    update(dt){
        for(let player of this.players){
            player.update(dt);
        }
        for(let asteroid of this.asteroids){
            asteroid.update(dt);
        }
        for(let enemy of this.enemys){
            enemy.update(dt);
        }
        //this.planet.rotation.y += this.players[].angle;
    }

    render(){
        this.renderer.render(this.scene, this.camera);
    }

    // pause(){
    //     if(!this.paused){
    //         this.paused = !this.paused;
    //         this.clock.stop();
    //         this.onGamePaused();
    //     }
    // }

    // unpause(){
    //     if(this.paused){
    //         this.paused = !this.paused;
    //         this.clock.start();
    //         this.onGameUnpaused();
    //     }
    // }

    _Loop(){
        this.clock.start();
        let elapsedTime = 0;
        let self = this;
        function _Loop_() {
            let dt = self.clock.getDelta();  
            self.input(dt);
            self.update(dt);
            self.render();
            requestAnimationFrame(_Loop_);
        }
        requestAnimationFrame(_Loop_);
    }

    /*onKeyDown(event){
		keys[String.fromCharCode(event.keyCode)] = true;
    }
    
	onKeyUp(event){
		keys[String.fromCharCode(event.keyCode)] = false;
	}*/

    _setupScene(){
        this.camera.position.z = 2;
        this.camera.position.y = 50;
        this.camera.rotation.x = THREE.Math.degToRad(-90);

        this.renderer.setClearColor(new THREE.Color(0, 0, 0, 0));
        this.renderer.setPixelRatio(this.visibleSize.width / this.visibleSize.height);
        this.renderer.setSize(this.visibleSize.width, this.visibleSize.height);

        let ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 1.0);
        this.scene.add(ambientLight);

        let directionalLight = new THREE.DirectionalLight(new THREE.Color(0, .5, 1), 0.4);
        directionalLight.position.set(0, 0, 1);
        this.scene.add(directionalLight);

        //let grid = new THREE.GridHelper(50, 10, 0xffffff, 0xffffff);
        //grid.position.y = -1;
        //this.scene.add(grid);
    }
    
    SetObjectPos(object,PosX,PosY,PosZ){
        object.position.x = PosX;
        object.position.y = PosY;
        object.position.z = PosZ;
    }

	SetObjectRot(object,RotX,RotY,RotZ){
		object.rotation.x = THREE.Math.degToRad(RotX);
		object.rotation.y = THREE.Math.degToRad(RotY);
		object.rotation.z = THREE.Math.degToRad(RotZ);
    }
    
	SetObjectEsc(object,EscX,EscY,EscZ){
		object.scale.x = EscX;
		object.scale.y = EscY;
		object.scale.z = EscZ;
    }

    loadOBJWithMTL(path, objFile, mtlFile, onLoadCallback){
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