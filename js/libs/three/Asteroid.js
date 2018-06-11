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
        this.randRad =THREE.Math.randFloat(.2,1);
        this.realRad = this.randRad * 5
        this.startGame = false;
        this.redef = false;


        this.hitgeometry = new THREE.SphereGeometry(this.realRad, 40, 40, 0, Math.PI * 2, 0, Math.PI * 2);
        this.hitmaterial = new THREE.MeshLambertMaterial({color: 0x00ffff, transparent: true, opacity: 0.5});
        this.hit = new THREE.Mesh(this.hitgeometry,this.hitmaterial);
        this.IsDead = false;
    }

    start(){
        if(this.redef == false)
        {
            this.mesh.scale.set(this.randRad,this.randRad,this.randRad);
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
            this.hit.position.set(this.mesh.position.x,this.mesh.position.y,this.mesh.position.z);
            this.dir.x=-this.mesh.position.x - THREE.Math.randInt(0,15);
            this.dir.y=0;
            this.dir.z=-this.mesh.position.z- THREE.Math.randInt(0,15);
            this.dir.normalize();
            this.ConMain.add(this.hit);
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
            this.hit.position.set(this.mesh.position.x,this.mesh.position.y,this.mesh.position.z);            
        }
    }

    removeEntity() {
        this.ConMain.remove( this.mesh );
        this.ConMain.remove( this.hit );
        this.IsDead = true;
        delete this;
        //animate();
    }
}