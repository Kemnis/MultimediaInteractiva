class Asteroid{

    constructor(mesh, name, scene) {
        this.name = name;
        this.mesh = mesh;
        this.ConMain = scene;
        this.mesh.position.y = -30;
        this.MaxVel = 4;
        this.vel = new THREE.Vector3();
        this.acel = new THREE.Vector3();
        this.dir = new THREE.Vector3();
        this.initialRotation = THREE.Math.randFloat(-.1,.1);
        this.direction = THREE.Math.randInt(0,2);
        this.MaxDist = 40;
        this.SecureRad = 10;
        this.startGame = false;
        this.redef = false;
    }

    start(){
        if(this.redef == false)
        {
            this.mesh.scale.set(THREE.Math.randFloat(.2,.8),THREE.Math.randFloat(.2,.6),THREE.Math.randFloat(.2,.4));
            let X=THREE.Math.randInt(-this.MaxDist,this.MaxDist);
            let Z=THREE.Math.randInt(-this.MaxDist,this.MaxDist);
            while(X >= -this.SecureRad && X <=this.SecureRad)
            {
                X=THREE.Math.randInt(-this.MaxDist,this.MaxDist);
                // console.log("X:" + X); 
            }
            while(Z >= -this.SecureRad && Z <=this.SecureRad)
            {
                Z=THREE.Math.randInt(-this.MaxDist,this.MaxDist);
            }
            if (X > 130 || Z >130)
            this.MaxVel = 10;
            else if (X > 95 || Z >95)
            this.MaxVel = 8;
            else if(X > 60 || Z >60)
            this.MaxVel = 4;
            
            this.mesh.position.set(X,0,Z);
            this.mesh.rotation.set(90,0,0);
            this.dir.x=-this.mesh.position.x - THREE.Math.randInt(0,15);
            this.dir.y=0;
            this.dir.z=-this.mesh.position.z- THREE.Math.randInt(0,15);
            this.dir.normalize();
            this.startGame = true;
            this.redef = true;
        }
    }

    applyForce(force) {
        this.acel.add(force);
    }

    // applyImpulse(force) {
    //     this.vel.add(force);
    // }
    Go()
    {
        if (this.direction == 0)
            this.mesh.rotation.x+=this.initialRotation;
        else if (this.direction == 1)
            this.mesh.rotation.y+=this.initialRotation;
        else if (this.direction == 2)
            this.mesh.rotation.z+=this.initialRotation;
    }

    update(dt){
        if(this.startGame == true){
            this.start();
            this.Go();
            this.applyForce(this.dir);
            this.vel.addScaledVector(this.acel, dt);
            this.vel.clampLength(0, this.MaxVel);                
            this.mesh.position.addScaledVector(this.vel, dt);
            this.acel.set(0, 0, 0);
            if(this.mesh.position.x >= this.MaxDist || this.mesh.position.x <= -this.MaxDist)
            this.removeEntity();
            if(this.mesh.position.z >= this.MaxDist || this.mesh.position.z <= -this.MaxDist)
            this.removeEntity();
        }
    }

    removeEntity() {
        this.ConMain.remove( this.mesh );
        delete this;
        //animate();
    }
}