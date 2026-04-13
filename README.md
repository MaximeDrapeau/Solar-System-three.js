**Author:** Maxime Dapeau (DRAM89110108)  
**Browser used:** Firefox

---

## Description

A 3D schematic representation of the James-Webb Space Telescope's orbit around the Lagrange point L2 of the Earth-Sun system, built with Three.js and Blender.

---

## Required Files

- `tp2.html` — Main web page
- `tp2.js` — Three.js JavaScript code
- `tp2_satellite.blend` — Blender satellite model
- `tp2_satellite.glb` — Exported GLTF model
- `tp2_texture_planete.kra` — Krita source file for the texture
- `tp2_texture_planete.jpg` — Planet surface texture (512×256)
- `tp2_etoile.png` — Star sprite texture
- `tp2_sphere.obj` — Sphere model

---

## How to Run

The project must be run through a local server due to CORS restrictions.
Open a terminal in the project folder and run:
```bash
python3 -m http.server 8000
```

Then open in Firefox:

```
http://localhost:8000/tp2.html
```

---

## Features

**a) 3D Scene**
- Sun at the center (yellow/orange sphere, always visible)
- Earth orbiting at radius = 1 (white sphere with texture)
- Earth's orbit (white circle)
- 5 Lagrange points represented by colored tetrahedra (IFS):
  - L1 red (r=0.7), L2 green (r=1.3), L3 blue (r=1.0, θ=180°), L4 yellow (r=1.0, θ=60°), L5 cyan (r=1.0, θ=-60°)
- Green James-Webb orbit centered on L2 (radius = 1/8 of Earth's orbit)
- 400 randomly placed stars as sprites at distance 1 to 2 from the sun
- Directional light illuminating the Sun-facing side of Earth

**b) Texture**
- Fictional planet surface texture drawn in Krita (512×256)
- Linear minification filter
- Horizontal repeat mode (wrapS = RepeatWrapping)

**c) Satellite**
- Modelled in Blender with body, solar panels, dome, and antenna
- Imported via GLTFLoader
- Placed on the green orbit around L2
- Solar panels oriented perpendicular to the orbital plane

**d) Animation**
- `earth_system.rotation.z` — rotation of Earth, Lagrange points and satellite around the Sun (θ2)
- `satellite_angle` — satellite orbiting around L2 (θ1)
- `planet_texture.offset` — texture translation simulating Earth's axial rotation (tx)
- The Sun and stars remain stationary

---

## Interactive Controls

- **Animate** — toggles the animation on/off
- **Arcball Gizmo** — shows the camera control gizmo
- **Camera Viewlight** — enables a directional light from the camera
- **AmbientLight** — controls ambient light intensity (slider)
- **Mouse** — camera rotation and zoom via ArcballControls