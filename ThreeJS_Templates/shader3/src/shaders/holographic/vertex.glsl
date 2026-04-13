#include <common>
#include <fog_pars_vertex>
#include <shadowmap_pars_vertex>
#include <skinning_pars_vertex>

uniform float frame;

uniform float glitchStrength ;
uniform float glitchMin ;
uniform float glitchMax ;
uniform float glitchFrequencyLow ;
uniform float glitchFrequencyMid ;
uniform float glitchFrequencyHigh ;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

varying vec3 fogPosition;
varying vec3 vWorldPosition;


#include ..\includes\random2D.glsl

void main() {

    #include <skinbase_vertex>
	#include <begin_vertex>
	#include <beginnormal_vertex>
	#include <defaultnormal_vertex>
	vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
	#include <skinning_vertex>
	#include <project_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>

	fogPosition = mvPosition.xyz;
	vWorldPosition = worldPosition.xyz;

    vec4 modelPosition = mvPosition;

    float glitchTime = frame - modelPosition.y;

    float strength = sin(glitchTime * glitchFrequencyLow) + sin(glitchTime * glitchFrequencyMid) + sin(glitchTime * glitchFrequencyHigh);

    strength /= 3.0;

    strength = smoothstep(glitchMin, glitchMax, strength);

    strength *= glitchStrength;

    modelPosition.x += (random2D(modelPosition.xy + frame) - 0.5) * strength;
    modelPosition.z += (random2D(modelPosition.zx + frame) - 0.5) * strength;

    gl_Position = projectionMatrix *  modelPosition;

    vPosition = modelPosition.xyz;
    vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
    vUv = uv;
}