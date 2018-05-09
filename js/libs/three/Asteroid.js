class Asteroid{

    constructor(mesh) {
        this.mesh = mesh;
        this.position = mesh.position;
        this.rotation = mesh.rotation;
        this.scale = mesh.scale;      
        this.vel = new THREE.Vector3();
        this.acel = new THREE.Vector3();
        this.rot = new THREE.Vector3();
        this.initialForce = THREE.Math.randFloat(.001,.1);
        this.initialRotation = THREE.Math.randFloat(.001,.01);
        this.direction = THREE.Math.randInt(0,6);
        this.isAcelerating = false;
        this.start();
    }

    start(){
        this.scale.set(THREE.Math.randFloat(.2,.8),THREE.Math.randFloat(.2,.6),THREE.Math.randFloat(.2,.4));
        this.position.set(THREE.Math.randInt(-30,30),0,THREE.Math.randInt(-30,30));
        this.rotation.set(90,0,0);
    }

    applyForce(force) {
        this.acel.add(force);
    }

    Rotate() {
        if (this.direction == 0)
        {
            this.rotation.x -= this.initialRotation;
            this.applyForce(new THREE.Vector3(-this.initialForce, 0, 0));
        }
        else if (this.direction == 1)
        {
            this.rotation.x += this.initialRotation;
            this.applyForce(new THREE.Vector3(this.initialForce, 0, 0));
        }
        else if (this.direction == 2)
        {
            this.rotation.y -= this.initialRotation;
        }
        else if (this.direction == 3)
        {
            this.rotation.y += this.initialRotation;
        }
        else if (this.direction == 4)
        {
            this.rotation.z -= this.initialRotation;
            this.applyForce(new THREE.Vector3(0, 0, -this.initialForce));
        }
        else if (this.direction == 5)
        {
            this.rotation.z += this.initialRotation;
            this.applyForce(new THREE.Vector3(0, 0, this.initialForce));
        }
    }

    acelerate()
    {
        this.isAcelerating = true;
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
        this.acelerate();
        this.vel.addScaledVector(this.acel, dt);
        this.vel.clampLength(0, .8);                
        this.position.addScaledVector(this.vel, dt);
        this.acel.set(0, 0, 0);

        // if(this.vel.lengthSq() > 1) {
        //     let faceDirection = this.vel.clone().normalize();
        //     let axis = new THREE.Vector3(1, 0, 0);
        //     this.mesh.quaternion.setFromUnitVectors(axis, faceDirection.clone().normalize());
        // }
    }
}