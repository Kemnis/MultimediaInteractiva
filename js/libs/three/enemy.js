class Enemy{

    constructor(mesh) {
        this.mesh = mesh;
        //this.playerId = playerId;
        this.position = mesh.position;
        this.rotation = mesh.rotation;
        this.scale = mesh.scale;      
        this.vel = new THREE.Vector3();
        this.acel = new THREE.Vector3();
        this.direction = THREE.Math.randInt(0,2);
        this.initialForce = THREE.Math.randFloat(.1,.5);
        this.initialRotation = THREE.Math.randFloat(.001,.01);
        this.isAcelerating = false;
        this.start();
    }

    start(){
        let sizeNdPower = THREE.Math.randFloat(.5,1);
        this.scale.set(sizeNdPower,sizeNdPower,sizeNdPower);
        this.position.set(THREE.Math.randInt(-30,30),0,THREE.Math.randInt(-30,30));
    }

    applyForce(force) {
        //this.acel.add(force);
    }

    Rotate() {
        if (this.direction == 0)
            this.rotation.y -= this.initialRotation;
        else if (this.direction == 1)
            this.rotation.y += this.initialRotation;
    }

    update(dt){
        // if(!this.isAcelerating) {
        //     if(this.vel.lengthSq() > 1){
        //         let friction = this.vel.clone();
        //         friction.multiplyScalar(-1);
        //         friction.normalize();
        //         friction.multiplyScalar(5);
        //         this.applyForce(friction);
        //     }
        //     else {
        //         this.vel.set(0, 0, 0);
        //     }
        // }
        this.Rotate();
        this.applyForce(this.initialForce);
        this.vel.addScaledVector(this.acel, dt);
        this.vel.clampLength(0, 20);                
        this.position.addScaledVector(this.vel, dt);
        this.acel.set(0, 0, 0);

        // if(this.vel.lengthSq() > 1) {
        //     let faceDirection = this.vel.clone().normalize();
        //     let axis = new THREE.Vector3(1, 0, 0);
        //     this.mesh.quaternion.setFromUnitVectors(axis, faceDirection.clone().normalize());
        // }
    }
}