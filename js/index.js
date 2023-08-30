var camera, scene, renderer,composer, mouseX, mouseY, windowHalfX, windowHalfY;
var controls;
var tunnelgroup;
var tunnelArr=[];
var clicked = false;
var startanimate = false;
var step = 0;
var spacing = 1.5;
var currenttunnelindex = 0;
var clock = new THREE.Clock();
var delta = 0;
var tunnelGlobal = { speed: 0.001,repeatX: 3, repeatY:3 };
var ww = window.innerWidth;
var wh = window.innerHeight;
var mouseGlobal = {
    position: new THREE.Vector2(ww * 0.5, wh * 0.5),
    ratio: new THREE.Vector2(0, 0),
    target: new THREE.Vector2(ww * 0.5, wh * 0.5)
  };
var addTunnelElement = function(url, x, hue){
    var points = [];
    var i = 0;
    var geometry = new THREE.BufferGeometry();

    // var oldx = 0;
    // var oldy = 0;
    // var oldz = 0;
    // for (i = 0; i < 40; i += 1) {
    //     points.push(new THREE.Vector3(0, 0, 0));
    //     if(i<12){
    //         points[i].y = 0;
    //         points[i].x = 0;
    //         points[i].z = i / 8;
    //         oldx = 0;
    //         oldy = 0;
    //         oldz = i / 8;
    //     }else{
    //         var finaly = Math.random()*0.6-0.2;
    //         var finalx = Math.random()*0.6-0.2;
            
    //         points[i].y = finaly;
    //         points[i].x = finalx;
    //         var finalz = oldz + 0.6 - Math.abs(finaly) - Math.abs(finalx);
    //         points[i].z = finalz;

    //         oldx = points[i].y;
    //         oldy = points[i].x;
    //         oldz = points[i].z;

    //     }
    // }

    var numPoints = 20;
    var radius = 0.08;
    var height = 0.1;
    var angleStep = Math.PI * 3 / 7;
    for (i = 0; i < numPoints; i += 1) {
        points.push(new THREE.Vector3(0, 0, 0));
        if(i<6){
            points[i].y = 0;
            points[i].x = 0;
            points[i].z = i / 8;
            oldx = 0;
            oldy = 0;
            oldz = i / 8;
        }else{
            var angle = angleStep * i;
            var myx = radius * Math.cos(angle) + Math.random() * 0.04 - 0.02;
            var myy = radius * Math.sin(angle) + Math.random() * 0.04 - 0.02;
            
            points[i].y = myy;
            points[i].x = myx;
            points[i].z = (i != numPoints - 1) ? oldz + Math.random() * 0.2 : 2;
            oldz = points[i].z;

        }
    }
    
    // points[1].y = 0;
    // points[1].x = 0;
    // points[2].y = 0;
    // points[2].x = 0;
    // points[3].y = 0;
    // points[3].x = 0;
    // points[4].y = 0;
    // points[4].x = 0;
    // points[5].y = 0;
    // points[5].x = 0;
    // points[6].y = Math.random()*0.2-0.1;
    // points[6].x = Math.random()*0.2-0.1;
    // points[7].y = Math.random()*0.2-0.1;
    // points[7].x = Math.random()*0.2-0.1;
    // points[8].y = Math.random()*0.2-0.1;
    // points[8].x = Math.random()*0.2-0.1;
    // points[9].y = Math.random()*0.2-0.1;
    // points[9].x = Math.random()*0.2-0.1;
    // points[10].y = Math.random()*0.2-0.1;
    // points[10].x = Math.random()*0.2-0.1;
    // points[11].y = Math.random()*0.2-0.1;
    // points[11].x = Math.random()*0.2-0.1;
    // points[12].y = Math.random()*0.2-0.1;
    // points[12].x = Math.random()*0.2-0.1;
    // points[13].y = Math.random()*0.2-0.1;
    // points[13].x = Math.random()*0.2-0.1;
    // points[14].y = Math.random()*0.2-0.1;
    // points[14].x = Math.random()*0.2-0.1;
    // points[15].y = Math.random()*0.2-0.1;
    // points[15].x = Math.random()*0.2-0.1;
    // points[16].y = Math.random()*0.2-0.1;
    // points[16].x = Math.random()*0.2-0.1;
    // points[17].y = Math.random()*0.2-0.1;
    // points[17].x = Math.random()*0.2-0.1;

    var curve = new THREE.CatmullRomCurve3(points);

    var geometry = new THREE.BufferGeometry();
    geometry.vertices = curve.getPoints(140);
    geometry.setFromPoints(geometry.vertices);
    var splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0xFF0000, depthTest: false, depthWrite: false}));
    splineMesh.renderOrder = 1

	var tubeTexture = new THREE.TextureLoader().load(url);

    var tubeMaterial2 = new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
        map: tubeTexture,
        toneMapped: false,
    });

    // var tubeMaterial = new THREE.MeshBasicMaterial({
    var tubeMaterial = new THREE.MeshPhysicalMaterial({
        side: THREE.FrontSide,
        // vertexColors: THREE.FaceColors
        vertexColors: true,
        sheen: 0.75,
        sheenColor: new THREE.Color("hsl("+ hue+270 + ", 100%, 60%)"),
    });

    // Repeat the pattern
    tubeMaterial2.map.wrapS = THREE.MirroredRepeatWrapping;
    tubeMaterial2.map.wrapT = THREE.MirroredRepeatWrapping;
    tubeMaterial2.map.repeat.set(tunnelGlobal.repeatX, tunnelGlobal.repeatY);

    var tubeGeometry = new THREE.TubeGeometry(curve, 140, 0.02, 30, false);
    //
    var tubeColors = new Float32Array(tubeGeometry.getAttribute("position").count * 3);
    var p = new THREE.Vector3();
    // for (var i = 0; i < tubeGeometry.faces.length; i++) {
    for (var i = 0; i < tubeGeometry.attributes.position.count; i++) {
        // f = tubeGeometry.faces[i];
        // p = tubeGeometry.vertices[f.a];
        p.set(
            tubeGeometry.getAttribute("position").array[i * 3],
            tubeGeometry.getAttribute("position").array[i * 3 + 1],
            tubeGeometry.getAttribute("position").array[i * 3 + 2]
        )
        var color = new THREE.Color(
            "hsl(" +
                (Math.floor(
                Math.abs(noise.simplex3(p.x * 2, p.y * 4, p.z * 2)) * 80 * 100
                ) *
                0.01 +
                hue) +
            ",140%,60%)"
        );
        color.convertSRGBToLinear();
        // f.color = color;
        tubeColors[i * 3] = color.r;
        tubeColors[i * 3 + 1] = color.g;
        tubeColors[i * 3 + 2] = color.b;
    }
    tubeGeometry.setAttribute('color', new THREE.BufferAttribute(tubeColors, 3));

    var newmaterials = [ tubeMaterial, tubeMaterial2 ];

    var tubeMesh = THREE.SceneUtils.createMultiMaterialObject( tubeGeometry, newmaterials );

	tubeMesh.position.set( x, 0,0 );
    tubeMesh.rotation.z = Math.random();

    var tubeGeometry_o = tubeGeometry.clone();

    var obj ={
        mesh : tubeMesh,
        geometry : tubeGeometry,
        geometry_o: tubeGeometry_o,
        curve: curve,
        splineMesh: splineMesh,
        material: tubeMaterial,
        material2: tubeMaterial2,
        repeatX: tunnelGlobal.repeatX,
        repeatY: tunnelGlobal.repeatY,
        speed: tunnelGlobal.speed,
        hue:hue
    }

    tunnelArr.push(obj);

	return tubeMesh;

    
	
}

