import * as THREE from 'three';
import { processShader } from './utils';

import holographicVertexShader from './shaders/holographic/vertex.glsl';
import holographicFragmentShader from './shaders/holographic/fragment.glsl';


interface ShaderMaterialParams extends THREE.ShaderMaterialParameters {
  uniforms?: { [uniform: string]: THREE.IUniform };
  vertexShader?: string;
  fragmentShader?: string;
}
interface MeshPhysicalMaterialParams extends THREE.MeshPhysicalMaterialParameters, ShaderMaterialParams { }
interface MeshStandardMaterialParams extends THREE.MeshStandardMaterialParameters, ShaderMaterialParams { }
interface MeshDepthMaterialParams extends THREE.MeshDepthMaterialParameters, ShaderMaterialParams { }
interface MeshMatcapMaterialParameters extends THREE.MeshMatcapMaterialParameters {
  uniforms?: { [uniform: string]: THREE.IUniform };
  vertexShader?: string;
  fragmentShader?: string;
}

interface MeshHolographicMaterialParams extends THREE.ShaderMaterialParameters {
  frame?: number;
  useMap?: boolean;
  map?: THREE.Texture;
  color?: string;
  stripCount?: number;
  fresnelExponent?: number;
  holographicOffset?: number;
  smoothEdgeStart?: number;
  smoothEdgeEnd?: number;
  glitchStrength?: number;
  glitchMin?: number;
  glitchMax?: number;
  glitchFrequencyLow?: number;
  glitchFrequencyMid?: number;
  glitchFrequencyHigh?: number;
}

export class MeshStandardMaterial extends THREE.MeshStandardMaterial {
  constructor(parameters?: MeshStandardMaterialParams) {
    super(parameters as MeshStandardMaterialParams);
    parameters && configureShaderMaterial(this, parameters);
  }
}

export class MeshPhysicalMaterial extends THREE.MeshPhysicalMaterial {
  constructor(parameters?: MeshPhysicalMaterialParams) {
    super(parameters as MeshPhysicalMaterialParams);
    parameters && configureShaderMaterial(this, parameters);
  }
}

export class MeshDepthMaterial extends THREE.MeshDepthMaterial {
  constructor(parameters?: MeshDepthMaterialParams) {
    super(parameters as MeshDepthMaterialParams);
    parameters && configureShaderMaterial(this, parameters);
  }
}

export class MeshMatcapMaterial extends THREE.MeshMatcapMaterial {
  constructor(parameters?: MeshMatcapMaterialParameters) {
    super(parameters as MeshMatcapMaterialParameters);
    parameters && configureShaderMaterial(this, parameters);
  }
}

export class MeshHolographicMaterial extends THREE.ShaderMaterial {
  frame?: number;
  map?: THREE.Texture;
  color?: string;
  stripCount?: number;
  fresnelExponent?: number;
  holographicOffset?: number;
  smoothEdgeStart?: number;
  smoothEdgeEnd?: number;
  glitchStrength?: number;
  glitchMin?: number;
  glitchMax?: number;
  glitchFrequencyLow?: number;
  glitchFrequencyMid?: number;
  glitchFrequencyHigh?: number;
  constructor(parameters?: MeshHolographicMaterialParams) {
    const vertexShader = holographicVertexShader;
    const fragmentShader = holographicFragmentShader;

    super({
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      ...parameters
    });

    this.uniforms = {
      frame: { value: parameters?.frame ?? 0 },
      useMap: { value: !!parameters?.map },
      map: { value: parameters?.map ?? null },
      color: { value: new THREE.Color(parameters?.color ?? '#FFFFFF') },
      stripCount: { value: parameters?.stripCount ?? 20.0 },
      fresnelExponent: { value: parameters?.fresnelExponent ?? 2.0 },
      holographicOffset: { value: parameters?.holographicOffset ?? 1.25 },
      smoothEdgeStart: { value: parameters?.smoothEdgeStart ?? 0.8 },
      smoothEdgeEnd: { value: parameters?.smoothEdgeEnd ?? 0.0 },
      glitchStrength: { value: parameters?.glitchStrength ?? 0.25 },
      glitchMin: { value: parameters?.glitchMin ?? 0.3 },
      glitchMax: { value: parameters?.glitchMax ?? 1.0 },
      glitchFrequencyLow: { value: parameters?.glitchFrequencyLow ?? 1.0 },
      glitchFrequencyMid: { value: parameters?.glitchFrequencyMid ?? 3.45 },
      glitchFrequencyHigh: { value: parameters?.glitchFrequencyHigh ?? 8.76 }
    };

    this.setupUniformProperties();
  }

  private setupUniformProperties() {
    Object.keys(this.uniforms).forEach(prop => {
      Object.defineProperty(this, prop, {
        get: () => this.uniforms[prop]?.value,
        set: (newValue: any) => {
          if (prop === 'color' && newValue instanceof THREE.Color) this.uniforms[prop].value.set(newValue);
          else if (prop === 'map') {
            this.uniforms[prop].value = newValue;
            this.uniforms.useMap.value = newValue !== null
          }
          else this.uniforms[prop].value = newValue;
        },
        enumerable: true,
        configurable: true
      });
    });
  }
}

function configureShaderMaterial(material: { [key: string]: any }, obj: ShaderMaterialParams) {

  const { uniforms: objUniforms = {}, vertexShader = '', fragmentShader = '' } = obj || {};

  Object.keys(objUniforms).forEach(key => {
    if (!(key in material)) {
      let uniform = objUniforms[key];
      Object.defineProperty(material, key, {
        get: () => uniform.value,
        set: (newValue) => (uniform.value = newValue),
        enumerable: true,
        configurable: true,
      });
    }
  });

  material.onBeforeCompile = (shader: any) => {
    const { uniforms: shaderUniforms } = shader;

    Object.keys(objUniforms).forEach(key => (!(key in shaderUniforms)) && (shaderUniforms[key] = objUniforms[key]))

    if (vertexShader) {
      const { header, mainBody } = processShader(vertexShader, 'vertex');
      shader.vertexShader = `${header}\n${shader.vertexShader}`.replace('#include <project_vertex>', `
              vec3 s3_position = transformed;
              ${mainBody}
              transformed = s3_position;
              #include <project_vertex>`
      ).replace('#include <beginnormal_vertex>', `
              #include <beginnormal_vertex>
             { 
              vec3 s3_normal = objectNormal;
              ${mainBody.replace(/s3_position/g, 's3_normal')}
              objectNormal = s3_normal;
              #ifdef USE_TANGENT
              vec3 s3_tangent = objectNormal;
              ${mainBody.replace(/s3_position/g, 's3_tangent')}              
              objectTangent = s3_tangent;
              #endif          
              }`);
    }

    if (fragmentShader) {
      const { header, mainBody } = processShader(fragmentShader, 'fragment');
      shader.fragmentShader = `${header} \n ${shader.fragmentShader.trim().slice(0, -1)} ${mainBody}}`;
    }
  };
}
