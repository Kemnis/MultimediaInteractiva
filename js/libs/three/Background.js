class Background{

    constructor(scene) {
        this.ConMain = scene;
        this.added = false;
        this.ready = false;
        this.addedW = false;
        this.readyW = false;
        this.meshBack = new THREE.Mesh();
        this.meshWorld = new THREE.Mesh();
        this.startGame = false;
        if (THREE.Math.randInt(0,1) == 0)
            this.loadOBJWithMTL("assets/", "background.obj", "background1.mtl", (object) => {this.meshBack = object; this.ready = true;});
        else
            this.loadOBJWithMTL("assets/", "background.obj", "background2.mtl", (object) => {this.meshBack = object;  this.ready = true;});
        this.loadOBJWithMTL("assets/", "planet1.obj", "planet1.mtl", (object) => {this.meshWorld = object;  this.readyW = true;});
    }

    start(){
        this.meshBack.position.set(0,-180,0);
        this.meshBack.scale.set(1200,600,600);
        this.meshWorld.position.set(0,-90,0);
        this.meshWorld.rotation.set(90,0,0);
        this.meshWorld.scale.set(14,14,14);
        if (this.added == false && this.ready == true)
        {
            this.ConMain.add(this.meshBack);
            this.added = true;
        }
        if (this.addedW == false && this.readyW == true)
        {
            this.ConMain.add(this.meshWorld);
            this.addedW = true;
            this.startGame = true;
        }
    }
    update(dt, startGame){
        this.startGame = startGame;
        if(this.startGame == true)
        {
            this.meshWorld.rotation.y += .001;            
        }
        else{
            this.start();
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