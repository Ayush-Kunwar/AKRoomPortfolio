import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import Preloader from "../Preloader.js";
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
export default class Room {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.room = this.resources.items.room;
        this.actualRoom = this.room.scene;
        this.roomChildren = {};
        this.preloader = this.experience.preloader;
        this.lerp = {
            current: 0,  
            target: 0,
            ease: 0.1,

        };

        this.setModel();
        this.setAnimation();
        this.onMouseMove();
    }
    setModel () {
        console.log(this.actualRoom)
        this.actualRoom.children.forEach(child =>{
            child.castShadow = true;
            child.receiveShadow = true;

            if(child instanceof THREE.Group){
                child.children.forEach((groupchild) => {
                    groupchild.castShadow = true;
                    groupchild.receiveShadow = true;
                })
            }

            if(child.name === "Aquarium"){
                child.children[0].material = new THREE.MeshPhysicalMaterial();
                child.children[0].material.roughness = 0;
                child.children[0].material.color.set(0x549dd2);
                child.children[0].material.ior = 1;
                child.children[0].material.transmission = 1;
                child.children[0].material.opacity = 1;
            }

            if(child.name === "Computer"){
                child.children[1].material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.Screen,
                })
            }

            if(child.name === "Mini_Floor"){
                child.position.z = 0;
                child.position.y = 0;
                child.position.x = 5.58605; 
            }

        //}
            child.scale.set(0,0,0);
            if (child.name === "Cube"){
                //child.scale.set(2,2,2)
                child.position.set(0, -1.5, 0)
                child.rotation.y = Math.PI/4;
            }

            this.roomChildren[child.name.toLowerCase()] = child;

        });

        const width = 0.5;
        const height = 1;
        const intensity = 20;
        const rectLight = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
        rectLight.position.set( 14.5, 17.5, -2);
        this.actualRoom.add( rectLight )
        this.roomChildren["rectLight"] = rectLight;



    //const rectLightHelper = new RectAreaLightHelper( rectLight );
    //rectLight.add( rectLightHelper );

        rectLight.rotation.x = -Math.PI/2;
        rectLight.rotation.z = Math.PI/4;
        this.scene.add(this.actualRoom);
        this.actualRoom.scale.set(0.11, 0.11, 0.11)
        this.actualRoom.rotation.y = Math.PI;
    }

    setAnimation() {
        console.log(this.room)
        this.mixer = new THREE.AnimationMixer(this.actualRoom);
        this.swim = this.mixer.clipAction(this.room.animations[18]);
        //this.swim.play();
        
    }
    
    onMouseMove(){
        window.addEventListener("mousemove", (e) =>{
            this.rotation = ((e.clientX - window.innerWidth / 2)*2)/window.innerWidth;
        this.lerp.target = this.rotation*0.1;
        })
    };

    resize() {

    }

    update() {
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );    
    
        this.actualRoom.rotation.y = this.lerp.current;

        this.mixer.update(this.time.delta * 0.0009);

    }

}