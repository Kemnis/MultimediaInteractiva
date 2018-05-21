

class Game{
    constructor(controllers){
        this.OTPlayer = controllers;
        this.players = [];
        this.enemys = [];
        this.asteroids = [];
        this.playerControllers = [];
        this.keyboard = new Keyboard();
        this.defaultController = new InputMapping(this.keyboard);
        this.ListObjs = new THREE.Object3D();
        this.renderer = new THREE.WebGLRenderer( {precision: "mediump" } );
        this.visibleSize =  { width: window.innerWidth, height: window.innerHeight};
        this.camera = new THREE.PerspectiveCamera(75, this.visibleSize.width / this.visibleSize.height, 0.1, 600);
        this.clock = new THREE.Clock();	
        this.scene = new THREE.Scene();
        this.environment = new Background(this.scene);
        this.MaxAsteroids = THREE.Math.randInt(7,25);
        this.camerangle = 1;
        this.paused = false;

        this.time = 0;
        this.startGame = false;
        this.score = 0;
    }

    sceneStart(){
        //this.enemys.push(new Enemy(this.scene));
        //this.enemys.push(new Enemy(this.scene));

        this.players.push(new Player(0, this.scene));
        this.players.push(new Player(1, this.scene));
        
        for (let total = 0 ; total < this.MaxAsteroids; total++) {
            let texture = THREE.Math.randInt(0,4);
            if (texture == 0)
            {
                this.loadOBJWithMTL("assets/", "planet1.obj", "asteroid1.mtl", (object) => {
                    this.asteroids.push(new Asteroid(object,"Asteroid " + total, this.scene));
                    this.scene.add(object);
                });
            }
            else if (texture == 1){
                this.loadOBJWithMTL("assets/", "planet1.obj", "asteroid2.mtl", (object) => {
                    this.asteroids.push(new Asteroid(object,"Asteroid " + total, this.scene));
                    this.scene.add(object);
                });
            }
            else if (texture == 2){
                this.loadOBJWithMTL("assets/", "planet1.obj", "asteroid3.mtl", (object) => {
                    this.asteroids.push(new Asteroid(object,"Asteroid " + total, this.scene));
                    this.scene.add(object);
                });
            }
            else if (texture == 3){
                this.loadOBJWithMTL("assets/", "planet1.obj", "asteroid4.mtl", (object) => {
                    this.asteroids.push(new Asteroid(object,"Asteroid " + total, this.scene));
                    this.scene.add(object);
                });
            }
        }

        this.playerControllers.push( new InputMapping(this.keyboard, {
            'Spawn': '8',
            'Left': 'A',
            'Right': 'D',
            'Up': 'W',
            'Down': 'S',
            'Shoot': '2'
        }));

        this.playerControllers.push(new InputMapping(this.keyboard, {
            'Spawn': '9',
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
            this.score += player.input(controller);
        }
        //Paussed key
        if(this.keyboard.pressed('esc')){
            if(!this.paused)
                this.pause();
            else
                this.unpause();
            this.keyboard.pressed('esc', false);
        }

        let yaw = 0;
        let forward = 0;
        //Camera Move Forward
        if (this.keyboard.pressed('I')){
            forward = -50;
            this.camera.translateZ(forward * dt);
        }
        //Camera Move Backward
        else if (this.keyboard.pressed('K')) {
            forward = 50;
            this.camera.translateZ(forward * dt);
        }
        //Camera Move Left
        if (this.keyboard.pressed("J")) {
			yaw = -50;
            this.camera.translateX(yaw * dt);
        } 
        //Camera Move Right
        else if (this.keyboard.pressed("L")) {
			yaw = 50;
            this.camera.translateX(yaw * dt);
        }
        //Camera Turn Left
        if (this.keyboard.pressed("V")) {
            this.camera.rotateY(THREE.Math.degToRad(this.camerangle));
        } 
        //Camera Turn Right
        else if (this.keyboard.pressed("N")) {
            this.camera.rotateY(THREE.Math.degToRad(-this.camerangle));
        }
        //Camera Turn up
        if (this.keyboard.pressed("G")) {
            this.camera.rotateX(THREE.Math.degToRad(this.camerangle));
        } 
        //Camera Turn Down
        else if (this.keyboard.pressed("B")) {
            this.camera.rotateX(THREE.Math.degToRad(-this.camerangle));
		}
    }
    
    update(dt){
        this.environment.update(dt, this.startGame);
        if(this.asteroids.length == 0)
        {
        let fuera=0;
        }
        for(let player of this.players){
            player.update(dt);
            if(player.playerId == 0)
            player.startGame = startGame;
        }
        for(let asteroid of this.asteroids){
            asteroid.update(dt, this.startGame);
            asteroid.startGame = startGame;
        }
        // for(let enemy of this.enemys){
        //     enemy.update(dt);
        // }
    }

    render(){
        this.renderer.render(this.scene, this.camera);
    }

    pause(){
        if(!this.paused){
            this.paused = !this.paused;
            this.clock.stop();
            this.onGamePaused();
        }
    }

    unpause(){
        if(this.paused){
            this.paused = !this.paused;
            this.clock.start();
            this.onGameUnpaused();
        }
    }

    getVars(timeleft,startGame)
    {
        this.time = timeleft;
        this.startGame = startGame;
    }

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