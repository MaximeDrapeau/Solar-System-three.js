/** 
 * Maxime Dapeau DRAM89110108
 * 
 * Le travail a ete fait avec firefox
 */





"use strict";
import * as THREE from 'three';
import { ArcballControls } from 'three/addons/controls/ArcballControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let scene, camera, renderer;  // Bases pour le rendu Three.js
let controls; // Pour l'interaction avec la souris
let canvas;  // Le canevas où est dessinée la scène
let ambient_light;
let camera_light;
let last_render = Date.now();

let stars = [];
let star_count = 400;


let earth_pos = { x: 1, y: 0, z: 0 };
let earth_angle = 0;
let earth = null;
const EARTH_RADIUS = 1;

let l1 = null;
let l2 = null;
let l3 = null;
let l4 = null;
let l5 = null;

let orbit_l2 = null;

let directional_light = null;

// NOTE: Vous pouvez ajouter des variables globales ici au besoin. ======

// ========================================================================

/* Création de la scène 3D */
function createScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0,0,0);

    draw_stars();

    scene.add(draw_sun());

    // TODO: Dessiner la Terre
    draw_earth();
    scene.add(earth);

    scene.add(draw_orbit());

    directional_light = new THREE.DirectionalLight(0xffffff, 1);
    directional_light.target.position.set(earth_pos.x, earth_pos.y, earth_pos.z);
    directional_light.position.set(0, 0 , 0);
    scene.add(directional_light);
    scene.add(directional_light.target);

    // TODO: Dessiner l'orbite L2
    l1 = draw_pyramid(0xff0000);
    l1.position.set(0.7 * Math.cos(earth_angle), 0.7 * Math.sin(earth_angle), 0);
    scene.add(l1);

    l2 = draw_pyramid(0x00ff00);
    l2.position.set(1.3 * Math.cos(earth_angle), 1.3 * Math.sin(earth_angle), 0);
    scene.add(l2);

    l3 = draw_pyramid(0x0000ff);
    l3.position.set(1 * Math.cos(Math.PI + earth_angle), 1 * Math.sin(Math.PI + earth_angle), 0);
    scene.add(l3);

    l4 = draw_pyramid(0xffff00);
    l4.position.set(1 * Math.cos((60 / 180 * Math.PI) + earth_angle), 
                    1 * Math.sin((60 / 180 * Math.PI) + earth_angle), 0);
    scene.add(l4);

    l5 = draw_pyramid(0x00ffff);
    l5.position.set(1 * Math.cos((-60 / 180 * Math.PI) + earth_angle),
                    1 * Math.sin((-60 / 180 * Math.PI) + earth_angle), 0);
    scene.add(l5);

    orbit_l2 = draw_orbit();
    orbit_l2.scale.set(EARTH_RADIUS / 8, EARTH_RADIUS / 8, 1);
    orbit_l2.position.set(l2.position.x, l2.position.y, l2.position.z);
    orbit_l2.material.color.set(0x00ff00);
    scene.add(orbit_l2);


    // Création d'une caméra
    camera = new THREE.PerspectiveCamera(45, canvas.width/canvas.height, 0.1, 100);
    camera.position.x = 2;
    camera.position.y = 2;
    camera.position.z = 1;
    camera.lookAt(0,0,0);
    scene.add(camera);
    ambient_light = new THREE.AmbientLight("white", 0.0); // soft white light
    scene.add( ambient_light );

    camera_light = new THREE.DirectionalLight("white", 0.0);
    camera.add(camera_light);

}

function generate_random_stars() {
    // TODO: a) Générer les positions des étoiles
    for(let i = 0; i < star_count; i++) {
        let radius = Math.random() + 1;
        let x = Math.random() * 2 - 1;
        let y = Math.random() * 2 - 1;
        let z = Math.random() * 2 - 1;
        let normal_x = x / Math.sqrt(x*x + y*y + z*z);
        let normal_y = y / Math.sqrt(x*x + y*y + z*z);
        let normal_z = z / Math.sqrt(x*x + y*y + z*z);
        let pos = {x: normal_x * radius, y: normal_y * radius, z: normal_z * radius}
        stars.push(pos);
    }
}

function generate_pyramid_IFS(){
    // IFS Structure:
    // - vertices: array of 4 3D points (x, y, z) defining the tetrahedron corners
    // - indices: array of triplets, each defining one triangular face
    //
    // Face normal calculation:
    // For each face defined by vertices A, B, C:
    // 1. Compute edge vectors: AB = B - A, AC = C - A
    // 2. Normal = AB × AC (cross product)
    // 3. Normalize the result to unit length
    // Three.js computes this automatically via computeVertexNormals()
    //
    // Faces:
    // - Base:   v0, v1, v2 (bottom triangle)
    // - Side 1: v0, v3, v1 (front-right face)
    // - Side 2: v1, v3, v2 (front-left face)
    // - Side 3: v2, v3, v0 (back face)

    let model = {
        vertices: new Float32Array([
            Math.sqrt(8/9),          0,             -1/3,  
           -Math.sqrt(2/9),  Math.sqrt(2/3),        -1/3,  
           -Math.sqrt(2/9), -Math.sqrt(2/3),        -1/3,  
            0,                       0,              1     
        ]),
        indices: new Uint16Array([
            0, 1, 2,  // base
            0, 3, 1,  // side 1
            1, 3, 2,  // side 2
            2, 3, 0   // side 3
        ])
    };
    return model;
}

