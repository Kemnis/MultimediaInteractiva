class Player{

    constructor(playerId, scene) {
        this.mesh = new THREE.Mesh();
        this.playerId = playerId;
        this.vel = new THREE.Vector3();
        this.acel = new THREE.Vector3();
        this.isAcelerating = false;
        this.ConMain = scene;
        this.added = false;
        this.ready = false;
        this.startGame = false;
        if (this.playerId == 0)
        this.loadOBJWithMTL("assets/", "player.obj", "player.mtl", (object) => {this.mesh = object; this.ready = true;});
        else if (this.playerId == 1)
        this.loadOBJWithMTL("assets/", "player.obj", "player2.mtl", (object) => {this.mesh = object; this.ready = true;});
    }

    start(){
        this.mesh.scale.set(.5,.5,.5);
        if (this.added == false && this.ready == true)
        {
        this.ConMain.add(this.mesh);
        this.added = true;
        }
        
    }

    input(controller){
        let force = 50;
        this.isAcelerating = false;
        if(controller.pressed('Spawn')){
            this.start();
        }

        if(controller.pressed('Left')){
            this.applyForce(new THREE.Vector3(-force, 0, 0));
            this.isAcelerating = true;
        }

        if(controller.pressed('Right')){
            this.applyForce(new THREE.Vector3(force, 0, 0));
            this.isAcelerating = true;
        }

        if(controller.pressed('Up')){
            this.applyForce(new THREE.Vector3(0, 0, -force));
            this.isAcelerating = true;
        }

        if(controller.pressed('Down')){
            this.applyForce(new THREE.Vector3(0, 0, force));
            this.isAcelerating = true;
        }

        if(controller.pressed('Shoot')){
            return 10;
        }
        return 0;
    }

    applyForce(force) {
        this.acel.add(force);
    }

    update(dt){
        if (this.ready = true)
        {
            if(!this.isAcelerating) {
                if(this.vel.lengthSq() > 1){
                    let friction = this.vel.clone();
                    friction.multiplyScalar(-1);
                    friction.normalize();
                    friction.multiplyScalar(15);
                    this.applyForce(friction);
                }
                else {
                    this.vel.set(0, 0, 0);
                }
            }

            this.vel.addScaledVector(this.acel, dt);
            this.vel.clampLength(0, 20);                
            this.mesh.position.addScaledVector(this.vel, dt);
            this.acel.set(0, 0, 0);

            if(this.vel.lengthSq() > 1) {
                let faceDirection = this.vel.clone().normalize();
                let axis = new THREE.Vector3(1, 0, 0);
                this.mesh.quaternion.setFromUnitVectors(axis, faceDirection.clone().normalize());
            }

        }
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