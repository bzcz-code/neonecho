#define M_PI 3.14159265358979323846

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}

vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
float hash(float n) { return fract(sin(n) * 1e4); }
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

float random(float n){return fract(sin(n) * 43758.5453123);}
float random(vec2 co){return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);}
float random(vec2 co, float l) {return random(vec2(random(co), l));}
float random(vec2 co, float l, float t) {return random(vec2(random(co, l), t));}

float permute(float x){return floor(mod(((x*34.)+1.)*x,289.));}
vec3 permute(vec3 x){return mod(((x*34.)+1.)*x,289.);}
vec4 permute(vec4 x){return mod(((x*34.)+1.)*x,289.);}

vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float taylorInvSqrt(float r){return 1.79284291400159-.85373472095314*r;}

vec2 fade(vec2 t){return t*t*t*(t*(t*6.-15.)+10.);}
vec3 fade(vec3 t){return t*t*t*(t*(t*6.-15.)+10.);}