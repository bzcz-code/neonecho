uniform float frame;
uniform vec3 color;
uniform float stripCount; 
uniform float fresnelExponent ; 
uniform float holographicOffset ; 
uniform float smoothEdgeStart; 
uniform float smoothEdgeEnd; 
uniform sampler2D map; 
uniform bool useMap;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv; 

void main() {
    vec3 normal = normalize(vNormal);

    float strips = mod((vPosition.y - frame * .02) * stripCount, 1.); 
    strips = pow(strips, 3.);

    vec3 viewDirection = normalize(vPosition - cameraPosition);

    float fresnel = 1. - abs(dot(viewDirection, normalize(normal)));
    fresnel = pow(fresnel, fresnelExponent);

    float holographic = fresnel * strips; 
    holographic += fresnel * holographicOffset; 
    holographic *= smoothstep(smoothEdgeStart, smoothEdgeEnd, fresnel); 

    vec4 mapColor = useMap ? texture2D(map, vUv) : vec4(1.0); 
    gl_FragColor = vec4(color * mapColor.rgb, holographic); 

    #include <tonemapping_fragment> 
    #include <colorspace_fragment>
}