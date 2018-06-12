

class Game{
    constructor(controllers){
        this.OTPlayer = controllers;
        this.players = [];
        this.enemys = [];
        this.asteroids = [];
        this.playerControllers = [];
        this.keyboard = new Keyboard();
        this.defaultController = new InputMapping(this.keyboard);
        this.renderer = new THREE.WebGLRenderer( {precision: "mediump" } );
        this.visibleSize =  { width: window.innerWidth, height: window.innerHeight};
        this.camera = new THREE.PerspectiveCamera(75, this.visibleSize.width / this.visibleSize.height, 0.1, 600);
        this.clock = new THREE.Clock();	
        this.scene = new THREE.Scene();
        this.environment = new Background(this.scene);
        this.MaxAsteroids = THREE.Math.randInt(20,30);
        this.camerangle = 1;
        this.paused = false;
        //Area de colision y limites para moverse de los usuarios
        this.delimeterRad = 29;
        this.delimeterGeo = new THREE.SphereGeometry(this.delimeterRad, 40, 40, 0, Math.PI * 2, 0, Math.PI * 2);
        this.delimeterMat = new THREE.MeshLambertMaterial({color: 0xff0000, transparent: true, opacity: 0.5});
        this.delimeter = new THREE.Mesh(this.delimeterGeo,this.delimeterMat);

        this.delimeterEnemyRad = 55;
        this.delimeterEnemyGeo = new THREE.SphereGeometry(this.delimeterEnemyRad, 40, 40, 0, Math.PI * 2, 0, Math.PI * 2);
        this.delimeterEnemyMat = new THREE.MeshLambertMaterial({color: 0xff0000, transparent: true, opacity: 0.5});
        this.delimeterEnemy = new THREE.Mesh(this.delimeterEnemyGeo,this.delimeterEnemyMat);

        this.Sun = new THREE.Object3D();
        this.penalization = 7;
        this.time = 0;
        this.startGame = false;
        this.score = 0;
    }

