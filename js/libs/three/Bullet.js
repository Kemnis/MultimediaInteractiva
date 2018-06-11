class Bullet{

    constructor(scene, playerMesh, FaceRef, size, force) {
        this.rad = size;
        this.BulletGeometry = new THREE.SphereGeometry(this.rad, 40, 40, 0, Math.PI * 2, 0, Math.PI * 2);
        this.BulletMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, transparent: true, opacity: 1});
        this.mesh = new THREE.Mesh(this.BulletGeometry,this.BulletMaterial);
        this.ConMain = scene;
        this.Ref = FaceRef;
        this.origen = playerMesh;
        this.vel = new THREE.Vector3();
        this.acel = new THREE.Vector3();
        this.isAcelerating = false;
        this.ShootForce = force;
        this.MaxDistZ = 40;
        this.MaxDistX = 65;
        this.alive = true;
        this.start();
    }
    start(){
        let Spawn = new THREE.Vector3();
        Spawn.setFromMatrixPosition( this.Ref.matrixWorld );
        this.mesh.position.set(Spawn.x,Spawn.y,Spawn.z);
        this.ConMain.add(this.mesh);
        this.applyImpulse(this.ShootForce);        
    }
    applyForce(force) {
        this.acel.add(force);
    }
    applyImpulse(force) {
        let Dest = new THREE.Vector3();
        Dest.setFromMatrixPosition( this.Ref.matrixWorld );
        let Distance = new THREE.Vector3();
        Distance.x = (Dest.x - this.origen.position.x);
        Distance.y = (Dest.y - this.origen.position.y);
        Distance.z = (Dest.z - this.origen.position.z);
        let ForceResult = Distance;
        ForceResult.normalize();
        ForceResult.multiplyScalar(this.ShootForce);
        this.vel.add(ForceResult);
    }
    update(dt){
        //this.vel.addScaledVector(this.acel, dt);
        //this.vel.clampLength(0, 40);                
        this.mesh.position.addScaledVector(this.vel, dt);
        //this.acel.set(0, 0, 0);
        if(this.mesh.position.x >= this.MaxDistX || this.mesh.position.x <= -this.MaxDistX)
            this.removeEntity();
        if(this.mesh.position.z >= this.MaxDistZ || this.mesh.position.z <= -this.MaxDistZ)
           this.removeEntity();
    }
    removeEntity() {
        this.ConMain.remove( this.mesh );
        delete this;
        //animate();
    }
}