function updateCurve() {
    for (let k = 0; k < tunnelArr.length; k++) {
        var i = 0;
        // var index = 0;
        var vertice = new THREE.Vector3();
        var normal = new THREE.Vector3();
        // var vertice_o = new THREE.Vector3();
        var positions = [];
        var normals = [];
        // for (i = 0; i < tunnelArr[k].geometry.vertices.length; i += 1) {
        tunnelArr[k].geometry_o = new THREE.TubeGeometry(tunnelArr[k].curve, 140, 0.02, 30, false);

        for (i = 0; i < tunnelArr[k].geometry.getAttribute("position").count; i+= 1) {
        
        // vertice_o =  tunnelArr[k].geometry_o.vertices[i];
        // vertice = tunnelArr[k].geometry.vertices[i];
        // vertice_o.set(
        //     tunnelArr[k].geometry_o.getAttribute("position").array[i*3],
        //     tunnelArr[k].geometry_o.getAttribute("position").array[i*3+1],
        //     tunnelArr[k].geometry_o.getAttribute("position").array[i*3+2]
        // )
        vertice.set(
            tunnelArr[k].geometry.getAttribute("position").array[i*3],
            tunnelArr[k].geometry.getAttribute("position").array[i*3+1],
            tunnelArr[k].geometry.getAttribute("position").array[i*3+2]
        )
        normal.set(
            tunnelArr[k].geometry.getAttribute("normal").array[i*3],
            tunnelArr[k].geometry.getAttribute("normal").array[i*3+1],
            tunnelArr[k].geometry.getAttribute("normal").array[i*3+2]
        )
        // index = Math.floor(i / 31);
        // vertice.x +=
        // (vertice_o.x + tunnelArr[k].splineMesh.geometry.vertices[index].x - vertice.x) /
        // 10;
        // vertice.y +=
        // (vertice_o.y + tunnelArr[k].splineMesh.geometry.vertices[index].y - vertice.y) /
        // 5;
        
        //
        
        // vertice.x += ((vertice_o.x + tunnelArr[k].splineMesh.geometry.vertices[index].x) - vertice.x) / 15;
        // vertice.y += ((vertice_o.y + tunnelArr[k].splineMesh.geometry.vertices[index].y) - vertice.y) / 15;
        //vertice.applyAxisAngle(new THREE.Vector3(0,0,1), Math.abs(Math.cos(delta*0.001+vertice.z*5))*0.1);
        
        vertice.x += (tunnelArr[k].geometry_o.getAttribute("position").array[i*3] - vertice.x) / 15;
        vertice.y += (tunnelArr[k].geometry_o.getAttribute("position").array[i*3+1] - vertice.y) / 15;
        vertice.z += (tunnelArr[k].geometry_o.getAttribute("position").array[i*3+2] - vertice.z) / 15;

        normal.x += (tunnelArr[k].geometry_o.getAttribute("normal").array[i*3] - normal.x) / 15;
        normal.y += (tunnelArr[k].geometry_o.getAttribute("normal").array[i*3+1] - normal.y) / 15;
        normal.z += (tunnelArr[k].geometry_o.getAttribute("normal").array[i*3+2] - normal.z) / 15;

        // normal.normalize()

        positions.push(vertice.x, vertice.y, vertice.z)
        normals.push(normal.x, normal.y, normal.z)
            
        }
        // tunnelArr[k].geometry.verticesNeedUpdate = true;
        tunnelArr[k].geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
        tunnelArr[k].geometry.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(normals), 3));
        
        // tunnelArr[k].geometry.computeVertexNormals()
        // tunnelArr[k].geometry.normalizeNormals();
        
        var numPoints = 20;
        var radius = 0.02;
        var height = 0.1;
        var angleStep = Math.PI * 2 / 4;
        for (i = 0; i < numPoints; i += 1) {
            if(i<6){
               
            }else{
                var angle = angleStep * i;
                var myx = radius * Math.sin(delta + i) * Math.random() * 0.03
                var myy = radius * Math.cos(delta + i * 0.5) * Math.random() * 0.03
                
                tunnelArr[k].curve.points[i].y += myy;
                tunnelArr[k].curve.points[i].x += myx;

            }
        }


        if(k==currenttunnelindex && startanimate){
            tunnelArr[k].curve.points[4].x =  ((1 - mouseGlobal.ratio.x)  + Math.cos(delta))*0.04;
            tunnelArr[k].curve.points[5].x =  ((1 - mouseGlobal.ratio.x)  + Math.cos(delta))*0.04;
            tunnelArr[k].curve.points[6].x =  ((1 - mouseGlobal.ratio.x)  + Math.cos(delta))*0.04;
            tunnelArr[k].curve.points[7].x =  ((1 - mouseGlobal.ratio.x)  + Math.cos(delta))*0.04;
        
            tunnelArr[k].curve.points[4].y =  ((1 - mouseGlobal.ratio.y)  + Math.cos(delta))*0.04;
            tunnelArr[k].curve.points[5].y =  ((1 - mouseGlobal.ratio.y)  + Math.cos(delta))*0.04;
            tunnelArr[k].curve.points[6].y =  ((1 - mouseGlobal.ratio.y)  + Math.cos(delta))*0.04;
            tunnelArr[k].curve.points[7].y =  ((1 - mouseGlobal.ratio.y)  + Math.cos(delta))*0.04;
        
        }

        tunnelArr[k].curve = new THREE.CatmullRomCurve3(tunnelArr[k].curve.points);

        // tunnelArr[k].splineMesh.geometry.verticesNeedUpdate = true;
        tunnelArr[k].splineMesh.geometry.vertices = tunnelArr[k].curve.getPoints(140);
        tunnelArr[k].splineMesh.geometry.setFromPoints(tunnelArr[k].splineMesh.geometry.vertices);

        // var mydelta = -1*delta* 0.5;
        // var f, p, h, rgb;
        // for (var i = 0; i < tunnelArr[k].geometry.faces.length; i++) {
        // f = tunnelArr[k].geometry.faces[i];
        // p = tunnelArr[k].geometry.vertices[f.a];
        // h = (Math.floor(Math.abs(noise.simplex3(p.x * 2, p.y * 4, p.z * 2 + mydelta)) * 80 * 100) * 0.01 + tunnelArr[k].hue) / 360;
        // rgb = hslToRgb(h, 0.7,0.6)
        // var color = new THREE.Color(rgb[0], rgb[1], rgb[2]);
        // f.color = color;
        // }
        // tunnelArr[k].geometry.elementsNeedUpdate = true;

        
    }
};


