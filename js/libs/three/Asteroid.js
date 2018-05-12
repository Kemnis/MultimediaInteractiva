class Asteroid{

    constructor(mesh) {
        this.mesh = mesh;
        this.position = mesh.position;
        this.rotation = mesh.rotation;
        this.scale = mesh.scale;      
        this.vel = new THREE.Vector3();
        this.acel = new THREE.Vector3();
        this.IX = THREE.Math.randFloat(-.1,.1);
        this.IZ = THREE.Math.randFloat(-.1,.1);
        this.initialRotation = THREE.Math.randFloat(-.1,.1);
        this.direction = THREE.Math.randInt(0,2);
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

    applyImpulse(force) {
        this.vel.add(force);
    }

    acelerate()
    {
        this.isAcelerating = true;
    }

    Go()
    {
        if (this.direction == 0)
            this.rotation.x+=this.initialRotation;
        else if (this.direction == 1)
            this.rotation.y+=this.initialRotation;
        else if (this.direction == 2)
            this.rotation.z+=this.initialRotation;
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
        this.Go();
        this.applyImpulse(new THREE.Vector3(this.IX, 0, this.IZ));
        
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