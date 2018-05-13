class Player{

    constructor(playerId, mesh) {
        this.mesh = mesh;
        this.playerId = playerId;
        this.position = mesh.position;
        this.rotation = mesh.rotation;
        this.scale = mesh.scale; 
        this.theta = 90;     
        this.dirangle = 0;     
        this.rho = 10;     
        this.radius = 50;
        this.radiusdir = 10;
        this.vel = new THREE.Vector3();
        this.acel = new THREE.Vector3();
        this.groupVision = new THREE.Group();
        this.meshDirection= new THREE.Mesh( new THREE.BoxBufferGeometry( 1, 1, 1 ), new THREE.MeshPhongMaterial( {color: 0x00ffff} )  );
        this.isAcelerating = false;
        this.radIncrement = 1;
        this.start();
    }

    start(){
        this.scale.set(.5,.5,.5);
        this.position.set(this.radius * Math.sin(this.theta) * Math.sin(this.rho),this.radius * Math.cos(this.theta),this.radius * Math.sin(this.theta) * Math.cos(this.rho));
        this.meshDirection.position.set(this.position.x+10,this.position.y,this.position.z);
        this.groupVision.add(this.meshDirection);
        this.groupVision.add(this.mesh);
    }

    input(controller){
        let force = 50;
        this.isAcelerating = false;
        if(controller.pressed('Left')){
            //Calculate angle
            this.theta -= 0.01;
            //this.rotation.set(0,this.theta,0)
            this.groupVision.position.set((this.radiusdir * Math.sin(this.theta)/* * Math.sin(this.rho)*/)-10,/*(this.radiusdir * Math.cos(this.theta))*/0,(this.radiusdir * Math.cos(this.theta) /** Math.cos(this.rho)*/));
            //this.position.set(this.radius * Math.sin(this.theta) * Math.sin(this.rho),this.radius * Math.cos(this.theta),this.radius * Math.sin(this.theta) * Math.cos(this.rho));
            //console.log("Angle" + this.theta, " Radius" + this.radius);
            //this.applyForce(new THREE.Vector3(-force, 0, 0));
            this.isAcelerating = true;
        }

        if(controller.pressed('Right')){
            this.theta += 0.01;
            this.position.set(this.radius * Math.sin(this.theta) * Math.sin(this.rho),this.radius * Math.cos(this.theta),this.radius * Math.sin(this.theta) * Math.cos(this.rho));
            //this.applyForce(new THREE.Vector3(force, 0, 0));
            this.isAcelerating = true;
        }

        if(controller.pressed('Up')){
            this.theta -= 0.01;
            this.rotation.set(0,this.theta,0)
            this.groupVision.position.set(this.radiusdir * Math.sin(this.theta) * Math.sin(this.rho),this.radiusdir * Math.cos(this.theta),this.radiusdir * Math.sin(this.theta) * Math.cos(this.rho));
            
            //this.applyForce(new THREE.Vector3(0, 0, -force));
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
        //this.meshDirection.rotation.y +=1;
        
        //console.log("Angle" + this.groupVision.rotation.y);
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
        if(this.theta == 359)
            this.theta=0;
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
    }
}