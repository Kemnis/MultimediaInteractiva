class Player{

    constructor(playerId, mesh) {
        this.mesh = mesh;
        this.playerId = playerId;
        this.position = mesh.position;
        this.rotation = mesh.rotation;
        this.scale = mesh.scale;      
        this.vel = new THREE.Vector3();
        this.acel = new THREE.Vector3();

        this.isAcelerating = false;
        this.start();
    }

    start(){

    }

    input(controller){
        let force = 50;
        this.isAcelerating = false;
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
    }

    applyForce(force) {
        this.acel.add(force);
        //this.acel.clampLength(0, 10);
    }

    update(dt){
        if(!this.isAcelerating) {
            if(this.vel.lengthSq() > 1){
                let friction = this.vel.clone();
                friction.multiplyScalar(-1);
                friction.normalize();
                friction.multiplyScalar(5);
                this.applyForce(friction);
            }
            else {
                this.vel.set(0, 0, 0);
            }
        }

        this.vel.addScaledVector(this.acel, dt);
        this.vel.clampLength(0, 20);                
        this.position.addScaledVector(this.vel, dt);
        this.acel.set(0, 0, 0);

        if(this.vel.lengthSq() > 1) {
            let faceDirection = this.vel.clone().normalize();
            //faceDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(-90));
            let axis = new THREE.Vector3(1, 0, 0);
            this.mesh.quaternion.setFromUnitVectors(axis, faceDirection.clone().normalize());
        }
        // this.position.x += 1 * dt;
    }
}