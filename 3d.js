
function generatePlane(width, height, widthSegment, heightSegment){
    planeMesh.geometry.dispose()
    planeMeshColor.geometry.dispose()

    planeMesh.geometry = new THREE.PlaneGeometry( width, height, widthSegment, heightSegment );
    planeMeshColor.geometry = new THREE.PlaneGeometry( width, height, widthSegment, heightSegment );
  
    const {array} = planeMesh.geometry.attributes.position;  
    const {array : arrayColor} = planeMeshColor.geometry.attributes.position;  
    for (let i= 0; i < array.length; i+=3) {
        const z = array[i+2]
        array[i+2] = z + Math.random() 
        arrayColor[i+2] = array[i+2]    

    }     
    randomization();
    const colors = []
    for (let i= 0; i < planeMesh.geometry.attributes.position.count; i++){
        colors.push(0,.10,.4)
    }
    planeMesh.geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors),3))  
    planeMeshColor.geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors),3))  
}

const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();


renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);


const meshMove = (p_Init,p_Final)=>{
    let camera_position_Initial = {x: p_Init, y: 0, z:0}
    let camera_tween = new TWEEN.Tween(camera_position_Initial)
    camera_tween.to({x: p_Final}, 1000)
    camera_tween.start()
    camera_tween.onUpdate( (object) =>{

    camera.rotation.set(object.x, 0, 0);
    })
}

const meshMove_fast = (opt)=>{

    if (opt==1){
        let camera_position_Initial = {x: 50, y: 50}
        let camera_tween = new TWEEN.Tween(camera_position_Initial)
        camera_tween.to({x: 90, y:190}, 1000)
        camera_tween.start()
        camera_tween.onUpdate( (object) =>{
    
            generatePlane(100, 100, object.x, object.y);
        
        })
    }else {
        let camera_position_back = {x: 90, y: 190}
        let camera_tween_back = new TWEEN.Tween(camera_position_back)
        camera_tween_back.to({x: 50, y:50}, 1500)
        camera_tween_back.start()
        camera_tween_back.onUpdate( (object) =>{
    
            generatePlane(100, 100, object.x, object.y);
        })
    }
}

camera.position.z = 40;

const planeGeometry = new THREE.PlaneGeometry( 100, 100, 50, 50 );

const planeMaterial_Transparent = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading,
   // vertexColors: true,
    wireframe: true 
  
})


const planeMaterial = new THREE.
    MeshPhongMaterial( {
        color: 0xffffff, 
        opacity: .1,
        transparent: true,
        side: THREE.DoubleSide,
        flatShading: THREE.FlatShading,
       
        vertexColors: true
        } 
        );


const materials = new THREE.MultiMaterial([planeMaterial, planeMaterial_Transparent])     
   
const planeMesh = new THREE.Mesh( planeGeometry,  materials[1]);
const planeMeshColor = new THREE.Mesh( planeGeometry,  materials[0]);

//vertice position randomization

const randomization = ()=>{
    const randomValues = [];
    const {array} = planeMesh.geometry.attributes.position;  
    const {array : arrayColor} = planeMeshColor.geometry.attributes.position;  
   
        for (let i= 0; i < array.length; i++) {

            if (i % 3===0){
                const x = array[i]
                const y = array[i+1]
                const z = array[i+2]
                array[i] = x + (Math.random() - 0.5)  * 3
                array[i+1] = y + (Math.random() - 0.5) *3 
                array[i+2] = z + (Math.random() - 0.5) * 3
                arrayColor[i] =  array[i]; 
                arrayColor[i+1] = array[i+1];
                arrayColor[i+2] =  array[i+2]; 
            }
            randomValues.push(Math.random() * Math.PI *2)
        } 
    planeMesh.geometry.attributes.position.randomValues = randomValues
    planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array;  
    planeMeshColor.geometry.attributes.position.randomValues = randomValues
    planeMeshColor.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array;  
}

randomization();
scene.add(planeMesh)
scene.add(planeMeshColor)

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1);
scene.add(light)

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight)


scene.background = new THREE.Color( 0xffffff );


const mouse = {
    x: undefined,
    y: undefined
}

let frame = 0;

const animate = () => {
   
    TWEEN.update();

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    raycaster.setFromCamera(mouse, camera);
    frame += 0.01
     
    const {array, originalPosition, randomValues} = planeMesh.geometry.attributes.position
    const {array : arrayColor, originalPositionColor, randomValuesColor} = planeMeshColor.geometry.attributes.position
  
    for (let i = 0; i < array.length; i += 3){
        array[i] = originalPosition[i] +  Math.cos(frame + randomValues[i]) * 0.01;           
        array[i+1] = originalPosition[i+1] +  Math.cos(frame + randomValues[i+1]) * 0.01; 
        arrayColor[i] =  array[i]; 
        arrayColor[i+1] = array[i+1];       
    }    

    planeMesh.geometry.attributes.position.needsUpdate = true
    planeMeshColor.geometry.attributes.position.needsUpdate = true

    const intersects = raycaster.intersectObject(planeMeshColor)

    if (intersects.length > 0){
        const {color} = intersects[0].object.geometry.attributes
        intersects[0].object.geometry.attributes.color.needsUpdate = true;
      
        
        const initialColor ={
            r :0,
            g :0,
            b :0
        }

        const hoverColor ={
            r :1,
            g :1,
            b :1
        }

        gsap.to(hoverColor,{
            r: initialColor.r,
            g : initialColor.g,
            b : initialColor.b,
            duration: 1,
            onUpdate: () => {
                
             
                color.setX(intersects[0].face.a, hoverColor.r);
                color.setY(intersects[0].face.a, hoverColor.g);
                color.setZ(intersects[0].face.a, hoverColor.b);
              

                //vertice 2
                color.setX(intersects[0].face.b, hoverColor.r);
                color.setY(intersects[0].face.b,hoverColor.g);
                color.setZ(intersects[0].face.b,hoverColor.b);

                //vertice 3
                color.setX(intersects[0].face.c,hoverColor.r);
                color.setY(intersects[0].face.c, hoverColor.g);
                color.setZ(intersects[0].face.c,hoverColor.b);
            
            }
        })
    }
}

const colors = []
for (let i= 0; i < planeMesh.geometry.attributes.position.count; i++){
    colors.push(0,.10,.4)

}

planeMeshColor.geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors),3))

animate();

addEventListener("mousemove", (e) =>{
    mouse.x = (e.clientX / innerWidth) * 2 -1; 
    mouse.y = -(e.clientY / innerHeight) * 2 +1
})