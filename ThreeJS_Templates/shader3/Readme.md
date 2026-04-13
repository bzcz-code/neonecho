# Shader3 - Material Lab

![Shader3-Logo](https://bit.ly/shader3-banner)

`Shader3` is a library that extends and customizes built-in Three.js materials, providing enhanced flexibility and control over 3D rendering. With support for shader customization and a suite of noise functions, it enables the creation of unique visual effects for advanced 3D experiences.

## 📑 Table of Contents

- [✨ Features](#-features)
- [📦 Installation](#-installation)
- [🛠️ Usage](#%EF%B8%8F-usage)
  - [🌐 Holographic Material](#-holographic-material)
  - [📜 Creating Custom Materials](#-creating-custom-materials)
    - [Custom Materials APIs](#custom-materials-apis)
- [👾 Noise Functions](#-noise-functions)
- [🌟 Meet the Visionary Behind Shader3](#-meet-the-visionary-behind-shader3)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙌 Acknowledgements](#-acknowledgements)

## ✨ Features

- **New Materials:** Like `MeshHolographicMaterial` for your 3D objects.
- **Custom Shader Materials:** Extend and customize materials like `MeshPhysicalMaterial` , `MeshDepthMaterial` for your 3D objects.
- **Shader Customization:** Modify vertex and fragment shaders with ease for fine-tuned rendering effects.
- **Noise Functions:** A range of noise functions (e.g., Perlin, Simplex) for adding dynamic visual effects to your shaders.

## 📦 Installation

Install `Shader3` using your preferred package manager:

```bash
npm install shader3
```

or

```bash
yarn add shader3
```

### Importing Shader3

You can import the full library or specific materials depending on your project needs:

```typescript
import * as Shader3 from "shader3"; // import all
```

Or for selective imports:

```typescript
import { PhysicalShaderMaterial } from "shader3"; // import specific material
```

Alternatively use the standalone version found in ./dist locally

```html
<script
  type="text/javascript"
  src="https://unpkg.com/shader3/dist/shader3.js"
></script>

<!-- This will give Shader3 -->
```

## 🛠️ Usage

### 🌐 Holographic Material

The `MeshHolographicMaterial` allows you to create a holographic material with customizable properties.

```typescript
import { MeshHolographicMaterial } from "shader3";

const material = new MeshHolographicMaterial({
  // set parameters optional
  color: "red",
});

//update material parameters
material.frame = 10;

//use material
const sphere = new THREE.Mesh(new THREE.SphereGeometry(), material);
```

### Constructor

##### `MeshHolographicMaterial( parameters : Object )`

`parameters` - (optional) an object with one or more properties defining the material's appearance. Any property of the ShaderMaterial (including any property inherited from Material) can be passed in here.

### Properties

See the Three.js [Shader Material](https://threejs.org/docs/?q=shader#api/en/materials/ShaderMaterial) for inherited properties.

- **.frame** : `Number`

  - Represents the current frame of the animation. This can be used to control time in the material. Default is `0`. Range: Any non-negative integer.

#####

- **.map** : `THREE.Texture`

  - The texture map to be applied to the material. This can be any texture, such as an image or procedural texture. Default is `null`.

  #####

- **.color** : `THREE.Color`

  - The base color of the material. This is a `THREE.Color` object and can be set using a color string, hex value, or RGB values. Default is `#FFFFFF`.

  #####

- **.stripCount** : `Number`

  - Controls the number of holographic strips. This multiplier affects the density of the strips in the holographic effect. Default is `20.0`.

  #####

- **.fresnelExponent** : `Number`

  - Determines the strength of the Fresnel effect, which simulates the way light reflects off the surface at glancing angles. Default is `2.0`.

  #####

- **.holographicOffset** : `Number`

  - Adjusts the offset amount for the holographic effect, influencing the displacement of the holographic strips. Default is `1.25`.

  #####

- **.smoothEdgeStart** : `Number`

  - The starting value for the smoothness of glitch start. Default is `0.8`. Range: `0.0` to `1.0`.

  #####

- **.smoothEdgeEnd** : `Number`

  - The ending value for the smoothness of glitch start. Default is `0.0`. Range: `0.0` to `1.0`.

  #####

- **.glitchStrength** : `Number`

  - Controls the intensity of the glitch effect. Higher values result in more pronounced glitches. Default is `0.25`.

  #####

- **.glitchMin** : `Number`

  - The minimum value for the glitch effect's random range. This helps define the lower bound of the glitch intensity. Default is `0.3`.

  #####

- **.glitchMax** : `Number`

  - The maximum value for the glitch effect's random range. This helps define the upper bound of the glitch intensity. Default is `1.0`.

  #####

- **.glitchFrequencyLow** : `Number`

  - The frequency of low-intensity glitches. This controls how often low-level glitches occur. Default is `1.0`.

  #####

- **.glitchFrequencyMid** : `Number`

  - The frequency of medium-intensity glitches. This controls how often mid-level glitches occur. Default is `3.45`.

  #####

- **.glitchFrequencyHigh** : `Number`
  - The frequency of high-intensity glitches. This controls how often high-level glitches occur. Default is `8.76`.

##

### 📜Creating Custom Materials

![Shader3-Demo](https://ik.imagekit.io/technoaayush/shader3/demo.gif)

#### [![Usage](https://img.shields.io/badge/Click%20to%20view%20demo-Usage-green?style=for-the-badge&logo=github)](https://shader3.vercel.app/)

To create and use a custom material, follow the example below:

```typescript
import * as Shader3 from "shader3"; // import all

const material = new Shader3.PhysicalShaderMaterial({
  vertexShader: `
    uniform float time; 
    void main () {
      s3_position.y += sin(s3_position.x + time);
    }
  `,
  fragmentShader: `
    uniform float time;
    void main () {
      gl_FragColor = gl_FragColor * 1.5;
    }
  `,
  uniforms: {
    time: { value: 0.0 },
  },
});
```

In this example, the `PhysicalShaderMaterial` is extended with custom vertex and fragment shaders to create a dynamic effect.

### Custom Materials APIs

Shader3 provides several extended materials, each supporting custom shaders and uniforms:

##### `StandardShaderMaterial`, `PhysicalShaderMaterial`,

##### `MatcapShaderMaterial`, `DepthShaderMaterial`

### Constructor

##### `TypeShaderMaterial( parameters : Object )`

`parameters` - (optional) an object with one or more properties defining the material's appearance. Any property of the MeshTypeMaterial (including any property inherited from Material) can be passed in here.

### Properties

See the Three.js [StandardShaderMaterial](https://threejs.org/docs/?q=shader#api/en/materials/MeshStandardMaterial) / [MeshPhysicalMaterial](https://threejs.org/docs/?q=shader#api/en/materials/MeshPhysicalMaterial) / [MatcapShaderMaterial](https://threejs.org/docs/?q=shader#api/en/materials/MeshMatcapMaterial) / [DepthShaderMaterial](https://threejs.org/docs/?q=shader#api/en/materials/MeshDepthMaterial) for inherited properties.

- **.uniforms** : `{ [uniform: string]: { value: string}  }`

  - **Description**: An optional object containing custom uniforms for the shader. Each uniform is a `THREE.IUniform` object. Example - `{ time : { value:0 } }`

####

- **.vertexShader** : `String`

  - **Description**: An custom vertex shader as a string. Default is an empty string.

####

- **.fragmentShader** : `String`
  - **Description**: An custom fragment shader as a string. Default is an empty string.

### Updating Uniforms

Updating uniforms is as simple as modifying material properties, just like adjusting roughness:

```typescript
material.time = elapsedTime; // Dynamically update time uniform
```

## 👾 Noise Functions

Shader3 provides a variety of noise functions to enhance your visual effects. Here's an example using Perlin noise in a vertex shader:

```typescript
import { perlin } from "shader3";

const vertexShader = `
${perlin}  // Add Perlin noise function
void main () {
  s3_position.y += perlin(s3_position);  // Apply noise
}`;
```

The following noise functions are included by default in Shader3:

### `perlin`

- Implements Perlin noise for 2D and 3D vectors.
- **Functions**:
  - `perlin(P: vec2): float`  
    Returns the Perlin noise value for a 2D input vector.
  - `perlin(P: vec3): float`  
    Returns the Perlin noise value for a 3D input vector.
  - `perlin(P: vec3, rep: vec3): float`  
    Returns repeatable Perlin noise for a 3D input vector with repetition.

### `fbm`

- Implements fractal Brownian motion (fBm) noise.
- **Functions**:
  - `fbm(P: float): float`  
    Returns fBm noise for a 1D input.
  - `fbm(P: vec2): float`  
    Returns fBm noise for a 2D input.
  - `fbm(P: vec3): float`  
    Returns fBm noise for a 3D input.
  - `fbm(P: vec4): float`  
    Returns fBm noise for a 4D input.

### `simplex`

- Implements Simplex noise for generating smooth gradients in 2D or 3D space.
- **Functions**:
  - `simplex(P: vec2): float`  
    Returns the Simplex noise value for a 2D input vector.
  - `simplex(P: vec3): float`  
    Returns the Simplex noise value for a 3D input vector.
  - `simplex(P: vec4): float`  
    Returns the Simplex noise value for a 4D input vector.
  - `simplexFractal(P: vec3): float`  
    Returns the Simplex Fractal noise value for a 3D input vector.

### `truchetPattern`

- Generates a Truchet pattern based on the input values.
- **Parameters**:

  - `s`: A 2D vector input.
  - `i`: A floating-point index to determine the pattern variation.

  ```glsl
  float pattern = truchetPattern(vec2(0.5, 0.8), 2.0);
  ```

## 🌟 Meet the Visionary Behind Shader3

In the heart of the dynamic world of web development, the creator of Shader is making waves with their unique visions and unwavering determination.

### 🎮 Aayush Chouhan - [@aayushchouhan24](https://github.com/aayushchouhan24)

![Aayush Chouhan](https://gravatar.com/userimage/226260988/f5429ad9b09c533449dab984eb05cdbf.jpeg?size=1024)

Aayush Chouhan, a tech lover and gaming enthusiast, embarked on a journey through cyberspace. From freelancing to diving into web and Android development, he honed his skills in programming languages. Joining Sheryians, he embraced Three.js, immersing himself in the captivating realm of 3D graphics, marking an exciting milestone in his career.

[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?style=for-the-badge&logo=Instagram&logoColor=white)](https://www.instagram.com/aayushchouhan_24/) [![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/aayushchouhan24/) [![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/aayushchouhan24)

## 🤝 Contributing

We welcome contributions! If you have ideas for new features, bug fixes, or improvements, feel free to open an issue or submit a pull request on our [GitHub repository](https://github.com/aayushchouhan24/shader3).

## 📄 License

`Shader3` is licensed under the ICS License. For more information, refer to the [LICENSE](LICENSE) file.

## 🙌 Acknowledgements

- **[Three.js](https://threejs.org/):** The core library for 3D rendering.
- **[GLSL](https://en.wikipedia.org/wiki/OpenGL_Shading_Language):** The language used for shader programming.
