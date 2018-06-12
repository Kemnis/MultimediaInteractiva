class Background{

    constructor(scene) {
        this.ConMain = scene;
        this.added = false;
        this.ready = false;
        this.addedW = false;
        this.readyW = false;
        this.SecondMat = new THREE.TextureLoader().load( "assets/Fog.jpg" );
        this.matInit=false;
        this.meshWorld = new THREE.Mesh();
        this.startGame = false;
        this.loadOBJWithMTL("assets/", "planet1.obj", "planet1.mtl", (object) => {
            this.meshWorld = object;  this.readyW = true;
            this.meshWorld.position.set(0,-90,0);
            this.meshWorld.rotation.set(90,0,0);
            this.meshWorld.scale.set(14,14,14);
            this.ConMain.add(this.meshWorld);
            this.addedW = true;
            
        });

        this.time = 0;

        let source = {
            vs: `
                varying vec2 fragCords;
                void main() {
                    fragCords = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }`,
            fs: `
                uniform float u_time;
                uniform sampler2D u_background;
                uniform sampler2D u_fog;

                varying vec2 fragCords;
                void main() {

                    vec4 textureColor = texture2D(u_background, fragCords);
                    vec4 fogColor = texture2D(u_fog, vec2(fragCords.x + u_time * 0.05, fragCords.y));

                    //vec4 finalColor = mix(textureColor, fogColor, 0.5);
                    vec4 inverseFog = (1.0 - fogColor);
                    vec4 finalColor = textureColor * inverseFog * inverseFog * inverseFog;


                    gl_FragColor = vec4(finalColor.rgb, 1.0);
                }`
        } 

        let fogTexture = new THREE.TextureLoader().load('assets/Fog.jpg');
        fogTexture.wrapS = THREE.RepeatWrapping;
        fogTexture.wrapT = THREE.RepeatWrapping;
        fogTexture.repeat.set( 4, 4 );

        let uniforms = {
            u_time: {type: 'f', value: this.time },
            u_background: {type: 't', value: new THREE.TextureLoader().load('assets/Background2.jpg') },
            u_fog: {type: 't', value: fogTexture },
        };

        this.shaderMaterial = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: source.vs,
            fragmentShader: source.fs
        } );

    }

    start(){
        let geometry = new THREE.PlaneGeometry( 5, 20, 32 );
        let material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );


        let material1 = this.SecondMat;
        let materials = {material, material1 };
        let plane = new THREE.Mesh( geometry, this.shaderMaterial );
        plane.rotation.set(THREE.Math.degToRad(-90),0,0);
        plane.position.set(0,-180,0);
        plane.scale.set(150,20,1);
        this.ConMain.add(plane);
        this.meshWorld.position.set(0,-90,0);
        this.meshWorld.rotation.set(90,0,0);
        this.meshWorld.scale.set(14,14,14);
        if (this.addedW == false && this.readyW == true)
        {
            this.ConMain.add(this.meshWorld);
            this.addedW = true;
            this.startGame = true;
        }
        
    }
    update(dt, startGame){
        this.time += dt;
        this.shaderMaterial.needsUpdate = true;
        this.shaderMaterial.uniforms.u_time.value = this.time;
        this.startGame = startGame;
        if(this.startGame == true)
        {
            this.meshWorld.rotation.y += .001;            
        }
        
        if(timeleft > 3 && this.matInit == false)
        {
            
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