function draw_pyramid(color) {  
    const model = generate_pyramid_IFS();
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute('position', new THREE.BufferAttribute(model.vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(model.indices, 1));
    geometry.computeVertexNormals();

    const material = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,          
        emissiveIntensity: 0.2
    });

    const pyramid = new THREE.Mesh(geometry, material);
    pyramid.scale.set(0.05, 0.05, 0.05);
    return pyramid;
}

function draw_sun() {
    let sun = null;
    const geometry = new THREE.SphereGeometry( 0.1, 32, 16 );
    const material = new THREE.MeshBasicMaterial( { color: 0xfaaa00 } );
    sun = new THREE.Mesh( geometry, material );
    return sun;
}

function draw_earth() {
    const geometry = new THREE.SphereGeometry( 0.05, 32, 16 );
    const material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x000000 } );
    earth = new THREE.Mesh( geometry, material );
    earth.position.set(earth_pos.x , earth_pos.y, earth_pos.z);
    // TODO: b) Appliquez la texture
}

function draw_stars() {
    for(let i = 0; i < star_count; i++) {
        const geometry = new THREE.SphereGeometry( 0.002, 8, 8 );
        const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        const sphere = new THREE.Mesh( geometry, material );
        sphere.position.set(stars[i].x, stars[i].y, stars[i].z);
        scene.add( sphere );
    }
    // TODO: a) dessiner les étoiles
}

function draw_orbit(){
    let orbit = null;
    const geometry = new THREE.RingGeometry(0.99, 1, 64);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    material.side = THREE.DoubleSide;
    orbit = new THREE.Mesh(geometry, material);

    return orbit
}

function update_positions() {
    l1.position.set(0.7 * Math.cos(earth_angle), 0.7 * Math.sin(earth_angle), 0);
    l2.position.set(1.3 * Math.cos(earth_angle), 1.3 * Math.sin(earth_angle), 0);
    l3.position.set(1 * Math.cos(Math.PI + earth_angle), 1 * Math.sin(Math.PI + earth_angle), 0);
    l4.position.set(1 * Math.cos((60 / 180 * Math.PI) + earth_angle), 
                    1 * Math.sin((60 / 180 * Math.PI) + earth_angle), 0);
    l5.position.set(1 * Math.cos((-60 / 180 * Math.PI) + earth_angle),
                    1 * Math.sin((-60 / 180 * Math.PI) + earth_angle), 0);

    earth.position.set(Math.cos(earth_angle) , Math.sin(earth_angle), 0);

    orbit_l2.position.set(l2.position.x, l2.position.y, l2.position.z);

    directional_light.target.position.set(earth.position.x, earth.position.y, earth.position.z);
}

function animate() {
    // Ajout d'une lumière de point de vue
    let camera_light_intensity = document.getElementById("toggleViewlight").checked;
    if (camera_light_intensity) {
        camera_light.intensity = 1.0;
    } else {
        camera_light.intensity = 0.0;
    }

    // Ajout d'une lumière ambiante
    let ambient_light_intensity = document.getElementById("controlAmbientLight").value;
    ambient_light.intensity = ambient_light_intensity/ 100;

    // Affichage du gizmo pour l'interaction avec la souris
    let acrball_gizmo = document.getElementById("toggleGizmo");
    if (acrball_gizmo.checked) {
        controls.setGizmosVisible(true);
    } else {
        controls.setGizmosVisible(false);
    }

    // Contrôle de l'animation
    let run_animation = document.getElementById("toggleAnimation");
    if (run_animation.checked) {
        // TODO: d) animer la scène
        earth_angle += 0.01 / (2 * Math.PI);
        update_positions();
    }
    last_render = Date.now();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

}

function init() {
    try {
        canvas = document.getElementById("canvas");
        renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
        renderer.setSize( canvas.clientWidth, canvas.clientHeight );
    }
    catch (e) {
        document.getElementById("canvas-holder").innerHTML="<p><b>Sorry, an error occurred:<br>" +
            e + "</b></p>";
        return;
    }

    // Initialisation de la scène
    generate_random_stars(); // TODO: a) Décommenter cette ligne
    //pyramidIFS = generate_pyramid_IFS(); // TODO: a) Décommenter cette ligne

    // TODO: b) Importation des textures

    // TODO: c) Importer le satellite

    // Création de la scène 3D
    createScene();

    // Ajout de l'interactivité avec la souris
    controls = new ArcballControls(camera, canvas, scene);
    controls.setGizmosVisible(false);

    // Animation de la scène (appelée toutes les 30 ms)
    animate();
}

init();
