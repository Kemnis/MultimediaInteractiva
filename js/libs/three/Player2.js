class Player{

    constructor(playerId, mesh, scene) {
        this.mesh = mesh;
        this.playerId = playerId;
        this.position = mesh.position;
        this.rotation = mesh.rotation;
        this.scale = mesh.scale; 
        this.vel = new THREE.Vector3();
        this.acel = new THREE.Vector3();
        this.isAcelerating = false;

        this.lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
        this.lineGeometry = new THREE.Geometry();
        this.lineGeometry.vertices.push(new THREE.Vector3( -10, 0, 0) );
        this.lineGeometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
        this.lineGeometry.vertices.push(new THREE.Vector3( 10, 0, 0) );
        this.line = new THREE.Line(this.lineGeometry, this.lineMaterial);

        this.scene = scene;
        this.scene.add(this.line);
        this.start();

        this.worldUp = new THREE.Vector3(1, 0, 0);
        this.worldRight = new THREE.Vector3(0, 0, 1);
        this.worldFront = new THREE.Vector3(0, 1, 0);

        //this.mesh.quaternion.setFromAxisAngle(this.front, 0);
        
        this.orientDirectionVectors();

        this.planetRad = 10;
        this.planetPosition = new THREE.Vector3(0.0, -10.0, 0.0);
    }

    start(){
        this.scale.set(.5,.5,.5);
        //this.position.set(this.radius * Math.sin(this.theta) * Math.sin(this.rho),this.radius * Math.cos(this.theta),this.radius * Math.sin(this.theta) * Math.cos(this.rho));
    }

    input(controller){
        let force = 50;
        this.isAcelerating = false;
        if(controller.pressed('Left')){
            this.applyForce(this.right.clone().multiplyScalar(-force));
            this.isAcelerating = true;
        }

        if(controller.pressed('Right')){
            this.applyForce(this.right.clone().multiplyScalar(force));
            this.isAcelerating = true;
        }

        if(controller.pressed('Up')){
            this.applyForce(this.up.clone().multiplyScalar(force));
            this.isAcelerating = true;
        }

        if(controller.pressed('Down')){
            this.applyForce(this.up.clone().multiplyScalar(-force));
            this.isAcelerating = true;
        }
    }

    applyForce(force) {
        this.acel.add(force);
        //this.acel.clampLength(0, 10);
    }

    orientDirectionVectors(){
        this.up = this.worldUp.clone().applyQuaternion(this.mesh.quaternion);
        this.right = this.worldRight.clone().applyQuaternion(this.mesh.quaternion);
        this.front = this.worldFront.clone().applyQuaternion(this.mesh.quaternion);
    }

    orientRightVector(){
        //this.up = this.worldUp.clone().applyQuaternion(this.mesh.quaternion);
        this.right = this.worldRight.clone().applyQuaternion(this.mesh.quaternion);
        //this.front = this.worldFront.clone().applyQuaternion(this.mesh.quaternion);
    }

    setPositionToPlanet() {
        let dir = this.position.clone().sub(this.planetPosition); //this.planetPosition.clone().sub(this.position);
        if(dir.lengthSq() != (this.planetRad * this.planetRad)){
            dir.normalize();
            dir.multiplyScalar(this.planetRad);
            
            this.setPosition(this.planetPosition.clone().add(dir));

            this.front = dir.clone();
            this.up.crossVectors(this.right.clone(), this.front.clone());
            let matrix = new THREE.Matrix4();
            matrix.fromArray([
                this.right.x, this.front.x, this.up.x, 0,
                this.right.y, this.front.y, this.up.y, 0,
                this.right.z, this.front.z, this.up.z, 0,
                0           , 0           , 0        , 1                
            ]);
            this.mesh.quaternion.setFromRotationMatrix(matrix);
            this.orientRightVector();
            //this.mesh.quaternion.setFromUnitVectors(this.up, this.right);    
            //this.orientRightVector();        
            //this.right.crossVectors(dir, this.up);
        }
    }

    setPosition(newPos){
        this.position.set(newPos.x, newPos.y, newPos.z);
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
        this.vel.addScaledVector(this.acel, dt);
        this.vel.clampLength(0, 20);                
        this.position.addScaledVector(this.vel, dt);
        this.acel.set(0, 0, 0);

        this.setPositionToPlanet();
        ///this.setPosition(this.getPlanetRelativePosition());
        //this.orientDirectionVectors();

        //console.log(this.up);
        if(this.vel.lengthSq() > 1) {
            let faceDirection = this.vel.clone().normalize();
            //faceDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(-90));
            let axis = new THREE.Vector3(1, 0, 0);
            //this.mesh.quaternion.setFromUnitVectors(axis, faceDirection.clone().normalize());
            //this.mesh.quaternion.setFromAxisAngle(axis, 45);
            let geometry = new THREE.Geometry();
            let lineStart = this.position.clone();
            let lineEnd = this.up.clone().multiplyScalar(5.0).add(lineStart);
            geometry.vertices.push(lineStart);
            geometry.vertices.push(lineEnd);
            
            //let line = new THREE.Line(geometry, this.lineMaterial);
            this.line.geometry = geometry;
            //this.scene.add(line);
        }
    }
}