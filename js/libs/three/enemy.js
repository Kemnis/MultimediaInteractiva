class Enemy{

    constructor(scene) {
        this.mesh = new THREE.Mesh();
        //this.mesh.scale.set(sizeNdPower,sizeNdPower,sizeNdPower);
        this.mesh.position.set(THREE.Math.randInt(-30,30),0,THREE.Math.randInt(-30,30));
        this.vel = new THREE.Vector3();
        this.acel = new THREE.Vector3();
        this.direction = THREE.Math.randInt(0,2);
        this.initialForce = THREE.Math.randFloat(.1,.5);
        this.initialRotation = THREE.Math.randFloat(.001,.01);
        this.texture = THREE.Math.randInt(0,1);
        this.isAcelerating = false;
        this.ConMain = scene;
        this.added = false;
        this.ready = false;
        if (this.texture == 0)
        this.loadOBJWithMTL("assets/", "enemy.obj", "enemy.mtl", (object) => {this.mesh = object; this.ready = true;});
        else if (this.texture == 1)
        this.loadOBJWithMTL("assets/", "enemy.obj", "enemy2.mtl", (object) => {this.mesh = object;  this.ready = true;});
    }

    start(){
       if (this.added == false && this.ready == true)
        {
            this.ConMain.add(this.mesh);
            this.added = true;
        }
    }

    applyForce(force) {
        this.acel.add(force);
    }

    Rotate() {
        if (this.direction == 0)
            this.mesh.rotation.y -= this.initialRotation;
        else if (this.direction == 1)
            this.mesh.rotation.y += this.initialRotation;
    }

    update(dt){
        this.start();
        this.Rotate();
        this.applyForce(this.initialForce);
        this.vel.addScaledVector(this.acel, dt);
        this.vel.clampLength(0, 20);                
        this.mesh.position.addScaledVector(this.vel, dt);
        this.acel.set(0, 0, 0);
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