    sceneStart(){
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
        let directionalLight = new THREE.DirectionalLight(new THREE.Color(1, 0.75, 0.75), .35);
        directionalLight.position.set(15, -90, 0);
        this.Sun.position.set(0,0,0);
        this.Sun.rotation.set(45,0,-90);
        this.Sun.add(directionalLight);
        this.scene.add(this.Sun);
        this.environment.start();


        this.delimeter.position.set(0,0,1.5);
        //this.scene.add(this.delimeter);
        this.delimeterEnemy.position.set(0,0,1.5);
        //this.scene.add(this.delimeterEnemy);
        this.playerControllers.push( new InputMapping(this.keyboard, {
            'Spawn': '8',
            'Left': 'A',
            'Right': 'D',
            'Up': 'W',
            'Down': 'S',
            'Shoot': 'Space'
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
        this.Sun.rotation.y -= .001;
        if(timeleft>=100)
        timeleft=99;
        if(this.asteroids.length == 0)
        {
        let fuera=0;
        }
        for(let player of this.players){
            player.update(dt);
            if(player.playerId == 0)
            {
                player.startGame = startGame;
                player.alive = true;
            }
            let CenterDist = Math.sqrt((this.delimeter.position.x - player.mesh.position.x)*(this.delimeter.position.x - player.mesh.position.x) 
            + (this.delimeter.position.y - player.mesh.position.y) * (this.delimeter.position.y - player.mesh.position.y) + 
            (this.delimeter.position.z - player.mesh.position.z) * (this.delimeter.position.z - player.mesh.position.z));
            let RadsPWorld =this.delimeterRad + player.rad;
            if(CenterDist > RadsPWorld)
            {
                let f = this.delimeter.position.clone();
                f.sub(player.mesh.position);
                //let f = this.delimeter.position.subVectors(player.mesh.position);
                let difference = CenterDist - RadsPWorld;
                player.applyForce(f.multiplyScalar(8));
            } 
        }
        for(let asteroid of this.asteroids){
            if(this.startGame == true && timeleft > 1 && asteroid.IsDead == false)
            {
                let distancia = Math.sqrt((asteroid.hit.position.x - this.players[0].hit.position.x)*(asteroid.hit.position.x - this.players[0].hit.position.x) 
                + (asteroid.hit.position.y - this.players[0].hit.position.y) * (asteroid.hit.position.y - this.players[0].hit.position.y) + 
                (asteroid.hit.position.z - this.players[0].hit.position.z) * (asteroid.hit.position.z - this.players[0].hit.position.z)); 
                let Radios = asteroid.realRad + this.players[0].rad;
                //console.log("distancia:" + distancia); 
                //console.log("sumaRadios:" + Radios); 
                if(distancia < Radios)
                {
                    if(timeleft < 95)
                    timeleft +=this.penalization;
                    else
                    timeleft = 100;
                    asteroid.removeEntity();
                    //asteroid.IsDead=true;
                    this.particles(this.players[0].mesh.position, 0);
                }
                let distancia2 = Math.sqrt((asteroid.hit.position.x - this.players[1].hit.position.x)*(asteroid.hit.position.x - this.players[1].hit.position.x) 
                + (asteroid.hit.position.y - this.players[1].hit.position.y) * (asteroid.hit.position.y - this.players[1].hit.position.y) + 
                (asteroid.hit.position.z - this.players[1].hit.position.z) * (asteroid.hit.position.z - this.players[1].hit.position.z)); 
                let Radios2 = asteroid.realRad + this.players[1].rad;
                //console.log("distancia:" + distancia); 
                //console.log("sumaRadios:" + Radios); 
                if(distancia2 < Radios2 && this.players[1].alive == true)
                {
                    if(timeleft < 95)
                    timeleft +=this.penalization;
                    else
                    timeleft = 100;
                    asteroid.removeEntity();
                    //asteroid.IsDead=true;
                    this.particles(this.players[1].mesh.position, 0);
                }
            }
            if(this.players.length > 0)
            {
                if(this.players[0].ActiveBullets.length >0)
                {
                    for (let Bullet of this.players[0].ActiveBullets)
                    {
                        if(this.startGame == true && timeleft > 1 && asteroid.IsDead == false && Bullet.alive == true)
                        {
                            let distancia = Math.sqrt((asteroid.hit.position.x - Bullet.mesh.position.x)*(asteroid.hit.position.x - Bullet.mesh.position.x) 
                            + (asteroid.hit.position.y - Bullet.mesh.position.y) * (asteroid.hit.position.y - Bullet.mesh.position.y) + 
                            (asteroid.hit.position.z - Bullet.mesh.position.z) * (asteroid.hit.position.z - Bullet.mesh.position.z)); 
                            let Radios = asteroid.realRad + Bullet.rad;
                            //console.log("distancia:" + distancia); 
                            //console.log("sumaRadios:" + Radios); 
                            if(distancia < Radios)
                            {
                                this.particles(asteroid.mesh.position.clone(), 1);
                                //asteroid.IsDead=true;
                                Bullet.alive= false;
                                this.score+=10;
                                Bullet.removeEntity();
                                asteroid.removeEntity();
                            }
                        }
                    }
                }
                if(this.players[1].ActiveBullets.length >0)
                {
                    for (let Bullet of this.players[1].ActiveBullets)
                    {
                        if(this.startGame == true && timeleft > 1 && asteroid.IsDead == false && Bullet.alive == true)
                        {
                            let distancia = Math.sqrt((asteroid.hit.position.x - Bullet.mesh.position.x)*(asteroid.hit.position.x - Bullet.mesh.position.x) 
                            + (asteroid.hit.position.y - Bullet.mesh.position.y) * (asteroid.hit.position.y - Bullet.mesh.position.y) + 
                            (asteroid.hit.position.z - Bullet.mesh.position.z) * (asteroid.hit.position.z - Bullet.mesh.position.z)); 
                            let Radios = asteroid.realRad + Bullet.rad;
                            //console.log("distancia:" + distancia); 
                            //console.log("sumaRadios:" + Radios); 
                            if(distancia < Radios)
                            {
                                this.particles(asteroid.mesh.position.clone(), 1);                                
                                //asteroid.IsDead=true;
                                Bullet.alive= false;
                                this.score+=10;
                                Bullet.removeEntity();
                                asteroid.removeEntity();
                            }
                        }
                    }
                }
            }
            asteroid.update(dt, this.startGame);
            asteroid.startGame = startGame;
        }
        TWEEN.update();
        // for(let enemy of this.enemys){
        //     enemy.update(dt);
        // }
    }

    generateSprite(target) {
        let canvas = document.createElement( 'canvas' );
        canvas.width = 16;
        canvas.height = 16;
        let context = canvas.getContext( '2d' );
        let gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
        gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
        gradient.addColorStop( 0.2, 'rgba(0,255,255,1)' );
        if(target == 0)
            gradient.addColorStop( 0.4, 'rgba(0,64,0,1)' );
        else
            gradient.addColorStop( 0.4, 'rgba(96,6,0,1)' );
        gradient.addColorStop( 1, 'rgba(0,0,0,1)' );
        context.fillStyle = gradient;
        context.fillRect( 0, 0, canvas.width, canvas.height );
        return canvas;
    }

    initParticle( part, delay, pos ) {
        part = this instanceof THREE.Sprite ? this : part;
        delay = delay !== undefined ? delay : 0;
        part.position.set( pos.x, pos.y, pos.z );
        part.scale.x = part.scale.y = Math.random() * 10 + 1;
        new TWEEN.Tween( part )
            .delay( delay )
            .to( {}, 10000 )
            .onComplete( this.initParticle )
            .start();
        new TWEEN.Tween( part.position )
            .delay( delay )
            .to( { x: Math.random() * 4000 - 2000, y: Math.random() * 1000 - 500, z: Math.random() * 4000 - 2000 }, 10000 )
            .start();
        new TWEEN.Tween( part.scale )
            .delay( delay )
            .to( { x: 0.01, y: 0.01 }, 10000 )
            .start();
    }

    particles(Pos, target)
    {
        let particle;
        let material = new THREE.SpriteMaterial( {
            map: new THREE.CanvasTexture( this.generateSprite(target) ),
            blending: THREE.AdditiveBlending
        } );
        for ( let i = 0; i < 30; i++ ) {
            particle = new THREE.Sprite( material );
            this.initParticle( particle, i * 5, Pos );
            this.scene.add( particle );
        }
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