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

// NOTE: Vous pouvez ajouter des variables globales ici au besoin. ======

// ========================================================================

/* Création de la scène 3D */
function createScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0,0,0);

    draw_stars();

    // TODO: a) Dessiner le système Terre-Soleil et leurs points de Lagrange
    draw_sun();

    // TODO: Dessiner la Terre

    // TODO: Dessiner l'orbite de la planète

    // TODO: Ajout d'une source de lumière directionnelle

    // TODO: Dessiner les points de Lagrange et l'orbite L2

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
    let model = {}
    // TODO: a) Créer le modèle IFS de la pyramide
    return model
}

function draw_pyramid() {
    let pyramid = null;
    // TODO: a) Dessiner la pyramide
    return pyramid
}

function draw_sun() {
    const geometry = new THREE.SphereGeometry( 0.01, 32, 16 );
    const material = new THREE.MeshBasicMaterial( { color: 0xfaaa00 } );
    const sphere = new THREE.Mesh( geometry, material );
    sphere.position.set(0, 0, 0);
    scene.add( sphere );
}

function draw_earth() {
    let earth = null;
    // TODO: a) Dessiner la planète
    // TODO: b) Appliquez la texture
    return earth
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
    // TODO: a) dessiner l'orbite de la planète
    return orbit
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

    // TODO: a) calcul des positions des points de Lagrange

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