function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r*100)*0.01, Math.round(g*100)*0.01, Math.round(b*100)*0.01];
}


function updateTunnel(){
    
    for (let k = 0; k < tunnelArr.length; k++) {
        tunnelArr[k].material2.map.offset.x += tunnelArr[k].speed;
        // tunnelArr[k].mesh.rotation.z -= 0.005;
        if(canchange){
            tunnelArr[k].mesh.rotation.x += (Math.PI / 180 * 0 - tunnelArr[k].mesh.rotation.x) / 30;
            tunnelArr[k].mesh.rotation.y += (Math.PI / 180 * 0 - tunnelArr[k].mesh.rotation.y) / 30;
            tunnelArr[k].mesh.position.y += (0 - tunnelArr[k].mesh.position.y) / 30;
            tunnelArr[k].mesh.position.z += (0 - tunnelArr[k].mesh.position.z) / 30;
        }

    }
}


$(window).on('load', function() {
    init();
    animate();
});


var canchange = true
var timer;
var looptimer ;
var looptimer2 ;
function init() {
    

    $(".prev_btn").click(function(){
        currenttunnelindex--;
        rotateMesh();
    })

    $(".next_btn").click(function(){
        currenttunnelindex++;
        rotateMesh();
    })

    function rotateMesh(){
        clearTimeout(looptimer);
        clearTimeout(looptimer2);
        clearTimeout(timer);
        startanimate=false
        canchange=false;
        //tunnelArr[currenttunnelindex].mesh.rotation.x = (Math.PI / 180 * 90 ) ;
        //tunnelArr[currenttunnelindex].mesh.position.y = 1 ;
        //tunnelArr[currenttunnelindex].mesh.position.z = 0.5 ;
        timer = setTimeout(function(){
            canchange=true
        },0)

       

        for (let k = 0; k < tunnelArr.length; k++) {

            gsap.to(tunnelArr[k], {
                duration: 1.2,
                repeatX: tunnelGlobal.repeatX, 
                repeatY: tunnelGlobal.repeatY, 
                speed: tunnelGlobal.speed, 
                ease: Power1.easeInOut,
                onUpdate: function() {
                    tunnelArr[k].material2.map.repeat.set(
                        tunnelArr[k].repeatX,
                        tunnelArr[k].repeatY
                    );
                    tunnelArr[k].material2.map.offset.x += tunnelArr[k].speed;
                }
            });
        }

        if(clicked){
            gsap.to(tunnelgroup.position, {
                duration: 3,
                y: 0, 
                z: 1.5, 
                ease: Power1.easeInOut,
            });
            setTimeout(function(){
                gsap.to(tunnelgroup.position, {
                    duration: 3,
                    x: -currenttunnelindex*spacing, 
                    ease: Power1.easeInOut,
                });
            },3000)
            clicked=false;
        }else{
            gsap.to(tunnelgroup.position, {
                duration: 3,
                x: -currenttunnelindex*spacing, 
                ease: Power1.easeInOut,
            });
            clicked=false;
        }

        


    }

    $(".enter_btn").click(function(){
        clicked = true;
        clearTimeout(looptimer);
        clearTimeout(looptimer2);

        gsap.to(tunnelgroup.position, {
            duration: 3,
            y: 0, 
            z: 2, 
            ease: Power1.easeInOut,
        });

        function animate1(){
            if(clicked){
                
                looptimer = setTimeout(function(){
                    gsap.to(tunnelArr[currenttunnelindex], {
                        duration: 4,
                        repeatX: 0.5, 
                        repeatY: 3, 
                        speed: 0.005,
                        ease: Power1.easeInOut,
                        onUpdate: function() {
                            tunnelArr[currenttunnelindex].material2.map.repeat.set(
                                tunnelArr[currenttunnelindex].repeatX,
                                tunnelArr[currenttunnelindex].repeatY
                            );
                            tunnelArr[currenttunnelindex].material2.map.offset.x += tunnelArr[currenttunnelindex].speed;
                        }
                    });
                },0)

                looptimer2 = setTimeout(function(){
                    if(clicked){
                        gsap.to(tunnelArr[currenttunnelindex], {
                            duration: 3,
                            repeatX: tunnelGlobal.repeatX, 
                            repeatY: tunnelGlobal.repeatY, 
                            speed: tunnelGlobal.speed, 
                            ease: Power1.easeInOut,
                            onUpdate: function() {
                                tunnelArr[currenttunnelindex].material2.map.repeat.set(
                                    tunnelArr[currenttunnelindex].repeatX,
                                    tunnelArr[currenttunnelindex].repeatY
                                );
                                tunnelArr[currenttunnelindex].material2.map.offset.x += tunnelArr[currenttunnelindex].speed;
                            },
                            onComplete:function(){
                                if(clicked){
                                    animate1();
                                }
                            }
                        });
                    }else{
                        clearTimeout(looptimer);
                        clearTimeout(looptimer2);
                    }
                },4000)
            }else{
                clearTimeout(looptimer);
                clearTimeout(looptimer2);
            }
        }

        animate1();

        
        setTimeout(function(){
            startanimate=true;
        },3000)


    });

	camera = new THREE.PerspectiveCamera( 15, window.innerWidth / window.innerHeight, 0.01, 10 );
  	camera.position.set( 0, 0, 2 );
	scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xb0b0b0, 2, 2.5);        // 0xc8c8c8
	scene.background = new THREE.Color( 0xb0b0b0 );     // 0xc8c8c8

    
	tunnelgroup = new THREE.Group();
    tunnelgroup.add( new addTunnelElement( 'img/bg1.jpg',0, 50 ) );
    tunnelgroup.add( new addTunnelElement( 'img/bg2.jpg',spacing, 100 ) );
    tunnelgroup.add( new addTunnelElement( 'img/bg3.jpg',spacing*2, 150 ) );
    tunnelgroup.add( new addTunnelElement( 'img/bg.jpg',spacing*3, 200 ) );
    tunnelgroup.position.y=0;
    tunnelgroup.position.z=1.5;
    tunnelgroup.rotation.x=Math.PI / 180 * 180;
	scene.add( tunnelgroup );

    tunnelArr.forEach( (obj, index) => {
        // console.log(obj.splineMesh)
        // tunnelgroup.children[index].add( obj.splineMesh );
    })


    const pointLight = new THREE.PointLight( 0xFFFFFF, 20, 1.5, 2)
    pointLight.position.set(-0.5, 0.5, 0)
    scene.add(pointLight)

    const pointLightLocator = new THREE.Mesh(
        new THREE.SphereGeometry(0.01),
        new THREE.MeshNormalMaterial()
    )
    pointLightLocator.position.copy(pointLight.position);
    scene.add(pointLightLocator);


    // const geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 ); 
	// const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
	// const cube = new THREE.Mesh( geometry, material ); 
    // cube.position.set( 0.3, 0, 0 );
	// scene.add( cube );


	window.addEventListener( 'resize', onWindowResize, false );

	// Block iframe events when dragging camera

	var blocker = document.getElementById( 'blocker' );
	blocker.style.display = 'none';


	renderer = new THREE.WebGLRenderer(  );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.style.position = 'fixed';
	renderer.domElement.style.top = 0;
	document.body.appendChild( renderer.domElement );
	controls = new THREE.MapControls( camera, renderer.domElement );

    const environment = new THREE.RoomEnvironment( renderer );
    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    scene.environment = pmremGenerator.fromScene( environment ).texture;

    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMapping = THREE.CineonToneMapping;
    renderer.toneMappingExposure = 2;

	mouseX = 0;
	mouseY = 0;
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	onWindowResize();

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	
}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

    mouseGlobal.target.x = event.clientX;
    mouseGlobal.target.y = event.clientY;
    
}

function updateCameraPosition () {
    mouseGlobal.position.x += (mouseGlobal.target.x - mouseGlobal.position.x) / 30;
    mouseGlobal.position.y += (mouseGlobal.target.y - mouseGlobal.position.y) / 30;
  
    mouseGlobal.ratio.x = mouseGlobal.position.x / ww;
    mouseGlobal.ratio.y = mouseGlobal.position.y / wh;
    if(canchange){
        camera.rotation.z += (Math.PI / 180 * 0 - camera.rotation.z) / 30;
    }else{
        camera.rotation.z += (Math.PI / 180 * 45 - camera.rotation.z) / 30;
    }
    // camera.rotation.y = Math.PI - (mouseGlobal.ratio.x * 0.4 - 0.2);
    // camera.position.y = mouseGlobal.ratio.y * 0.4 - 0.2;
  };

function animate() {
    delta += clock.getDelta();
    updateCurve();
    updateTunnel();
    updateCameraPosition();
	// controls.update();

	renderer.render( scene, camera );

	requestAnimationFrame( animate );
}


